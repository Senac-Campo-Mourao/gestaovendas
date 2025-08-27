import Produto from '../models/produto.js';
import db from '../config/db.js'

class ProdutoRepository {
    async salvar() {
        const connection = await pool.getConnection();
        try {
            const [result] = await db.query(
                'INSERT INTO produto (produto, valor_unitario) VALUES ($1, $) RETURNING id_produto, produto',
                [this.produto, this.valor_unitario]);

            this.id = result.insertId;

            return this;

        } finally {
            connection.release();
        }
    }

    async buscarProdutosPorNome(nome) {
        const query = 'SELECT * FROM produto WHERE produto iLIKE $1';
        const value = [`%${nome}%`];
        const result = await db.query(query, value);
        return result.rows.map(row => new Produto(row.id_produto, row.produto, row.valor_unitario));
    }
}

export default new ProdutoRepository();
