import { TaskPriority, TaskStatus } from "./task";

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  taskOwner?: string;
}