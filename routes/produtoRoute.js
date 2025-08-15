import { Router } from 'express';
import produtoController from '../controllers/produtoController.js';

const router = Router();

router.post('/', produtoController.criarProduto);

export default router;
