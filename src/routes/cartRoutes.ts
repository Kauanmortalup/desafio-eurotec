import { Router } from 'express';
import { CartController } from '../controllers/cartController';

const router = Router();
const controller = new CartController();

// Products in cart
router.post('/items', controller.addProduct);
router.delete('/items/:id', controller.removeProductById);
router.put('/items/:id', controller.updateQuantity);
router.get('/items', controller.listProducts);

// Cart operations
router.get('/total', controller.calculateTotal);

// Cart history
router.get('/history', controller.getHistory);
router.delete('/history', controller.clearCartHistory);

export default router;