import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error occurred:', err.message); // Log the error message
  if (err.stack) {
    console.error(err.stack); // Log the stack trace if it exists
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
  });
}
