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


export default router;
