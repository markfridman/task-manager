import { PaginationParams } from '../types/pagination';

export const validatePaginationParams = (
  page?: number,
  limit?: number,
  maxLimit: number = 100
): PaginationParams => {
  const validatedPage = Math.max(1, Math.floor(page || 1));
  const validatedLimit = Math.min(
    maxLimit,
    Math.max(1, Math.floor(limit || 10))
  );

  return {
    page: validatedPage,
    limit: validatedLimit
  };
};