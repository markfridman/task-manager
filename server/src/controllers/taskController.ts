import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/taskService';
import { TaskFilters } from '../types/filter';
import { PaginationParams } from '../types/pagination';
import { AuthenticatedRequest } from '../types/request';
import { AppError } from '../types/error';

export class TaskController {
  constructor(private taskService: TaskService) {}

  getTasks = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const filters: TaskFilters = {
        status: req.query.status as any,
        priority: req.query.priority as any,
        search: req.query.search as string,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        taskOwner: req.query.taskOwner as string,
      };

      const pagination: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      };

      const result = await this.taskService.getTasks(
        filters,
        pagination,
        // req.user!.id
      );

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  getTaskById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const task = await this.taskService.getTaskById(
        req.params.id,
        // req.user!.id
      );
      res.json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  };

  createTask = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const task = await this.taskService.createTask({
        ...req.body,
        // userId: req.user!.id,
      });
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  };

  updateTask = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const task = await this.taskService.updateTask(
        req.params.id,
        req.body,
        // req.user!.id
      );
      res.json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  };

  deleteTask = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.taskService.deleteTask(
        req.params.id, 
        // req.user!.id
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}