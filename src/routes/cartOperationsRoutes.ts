import { Router } from 'express';
import { CartOperationsController } from '../controllers/cartOperationsController';

const router = Router();
const controller = new CartOperationsController();

// Cart operations
router.get('/', controller.calculateTotal);

export default router;