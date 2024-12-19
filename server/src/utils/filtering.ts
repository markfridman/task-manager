import { TaskFilters } from '../types/filter';

export const validateFilters = (filters: Partial<TaskFilters>): TaskFilters => {
  const validatedFilters: TaskFilters = {};

  if (filters.status && ['To Do', 'In Progress', 'Completed'].includes(filters.status)) {
    validatedFilters.status = filters.status;
  }

  if (filters.priority && ['Low', 'Medium', 'High'].includes(filters.priority)) {
    validatedFilters.priority = filters.priority;
  }

  if (filters.search && typeof filters.search === 'string') {
    validatedFilters.search = filters.search.trim();
  }

  if (Array.isArray(filters.tags)) {
    validatedFilters.tags = filters.tags.filter(tag => typeof tag === 'string');
  }

  if (filters.startDate && !isNaN(Date.parse(filters.startDate))) {
    validatedFilters.startDate = filters.startDate;
  }

  if (filters.endDate && !isNaN(Date.parse(filters.endDate))) {
    validatedFilters.endDate = filters.endDate;
  }

  if (filters.taskOwner && typeof filters.taskOwner === 'string') {
    validatedFilters.taskOwner = filters.taskOwner.trim();
  }

  return validatedFilters;
};