import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import { authRouter } from './routes/auth';
import { taskRouter } from './routes/tasks';
import { userRouter } from './routes/users';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/users', userRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on :${port}`));
