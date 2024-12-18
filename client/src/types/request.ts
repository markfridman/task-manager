import { PaginationParams } from "./pagination";
import { TaskFilters } from "./filter";

export interface QueryParams extends PaginationParams, TaskFilters {}

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: QueryParams;
}

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiRequestConfig extends RequestConfig {
  method: RequestMethod;
  url: string;
  data?: any;
}