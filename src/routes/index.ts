import { Router } from 'express';
import cartOperationsRoutes from './cartOperationsRoutes';
import cartHistoryRoutes from './cartHistoryRoutes';
import cartRoutes from './cartRoutes';

const router = Router();

router.use('/items', cartRoutes);
router.use('/total', cartOperationsRoutes);
router.use('/history', cartHistoryRoutes);

export default router;