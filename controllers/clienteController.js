
import db from '../config/db.js';
import { existCPF, validarCPF } from '../utils/utilCliente.js';
import Cliente from '../models/cliente.js';

class ClienteController {

    async criarCliente(req, res) {
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
    }

    async buscarClientePorId(req, res) {
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
    }
}

export default new ClienteController();