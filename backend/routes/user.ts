import { Router, Request, Response } from 'express';
import * as userController from '../controllers/user';
import authMiddleware from '../middlewares/auth-middleware';
import adminMiddleware from '../middlewares/admin-middleware';
import { checkPermission } from '../middlewares';

const router = Router();

router.use(authMiddleware);

// router.get('/', adminMiddleware, (req: Request, res: Response) => {
//   userController.getUsers(req, res);
// });

// router.delete('/:id', adminMiddleware, (req: Request, res: Response) => {
//   userController.deleteUser(req, res);
// });

router.get('/', checkPermission('read_users'), (req: Request, res: Response) => {
  userController.getUsers(req, res);
});

router.delete('/:id', checkPermission('delete_user'), (req: Request, res: Response) => {
  userController.deleteUser(req, res);
});


router.patch('/change-password', checkPermission('change_password'),userController.changePassword);
// router.patch('/change-password', userController.changePassword);
router.post('/validate-password', userController.validatePassword);
router.post('/:userId/borrow/:bookId', userController.borrowBook);
router.post('/:userId/return/:bookId', userController.returnBook);
router.get('/:userId/borrowed-books', userController.getBorrowedBooks);


export default router;
