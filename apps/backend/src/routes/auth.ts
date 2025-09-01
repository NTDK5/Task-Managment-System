import { Router } from 'express';
import { register, login, oauth } from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/oauth', oauth);

// export default authRouter;
