
class Produto {
    constructor(produto, valorUnitario, valorCusto) {
        this.produto = produto;
        this.valorUnitario = valorUnitario;
        this.valorCusto = valorCusto
    }

    imprimirDados() {
        return `Produto: ${this.produto}, Valor: ${this.valor_unitario}`;
    }

}

module.exports = Produto;