import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { listUsers, createUser, deleteUser, promoteToAdmin, updateUserRole } from '../controllers/users.controller';

export const userRouter = Router();

userRouter.use(requireAuth);
userRouter.use(requireRole(['ADMIN']));

userRouter.get('/', listUsers);
userRouter.post('/', createUser);
userRouter.delete('/:id', deleteUser);
userRouter.patch('/:id/role', updateUserRole);

// Special route for promoting users to admin (can be called without auth for initial setup)
userRouter.post('/promote-admin', promoteToAdmin);
