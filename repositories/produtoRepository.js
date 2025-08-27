const pool = require("../config/db");

class ProdutoRepository {
    async salvar() {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(
                'INSERT INTO produto (produto, valor_unitario) VALUES ($1, $) RETURNING id_produto, produto',
                [this.produto, this.valor_unitario]);

            this.id = result.insertId;

            return this;

        } finally {
            connection.release();
        }
    }

    async buscarProdutosPorNome(nome) {
        const query = 'SELECT * FROM produto WHERE nome iLIKE $1';
        const value = [`%${nome}%`];
        const result = await pool.query(query, value);
        return result.rows;
    }
}

export default new ProdutoRepository();
