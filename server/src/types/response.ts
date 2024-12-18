import { PaginatedResponse } from "./pagination";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: PaginatedResponse<T>['pagination'];
}