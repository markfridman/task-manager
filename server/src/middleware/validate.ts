import { Request, Response, NextFunction } from 'express';
import { CreateTaskDto, UpdateTaskDto } from '../types/task';
import { CreateUserDto, LoginDto } from '../types/user';
import { AppError } from '../types/error';
import { TASK_PRIORITIES, TASK_STATUSES } from '../constants/task';

export const validateTask = (
  req: Request<{}, {}, CreateTaskDto | UpdateTaskDto>,
  res: Response,
  next: NextFunction
) => {
  const task = req.body;

  if (req.method === 'POST') {
    // Validate required fields for new task
    if (!task.title || !task.dueDate || !task.priority || !task.status) {
      throw new AppError(400, 'Missing required fields', 'VALIDATION_ERROR');
    }
  }

  // Validate field types and values
  if (task.title && typeof task.title !== 'string') {
    throw new AppError(400, 'Title must be a string', 'VALIDATION_ERROR');
  }

  if (task.priority && !TASK_PRIORITIES.includes(task.priority)) {
    throw new AppError(400, 'Invalid priority value', 'VALIDATION_ERROR');
  }

  if (task.status && !TASK_STATUSES.includes(task.status)) {
    throw new AppError(400, 'Invalid status value', 'VALIDATION_ERROR');
  }

  if (task.dueDate && isNaN(Date.parse(task.dueDate))) {
    throw new AppError(400, 'Invalid due date format', 'VALIDATION_ERROR');
  }

  next();
};

export const validateRegistration = (
  req: Request<{}, {}, CreateUserDto>,
  res: Response,
  next: NextFunction
) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    throw new AppError(400, 'Missing required fields', 'VALIDATION_ERROR');
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    throw new AppError(400, 'Invalid email format', 'VALIDATION_ERROR');
  }

  if (typeof password !== 'string' || password.length < 6) {
    throw new AppError(400, 'Password must be at least 6 characters', 'VALIDATION_ERROR');
  }

  next();
};

export const validateLogin = (
  req: Request<{}, {}, LoginDto>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(400, 'Missing credentials', 'VALIDATION_ERROR');
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    throw new AppError(400, 'Invalid email format', 'VALIDATION_ERROR');
  }

  next();
};