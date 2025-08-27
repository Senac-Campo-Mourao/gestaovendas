import ProdutoRepository from '../repositories/produtoRepository.js';

class ProdutoService {

    async criarProduto(produto) {
        return await ProdutoRepository.create(produto);
    }

    async buscarProdutosPorNome(nome) {
        if (!nome) {
            throw new Error('o nome do produto é obrigatório');
        }

        return await ProdutoRepository.buscarProdutosPorNome(nome);
    }


}

export default new ProdutoService();