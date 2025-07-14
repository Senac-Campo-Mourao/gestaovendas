require('dotenv').config();
const express = require('express');
const db = require('./db');
const app = express();

app.use(express.json());

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