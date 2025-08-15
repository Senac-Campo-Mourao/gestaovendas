const pool = require("../config/db");

class Produto {
    constructor(produto, valorUnitario) {
        this.produto = produto;
        this.valor_unitario = valorUnitario;
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