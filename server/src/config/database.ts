import fs from 'fs/promises';
import { Task } from '../types/task';
import { config } from './index';
import { AppError } from '../types/error';

export class Database {
  private static instance: Database;
  private tasks: Task[] = [];

  private constructor() {}

  static async getInstance(): Promise<Database> {
    if (!Database.instance) {
      Database.instance = new Database();
      await Database.instance.init();
    }
    return Database.instance;
  }

  private async init() {
    try {
      const data = await fs.readFile(config.database.filePath, 'utf-8');
      this.tasks = JSON.parse(data);
    } catch (error) {
      throw new AppError(500, 'Database initialization failed', 'DB_INIT_ERROR');
    }
  }

  async saveTasks(): Promise<void> {
    try {
      await fs.writeFile(
        config.database.filePath,
        JSON.stringify(this.tasks, null, 2)
      );
    } catch (error) {
      throw new AppError(500, 'Failed to save tasks', 'DB_SAVE_ERROR');
    }
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  setTasks(tasks: Task[]): void {
    this.tasks = tasks;
  }
}