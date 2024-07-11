import { Router } from 'express';
import * as bookController from '../controllers/book';
import authMiddleware from '../middlewares/auth-middleware';
import { adminMiddleware } from '../middlewares';

const router = Router();

router.get('/', bookController.getBooks);
router.get('/:isbn', bookController.getBookByISBN);
router.post('/', authMiddleware, adminMiddleware, bookController.addBook);
router.put('/:isbn', authMiddleware, adminMiddleware, bookController.updateBook);
router.delete('/:isbn', authMiddleware, adminMiddleware, bookController.deleteBook);

export default router;
