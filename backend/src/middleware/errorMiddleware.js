import expressAsyncErrors from 'express-async-handler';
import createHttpError from 'http-errors';

// Use express-async-handler to wrap async route handlers and automatically pass errors to error handler
export const asyncHandler = expressAsyncErrors;

// Error handler middleware using http-errors
export const errorHandler = (err, req, res, next) => {
  // Convert error to HttpError if not already
  const error = createHttpError(err.status || 500, err.message);
  
  res.status(error.status).json({
    success: false,
    status: error.status,
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
};

// Not found middleware using http-errors
export const notFound = (req, res, next) => {
  next(createHttpError(404, `Not found - ${req.originalUrl}`));
};