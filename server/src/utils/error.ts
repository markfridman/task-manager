import { AppError } from '../types/error';

export const isAppError = (error: any): error is AppError => {
  return error instanceof AppError;
};

export const formatError = (error: Error | AppError) => {
  if (isAppError(error)) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details
    };
  }

  return {
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    statusCode: 500
  };
};