// Simulando um banco de dados local
let database = [];
let idCounter = 1; // ID sempre começa do 1

document.getElementById("send-request").addEventListener("click", function () {
    const method = document.getElementById("method").value;
    const url = document.getElementById("url").value.trim();
    const responseFormat = document.getElementById("response-format").value;
    const bodyData = getBodyData();
    const responseOutput = document.getElementById("response-output");
    const statusCode = document.getElementById("status-code");

    let simulatedResponse = {};

    // Verifica se a URL é válida
    if (url !== "www.google.com.br") {
        simulatedResponse = { status: 400, message: "URL inválida! Use apenas 'www.google.com.br'." };
    } else {
        // Simulando as requisições
        if (method === "GET") {
            simulatedResponse = simulateGet();
        } else if (method === "POST") {
            simulatedResponse = simulatePost(bodyData);
        } else if (method === "DELETE") {
            simulatedResponse = simulateDelete(bodyData);
        }
    }

    // Exibe o status HTTP
    if (simulatedResponse.status === 200 || simulatedResponse.status === 201) {
        statusCode.textContent = `${simulatedResponse.status} OK`;
        statusCode.classList.remove("response-404");
        statusCode.classList.add("response-200");
    } else {
        statusCode.textContent = `${simulatedResponse.status} Not Found`;
        statusCode.classList.remove("response-200");
        statusCode.classList.add("response-404");
    }

    // Exibe a resposta no formato escolhido
    if (responseFormat === "json") {
        responseOutput.textContent = JSON.stringify(simulatedResponse, null, 2);
    } else {
        responseOutput.textContent = formatResponseText(simulatedResponse);
    }
});

// Função para pegar os dados do formulário de chave-valor
function getBodyData() {
    const keys = document.querySelectorAll(".key");
    const values = document.querySelectorAll(".value");
    let bodyData = {};
    
    keys.forEach((key, index) => {
        if (key.value && values[index].value) {
            bodyData[key.value] = values[index].value;
        }
    });

    return bodyData;
}

// Função para formatar a resposta como texto simples
function formatResponseText(response) {
    let textResponse = `Status: ${response.status}\nMensagem: ${response.message}\n`;

    if (response.data) {
        textResponse += `Dados:\n`;
        response.data.forEach((item, index) => {
            textResponse += `#${index + 1}\n`;
            for (const key in item) {
                textResponse += `${key}: ${item[key]}\n`;
            }
            textResponse += "---------------------\n";
        });
    }

    return textResponse;
}

// Simula a resposta de uma requisição GET (Consultar dados postados)
function simulateGet() {
    if (database.length === 0) {
        return { status: 404, message: "Nenhum dado encontrado!" };
    }

    return {
        status: 200,
        message: "Dados recuperados com sucesso!",
        data: database
    };
}

// Simula a resposta de uma requisição POST (Adicionar dados ao banco simulado)
function simulatePost(body) {
    if (!body.nome || !body.idade) {
        return { status: 400, message: "Dados inválidos! O campo 'nome' e 'idade' são obrigatórios." };
    }

    // Adiciona um ID sequencial que começa do 1
    const newEntry = { id: idCounter++, ...body };
    database.push(newEntry);

    return {
        status: 201,
        message: "Dados adicionados com sucesso!",
        data: [newEntry]
    };
}

// Simula a resposta de uma requisição DELETE (Remover um item pelo ID)
function simulateDelete(body) {
    if (!body.id) {
        return { status: 400, message: "ID necessário para deletar um item!" };
    }

    const index = database.findIndex(item => item.id == body.id);
    
    if (index === -1) {
        return { status: 404, message: "Item não encontrado!" };
    }

    database.splice(index, 1);

    return {
        status: 200,
        message: `Item com ID ${body.id} deletado com sucesso!`
    };
}

// Adiciona um novo par de chave-valor ao formulário
document.getElementById("add-pair").addEventListener("click", function () {
    const formContainer = document.getElementById("key-value-form");

    const newPair = document.createElement("div");
    newPair.classList.add("form-item");

    newPair.innerHTML = `
        <input type="text" class="key" placeholder="Chave" />
        <input type="text" class="value" placeholder="Valor" />
    `;

    formContainer.appendChild(newPair);
});