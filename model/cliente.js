class Cliente {
    constructor(nome, email, cpf){
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
    }

    imprimirDados(){
        return `Cliente: ${this.nome}, CPF: ${this.cpf}, E-mail: ${this.email}`;
    }

}

module.exports = Cliente;