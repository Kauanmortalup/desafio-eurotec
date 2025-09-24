import { Router } from 'express';
import { CartHistoryController } from '../controllers/cartHistoryController';

const router = Router();
const controller = new CartHistoryController();

// Cart history
router.get('/', controller.getHistory);
router.delete('/', controller.clearCartHistory);

export default router;