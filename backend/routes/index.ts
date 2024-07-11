import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import bookRoutes from './book';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/books', bookRoutes);

export default router;
