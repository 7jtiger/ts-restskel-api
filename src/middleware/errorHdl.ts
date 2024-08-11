import { Request, Response, NextFunction } from 'express';
import cfg from '../config';
import log from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.isOperational = err.isOperational || false;

  if (cfg.server.mode === 'prod') {
      sendErrorProd(err, res);
    } else {
      sendErrorDev(err, res);
  }
};

const sendErrorDev = (err: AppError, res: Response) => {
  log.error('Error:', err);
  res.status(err.statusCode || 500).json({
    status: 'error',
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: 'error',
      message: err.message
    });
  } else {
    log.error('Error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as AppError;
  error.statusCode = 404;
  next(error);
};
