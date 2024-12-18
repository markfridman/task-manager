import { TaskModel } from '../models/Task';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types/task';
import { TaskFilters } from '../types/filter';
import { PaginationParams, PaginatedResponse } from '../types/pagination';
import { AppError } from '../types/error';

export class TaskService {
  async getTasks(
    filters: TaskFilters,
    pagination: PaginationParams,
    userId: string
  ): Promise<PaginatedResponse<Task>> {
    const { tasks, total } = await TaskModel.findWithFilters(userId, filters, pagination);

    const totalPages = Math.ceil(total / pagination.limit);
    
    return {
      data: tasks,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: pagination.page,
        itemsPerPage: pagination.limit,
        hasNextPage: pagination.page < totalPages,
        hasPreviousPage: pagination.page > 1
      }
    };
  }

  async getTaskById(id: string, userId: string): Promise<Task> {
    const task = await TaskModel.findById(id, userId);
    if (!task) {
      throw new AppError(404, 'Task not found', 'TASK_NOT_FOUND');
    }
    return task;
  }

  async createTask(data: CreateTaskDto & { userId: string }): Promise<Task> {
    // Validate due date
    if (new Date(data.dueDate) < new Date()) {
      throw new AppError(400, 'Due date cannot be in the past', 'VALIDATION_ERROR');
    }

    return await TaskModel.create(data);
  }

  async updateTask(
    id: string,
    data: UpdateTaskDto,
    userId: string
  ): Promise<Task> {
    const task = await this.getTaskById(id, userId);

    if (data.dueDate && new Date(data.dueDate) < new Date()) {
      throw new AppError(400, 'Due date cannot be in the past', 'VALIDATION_ERROR');
    }

    return await TaskModel.update(id, userId, data);
  }

  async deleteTask(id: string, userId: string): Promise<void> {
    await TaskModel.delete(id, userId);
  }
}