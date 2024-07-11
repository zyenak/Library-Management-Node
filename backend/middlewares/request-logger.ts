import { Request, Response, NextFunction } from 'express';

const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  console.log(`LOGGER: ${req.method} ${req.url} [${timestamp}]`);
  next();
};

export default requestLogger;
