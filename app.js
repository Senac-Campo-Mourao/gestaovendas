require('dotenv').config();
const express = require('express');
const db = require('./db');
const app = express();
const Cliente = require('./model/cliente');
const Produto = require('./model/produto');

app.use(express.json());

app.post('/produto', async (req, res) => {
    try {

        const { produto, valorUnitario } = req.body;

        if (!produto || !valorUnitario)
            return res.status(400).json({ message: 'Campos obrigatórios não preenchidos' });

        const newProduto = new Produto(produto, valorUnitario);

        newProduto.salvar();


    } catch (err) {
        console.log(err);
        res.status(500);
    }


});

app.post('/cliente', async (req, res) => {

    try {

        const { nome, email, cpf } = req.body;

        const newCliente = new Cliente(nome, email, cpf);
        console.log(newCliente.imprimirDados());

        if (!nome)
            return res.status(400).json({ message: "O nome é obrigatório" });

        if (email && !/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/.test(email))
            return res.status(400).json({ message: "E-mail inválido" });

        if (!validarCPF(cpf))
            return res.status(400).json({ message: "CPF Inválido" });

        if (existCPF(cpf))
            return res.status(400).json({ message: "CPF já cadastrado" });

        const query = 'INSERT INTO cliente (nome, email, cpf) VALUES ($1, $2, $3) RETURNING id_cliente, nome'

        const values = [nome, email, cpf];

        const result = await db.query(query, values);

        res.status(200).json({
            message: 'Cliente inserido',
            cliente: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error to insert client' });
    }

});

async function existCPF(cpf) {
    const result = await db.query('SELECT EXISTS(SELECT 1 FROM cliente c where c.cpf=$1)', cpf);

    return result.rows[0].exists;
}

function validarCPF(cpf) {
    if (typeof cpf !== "string") return false;

    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]+/g, "");

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    // Validação do primeiro dígito
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf[i - 1]) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    // Validação do segundo dígito
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf[i - 1]) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) return false;

    return true;
}


app.get('/cliente/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('select * from cliente c where c.id_cliente = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Client not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error to find client' });
    }
});

app.get('/telefone', async (req, res) => {
    try {
        const name = req.query.nomeCliente;

        if (!name) {
            return res.status(400).json({ message: 'Parametro inválido' });
        }

        const result = await db.query('select c.nome, t.telefone from telefone t ' +
            'inner join cliente c on c.id_cliente = t.cliente_id_cliente' +
            ' where c.nome ILIKE $1', [`%${name}%`]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Client not found' });
        }

        res.status(200).json(result.rows);


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error to find phone' });
    }
});

app.get('/endereco', async (req, res) => {
    try {
        const name = req.query.nomeCliente;

        if (!name) {
            return res.status(400).json({ message: 'Parametro inválido' });
        }

        const result = await db.query('select c.nome, e.logradouro, e.numero, e.bairro, e.complemento, e.cep, m.municipio, uf.uf from endereco e ' +
            'inner join cliente c on c.id_cliente = e.cliente_id_cliente ' +
            'inner join municipio m on m.id_municipio = e.municipio_id_municipio ' +
            'inner join uf on uf.id_uf = m.uf_id_uf ' +
            'where c.nome ILIKE $1;', [`%${name}%`]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Client not found' });
        }

        res.status(200).json(result.rows);


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error to find endereco' });
    }
});

app.get('/produto/:id', async (req, res) => {

    try {

        const id = req.params.id;
        const result = await db.query('select * from produto p where p.id_produto = $1', [id]);

        if (result.rows.length === 0) {
            console.info(`Product id ${id}`);
            return res.status(400).json({ message: 'Product not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error to find product' });
    }
});

app.get('/health', (req, res) => {
    res.json({ message: 'API no ar' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running in ${PORT}`)
})