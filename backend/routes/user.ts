import { Router, Request, Response } from 'express';
import * as userController from '../controllers/user';
import authMiddleware from '../middlewares/auth-middleware';
import adminMiddleware from '../middlewares/admin-middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', adminMiddleware, (req: Request, res: Response) => {
  userController.getUsers(req, res);
});

router.delete('/:id', adminMiddleware, (req: Request, res: Response) => {
  userController.deleteUser(req, res);
});


router.patch('/change-password', userController.changePassword);
router.post('/validate-password', userController.validatePassword);


router.post('/:userId/borrow/:bookId', userController.borrowBook);

router.post('/:userId/return/:bookId', userController.returnBook);

router.get('/:userId/borrowed-books', userController.getBorrowedBooks);


export default router;
