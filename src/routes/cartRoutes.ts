import { Router } from 'express';
import { CartController } from '../controllers/cartController';

const router = Router();
const controller = new CartController();

// Products in cart
router.get('/', controller.listProducts);
router.post('/', controller.addProduct);
router.put('/:id', controller.updateQuantity);
router.delete('/:id', controller.removeProductById);

export default router;