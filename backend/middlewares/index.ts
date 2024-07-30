import bodyParser from './body-parser';
import requestLogger from './request-logger';
import authMiddleware from './auth-middleware';
import adminMiddleware from './admin-middleware';
import { checkPermission } from './rbac-middleware';

export {
  bodyParser,
  requestLogger,
  authMiddleware,
  adminMiddleware,
  checkPermission
};
