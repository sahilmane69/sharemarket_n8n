import { Request, Response, NextFunction } from 'express';
import { handleError } from '../utils/error.js';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  const { statusCode, message, details } = handleError(err);

  console.error('[Error]', {
    statusCode,
    message,
    details,
    url: req.url,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(details && { details }),
  });
}

export function corsMiddleware(req: Request, res: Response, next: NextFunction): void {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
}
