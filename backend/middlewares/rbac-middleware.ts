import { Request, Response, NextFunction } from 'express';
import Permissions from '../models/permission';

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

// Check if the user has the required permission for a route
export const checkPermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.user ? req.user.role : 'anonymous';
    const userPermissions = new Permissions().getPermissionsByRoleName(userRole);

    if (userPermissions.includes(permission)) {
      return next();
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
  };
};
