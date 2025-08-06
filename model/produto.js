const pool = require("../config/db");

class Produto {
    constructor(produto, valor_unitario) {
        this.produto = produto;
        this.valor_unitario = valor_unitario;
    }

    imprimirDados() {
        return `Produto: ${this.produto}, Valor: ${this.valor_unitario}`;
    }

    async salvar() {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(
                'INSERT INTO produto (produto, valor_unitario) VALUES ($1, $) RETURNING id_produto, produto',
                [this.produto, this.valor_unitario]);

                this.id = result.insertId;

                return this;

        }finally{
            connection.release();
        }
    }

}

module.exports = Produto;