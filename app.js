require('dotenv').config();
const express = require('express');
const db = require('./db');
const app = express();

app.use(express.json());

app.post('/cliente', async (req, res) => {

    try {

        const { nome, email, cpf } = req.body;

        if (!nome)
            return res.status(400).json({ message: "O nome é obrigatório" });

        if (email && !/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/.test(email))
            return res.status(400).json({ message: "E-mail inválido" });

        const query = 'INSERT INTO cliente (nome, email, cpf) VALUES ($1, $2, $3);'

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