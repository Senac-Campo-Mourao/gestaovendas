import { Router } from 'express';
import clienteController from '../controllers/clienteController.js';

const router = Router();

router.post('/', clienteController.criarCliente);
router.get('/:id', clienteController.buscarClientePorId);

export default router;