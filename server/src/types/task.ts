import { TaskStatus, TaskPriority } from '../../../client/src/constants/task';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  creationTime: string;
  taskOwner: string;
  priority: TaskPriority;
  tags: string[];
  userId?: string; // Reference to the user who created the task
}

export interface CreateTaskDto extends Omit<Task, 'id' | 'creationTime' | 'userId'> {}
export interface UpdateTaskDto extends Partial<CreateTaskDto> {}
