import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AppError } from '../types/error';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error for debugging
  console.error('Error:', {
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });

  // Handle AppError (our custom error)
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
  }

  // Handle JWT Errors
  if (error instanceof JsonWebTokenError) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Your session has expired. Please log in again.',
        },
      });
    }

    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid authentication token.',
      },
    });
  }

  // Handle Validation Errors (e.g., from express-validator)
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data.',
        details: error.message,
      },
    });
  }


  // Handle Syntax Error (e.g., invalid JSON)
  if (error instanceof SyntaxError && 'status' in error && error.status === 400) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_JSON',
        message: 'Invalid JSON format in request.',
      },
    });
  }


  // Handle request timeout
  if (error.name === 'TimeoutError') {
    return res.status(408).json({
      success: false,
      error: {
        code: 'REQUEST_TIMEOUT',
        message: 'Request timeout. Please try again.',
      },
    });
  }

  // Handle payload too large
  if (error.name === 'PayloadTooLargeError') {
    return res.status(413).json({
      success: false,
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Request payload is too large.',
      },
    });
  }

  // Handle rate limit exceeded
  if (error.name === 'RateLimitExceeded') {
    return res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
      },
    });
  }

  // Default error response
  const statusCode = (error as any).statusCode || 500;
  const errorMessage = process.env.NODE_ENV === 'production' 
    ? 'An unexpected error occurred.' 
    : error.message;

  return res.status(statusCode).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: errorMessage,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    },
  });
};

// Not Found Error Handler
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new AppError(
    404,
    `Route ${req.method} ${req.url} not found`,
    'ROUTE_NOT_FOUND'
  );
  next(error);
};

// Async Handler Wrapper
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Request Timeout Handler
export const timeoutHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setTimeout(30000, () => {
    const error = new AppError(
      408,
      'Request timeout',
      'REQUEST_TIMEOUT'
    );
    next(error);
  });
  next();
};