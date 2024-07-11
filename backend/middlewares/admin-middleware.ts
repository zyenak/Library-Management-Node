// middlewares/admin-middleware.ts
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: 'admin' | 'user' };
}

const adminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

  console.log("req.user: ", req.user)
  if (req.user?.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

export default adminMiddleware;
