export const TASK_STATUS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
} as const;

export const TASK_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
} as const;

// Creating arrays from the objects for mapping
export const TASK_STATUSES = Object.values(TASK_STATUS);
export const TASK_PRIORITIES = Object.values(TASK_PRIORITY);

// Types using the constants
export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];
export type TaskPriority = typeof TASK_PRIORITY[keyof typeof TASK_PRIORITY];