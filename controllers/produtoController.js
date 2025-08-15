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

}

export default new ProdutoController();