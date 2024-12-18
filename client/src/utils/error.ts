import { ErrorCodes } from '../types/error';

export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  return error.message || 'An unexpected error occurred';
};

export const isAuthError = (error: any): boolean => {
  return error.response?.status === 401 || 
         error.response?.data?.error?.code === ErrorCodes.AUTHENTICATION_ERROR;
};