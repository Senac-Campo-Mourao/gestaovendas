import Produto from '../models/produto.js';
import ProdutoRepository from '../repositories/produtoRepository.js';

class ProdutoService {

async criarProduto(produto){

return await ProdutoRepository.create(produto);

}


}

export default new ProdutoService();