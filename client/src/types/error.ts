export enum ErrorCodes {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  DATABASE_ERROR = 'DATABASE_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED'
}

export interface ErrorResponse {
  code: ErrorCodes;
  message: string;
  statusCode: number;
  details?: any;
}
