import { Router } from "express";
import userRoutes from './userRt';
import contentsRoutes from './contentsRt';

const router = Router();

router.use('/users', userRoutes);
router.use('/contents', contentsRoutes);

export default router;