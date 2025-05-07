import { ErrorRequestHandler } from 'express';

interface AppError extends Error {
  status?: number;
}

export const errorHandler: ErrorRequestHandler = (
  err: AppError,
  req,
  res,
  next
) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  console.error(`[Error] ${status}: ${message}`, {
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
  if (res && typeof res.status === 'function') {
    res.status(status).json({
      error: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  } else {
    console.error('Invalid response object received in error handler');
    if (typeof req.res?.status === 'function') {
      req.res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
