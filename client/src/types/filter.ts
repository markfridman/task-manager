import { TaskPriority, TaskStatus } from './task';
import { PaginationParams } from './pagination';

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  taskOwner?: string;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

export interface FilterOptions {
  filters: TaskFilters;
  sort?: SortOptions;
  pagination: PaginationParams;
}
