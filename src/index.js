const { request, response } = require("express");   //falando que o request e response pertencem ao express( ligando eles ao express)
const express = require("express") //criando uma variável chamada express para puxar o express pra dentro dele

const app = express();  //criando uma variável chamada app para puxar o express(variavel que contém o express)

const customers = [];

app.use(express.json()); //Importante (não vai funcionar se não colocar isso)

function verifyIfExistsAccountUsername(request, response, next) {
    const { username } = request.headers; //solicitando que pegue a informação no header

    const customer = customers.find((customer) => customer.username === username);

    if (!customer) {
        return response.status(400).json({ error: "Customer not found" });
    }

    request.customer = customer;

    return next();
}

app.post("/create", (request, response) => {    //post para criar o customer
    const { username, name, password } = request.body;

    const customerAlreadyExists = customers.some(
        (customers) => customers.username === username
    );

    if (customerAlreadyExists) {
        return response.status(400).json({ error: "Customer Already Exists" });
    }

    customers.push({    //criando o array para armazenar o nome e o username
        username,
        name,
        password,
        created_at: new Date(),
        tasks: []
    });

    return response.status(201).send();
});

app.get("/customers", verifyIfExistsAccountUsername, (request, response) => {   //fazendo um get no customer especificado no header(maioria feito na função verifyIfExistsAccountUsername para validação)
    const { customer } = request;
    return response.json(customer);
});

app.post("/newtask", verifyIfExistsAccountUsername, (request, response) => {    //adicionando uma nova task a o usuário
    const { title, deadline } = request.body;

    const { customer } = request;

    const insertOperation = {
        title,
        deadline
    };

    customer.tasks.push(insertOperation);

    return response.status(201).send();
});

app.put("/customers", verifyIfExistsAccountUsername, (request, response) => {
    const { name } = request.body;
    const { customer } = request;

    customer.name = name;

    return response.status(201).send();
});

app.delete("/customers", verifyIfExistsAccountUsername, (request, response) => {
    const { customer } = request;

    customers.splice(customer, 1);

    return response.status(200).json(customers);
});

app.listen(3333);   //3333 é a porta que estou utilizando, mas pode modificar dependendo qual você use