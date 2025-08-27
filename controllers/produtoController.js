import db from '../config/db.js';
import produtoService from '../services/produtoService.js';
import Produto from '../models/produto.js';


class ProdutoController {

    async criarProduto(req, res) {
        try {

            const { produto, valorUnitario } = req.body;

            const newProdut = new Produto(produto, valorUnitario);

            if (!produto || !valorUnitario)
                return res.status(400).json({ message: 'Campos obrigatórios não preenchidos' });


            res.status(201).json({ message: 'Produto criado com sucesso' });

        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Erro ao criar produto' });
        }

    }

    async buscarProdutosPorNome(req, res) {
        try {
            const { nome } = req.query;
            const produtos = await produtoService.buscarProdutosPorNome(nome);
            res.status(200).json(produtos);
        } catch (err) {
            res.status(400).json({ message: err.message })
        }

    }

}

export default new ProdutoController();