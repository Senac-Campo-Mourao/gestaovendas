
class Produto {

    constructor(produto, valorUnitario) {
        this.produto = produto;
        this.valorUnitario = valorUnitario;
    }

    imprimirDados() {
        return `Produto: ${this.produto}, Valor: ${this.valor_unitario}`;
    }

}

module.exports = Produto;