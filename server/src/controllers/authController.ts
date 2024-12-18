import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AuthenticatedRequest } from '../types/request';
import { CreateUserDto, LoginDto } from '../types/user';
import { AppError } from '../types/error';

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (
    req: Request<{}, {}, CreateUserDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Validate input
      if (!email || !password || !firstName || !lastName) {
        throw new AppError(400, 'Missing required fields', 'VALIDATION_ERROR');
      }

      const result = await this.authService.register({
        email,
        password,
        firstName,
        lastName,
      });

      res.status(201).json({
        success: true,
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request<{}, {}, LoginDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError(400, 'Missing credentials', 'VALIDATION_ERROR');
      }

      const result = await this.authService.login({ email, password });

      res.json({
        success: true,
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getCurrentUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.authService.getUserById(req.user!.id);
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}