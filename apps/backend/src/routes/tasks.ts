import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { listTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/tasks.controller';

export const taskRouter = Router();

taskRouter.use(requireAuth);

taskRouter.get('/', listTasks);
taskRouter.get('/:id', getTask);
taskRouter.post('/', createTask);
taskRouter.put('/:id', updateTask);
taskRouter.delete('/:id', deleteTask);
