import { Task, CreateTaskDto, UpdateTaskDto } from '../types/task';
import { Database } from '../config/database';
import { AppError } from '../types/error';
import { v4 as uuidv4 } from 'uuid';

export class TaskModel {
  private static async getDb() {
    return await Database.getInstance();
  }

  static async findAll(userId: string): Promise<Task[]> {
    const db = await this.getDb();
    return db.getTasks()
    // .filter(task => task.userId === userId);
  }

  static async findById(id: string, userId: string): Promise<Task | null> {
    const db = await this.getDb();
    return db.getTasks().find(task => task.id === id
      // && task.userId === userId
    ) || null;
  }

  static async create(data: CreateTaskDto
    // & { userId: string }
  ): Promise<Task> {
    const db = await this.getDb();
    const tasks = db.getTasks();

    const newTask: Task = {
      id: uuidv4(),
      ...data,
      creationTime: new Date().toISOString(),
    };

    tasks.push(newTask);
    db.setTasks(tasks);
    await db.saveTasks();

    return newTask;
  }

  static async update(id: string,
    //  userId: string,
    data: UpdateTaskDto
  ): Promise<Task> {
    const db = await this.getDb();
    const tasks = db.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id
      // && task.userId === userId
    );

    if (taskIndex === -1) {
      throw new AppError(404, 'Task not found', 'TASK_NOT_FOUND');
    }

    const updatedTask = {
      ...tasks[taskIndex],
      ...data,
    };

    tasks[taskIndex] = updatedTask;
    db.setTasks(tasks);
    await db.saveTasks();

    return updatedTask;
  }

  static async delete(
    id: string,
    // userId: string
  ): Promise<void> {
    const db = await this.getDb();
    const tasks = db.getTasks();
    const filteredTasks = tasks.filter(task => !(task.id === id
      // && task.userId === userId
    ));

    if (filteredTasks.length === tasks.length) {
      throw new AppError(404, 'Task not found', 'TASK_NOT_FOUND');
    }

    db.setTasks(filteredTasks);
    await db.saveTasks();
  }

  static async findWithFilters(
    // userId: string,
    filters: any,
    pagination: any
  ): Promise<{ tasks: Task[]; total: number }> {
    const db = await this.getDb();
    let tasks = db.getTasks()
    // .filter(task => task.userId === userId);

    // Apply filters
    if (filters) {
      tasks = tasks.filter(task => {
        let matches = true;
        if (filters.status) matches = matches && task.status === filters.status;
        if (filters.priority) matches = matches && task.priority === filters.priority;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          matches = matches && (
            task.title.toLowerCase().includes(searchLower) ||
            task.description.toLowerCase().includes(searchLower)
          );
        }
        if (filters.tags && filters.tags.length > 0) {
          matches = matches && filters.tags.some((tag: string) => task.tags.includes(tag));
        }
        if (filters.startDate) {
          matches = matches && new Date(task.dueDate) >= new Date(filters.startDate);
        }
        if (filters.endDate) {
          matches = matches && new Date(task.dueDate) <= new Date(filters.endDate);
        }
        return matches;
      });
    }

    const total = tasks.length;

    // Apply sorting
    if (pagination.sortBy) {
      tasks.sort((a: any, b: any) => {
        const aValue = a[pagination.sortBy];
        const bValue = b[pagination.sortBy];
        const order = pagination.sortOrder === 'asc' ? 1 : -1;
        return aValue > bValue ? order : -order;
      });
    }

    // Apply pagination
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    tasks = tasks.slice(start, end);

    return { tasks, total };
  }
}