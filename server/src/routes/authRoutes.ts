import express from 'express';
import { AuthController } from '../controllers/authController';
import { AuthService } from '../services/authService';
import { authMiddleware } from '../middleware/auth';
import { validateRegistration, validateLogin } from '../middleware/validate';

const router = express.Router();
const authService = new AuthService();
const authController = new AuthController(authService);

// POST /api/auth/register
router.post('/register', validateRegistration, authController.register);

// POST /api/auth/login
router.post('/login', validateLogin, authController.login);

// GET /api/auth/me
router.get('/me', authMiddleware, authController.getCurrentUser);

export default router;
