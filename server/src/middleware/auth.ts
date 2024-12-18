// src/middleware/auth.ts
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/request';
import { TokenPayload } from '../types/token';
import { AppError } from '../types/error';
import { config } from '../config';

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        401,
        'Authentication required. Please provide a valid token.',
        'AUTHENTICATION_ERROR'
      );
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;

      // Add user info to request
      req.user = {
        id: decoded.userId,
        email: decoded.email
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError(
          401,
          'Token has expired. Please log in again.',
          'TOKEN_EXPIRED'
        );
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError(
          401,
          'Invalid token. Please provide a valid token.',
          'INVALID_TOKEN'
        );
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// Role-based authentication middleware factory
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(
        401,
        'Authentication required',
        'AUTHENTICATION_ERROR'
      );
    }

    // Check if user has required role
    // Note: Role checking would require additional user information
    // that would need to be included in the JWT payload or fetched from the database
    
    next();
  };
};

// Rate limiting middleware
// Note: For production, consider using redis or a similar solution
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const now = Date.now();
    // Fix: Ensure we always have a string identifier
    const identifier = req.user?.id || req.ip || 'unknown';

    const userRequests = requestCounts.get(identifier) || {
      count: 0,
      resetTime: now + windowMs
    };

    if (now > userRequests.resetTime) {
      userRequests.count = 0;
      userRequests.resetTime = now + windowMs;
    }

    userRequests.count++;
    requestCounts.set(identifier, userRequests);

    if (userRequests.count > maxRequests) {
      throw new AppError(
        429,
        'Too many requests. Please try again later.',
        'RATE_LIMIT_EXCEEDED'
      );
    }

    next();
  };
};
// Token refresh middleware
// Token refresh middleware
export const refreshToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers['x-refresh-token'] as string;
    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
      
      // Generate new access token
      const accessToken = jwt.sign(
        { userId: decoded.userId, email: decoded.email },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      // Add new token to response headers
      res.setHeader('X-Access-Token', accessToken);
      next();
    } catch (error) {
      // Type guard for JWT errors
      if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
        console.warn('Invalid refresh token:', error.message);
      } else {
        // For any unknown errors
        console.warn('Refresh token error:', 'An unexpected error occurred');
      }
      next();
    }
  } catch (error) {
    // Type guard for our AppError
    if (error instanceof AppError) {
      next(error);
    } else {
      // For any unknown errors
      next(new AppError(500, 'Internal server error', 'INTERNAL_ERROR'));
    }
  }
};