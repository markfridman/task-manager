import { atom } from 'recoil';
import { Task } from '../types/task';
import { User } from '../types/user';
import { TaskFilters } from '../types/filter';
import { PaginationParams } from '../types/pagination';

export const userState = atom<User | null>({
  key: 'userState',
  default: null,
});

export const tasksState = atom<Task[]>({
  key: 'tasksState',
  default: [],
});

export const selectedTaskState = atom<Task | null>({
  key: 'selectedTaskState',
  default: null,
});

export const taskFiltersState = atom<TaskFilters>({
  key: 'taskFiltersState',
  default: {
    status: undefined,
    priority: undefined,
    search: undefined,
    tags: undefined,
    startDate: undefined,
    endDate: undefined,
    taskOwner: undefined,
  },
});

export const paginationState = atom<PaginationParams>({
  key: 'paginationState',
  default: {
    page: 1,
    limit: 10,
    sortBy: 'creationTime',
    sortOrder: 'desc',
    totalPages: 1
  },
});

export const selectedTaskIdState = atom<string | null>({
  key: 'selectedTaskIdState',
  default: null,
});

export const isTaskFormOpenState = atom<boolean>({
  key: 'isTaskFormOpenState',
  default: false,
});
