import express from 'express';
import { TaskController } from '../controllers/taskController';
import { TaskService } from '../services/taskService';
import { validateTask } from '../middleware/validate';

const router = express.Router();
const taskService = new TaskService();
const taskController = new TaskController(taskService);

// GET /api/tasks
router.get('/', taskController.getTasks);

// GET /api/tasks/:id
router.get('/:id', taskController.getTaskById);

// POST /api/tasks
router.post('/', validateTask, taskController.createTask);

// PUT /api/tasks/:id
router.put('/:id', validateTask, taskController.updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', taskController.deleteTask);

export default router;