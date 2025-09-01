import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthUser } from '../middleware/auth';

export const listTasks = async (req: Request & { user?: AuthUser }, res: Response) => {
	try {
		const status = (req.query.status as string | undefined) ?? undefined;
		const order = (req.query.order as 'asc' | 'desc' | undefined) ?? 'asc';
		const where: any = {};
		if (status) where.status = status as any;
		if (req.user?.role !== 'ADMIN') {
			where.OR = [{ ownerId: req.user!.userId }, { assignedTo: req.user!.userId }];
		}
		const tasks = await prisma.task.findMany({ where, orderBy: { dueDate: order } });
		return res.json(tasks);
	} catch (e) {
		return res.status(500).json({ message: 'Failed to fetch tasks' });
	}
};

export const getTask = async (req: Request & { user?: AuthUser }, res: Response) => {
	try {
		const id = req.params.id;
		const task = await prisma.task.findUnique({ where: { id } });
		if (!task) return res.status(404).json({ message: 'Not found' });
		if (req.user?.role !== 'ADMIN' && task.ownerId !== req.user!.userId && task.assignedTo !== req.user!.userId) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		return res.json(task);
	} catch {
		return res.status(500).json({ message: 'Failed to get task' });
	}
};

export const createTask = async (req: Request & { user?: AuthUser }, res: Response) => {
	try {
		const { title, description, dueDate, assignedTo } = req.body as {
			title: string;
			description: string;
			dueDate?: string;
			assignedTo?: string;
		};
		if (!title || !description) return res.status(400).json({ message: 'Missing fields' });
		if (assignedTo && req.user?.role !== 'ADMIN') return res.status(403).json({ message: 'Assign requires admin' });
		console.log(req.user);
		const task = await prisma.task.create({
			data: {
				title,
				description,
				ownerId: req.user!.userId,
				assignedTo: assignedTo || null,
				dueDate: dueDate ? new Date(dueDate) : null
			}
		});
		return res.status(201).json(task);
	} catch {
		return res.status(500).json({ message: 'Failed to create task' });
	}
};

export const updateTask = async (req: Request & { user?: AuthUser }, res: Response) => {
	try {
		const id = req.params.id;
		const existing = await prisma.task.findUnique({ where: { id } });
		if (!existing) return res.status(404).json({ message: 'Not found' });
		if (req.user?.role !== 'ADMIN' && existing.ownerId !== req.user!.userId && existing.assignedTo !== req.user!.userId) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		const { title, description, status, dueDate, assignedTo } = req.body as any;
		if (assignedTo && req.user?.role !== 'ADMIN') return res.status(403).json({ message: 'Assign requires admin' });
		const task = await prisma.task.update({
			where: { id },
			data: {
				title,
				description,
				status,
				dueDate: dueDate ? new Date(dueDate) : undefined,
				assignedTo: assignedTo ?? undefined
			}
		});
		return res.json(task);
	} catch {
		return res.status(500).json({ message: 'Failed to update task' });
	}
};

export const deleteTask = async (req: Request & { user?: AuthUser }, res: Response) => {
	try {
		const id = req.params.id;
		const existing = await prisma.task.findUnique({ where: { id } });
		if (!existing) return res.status(404).json({ message: 'Not found' });
		if (req.user?.role !== 'ADMIN' && existing.ownerId !== req.user!.userId) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		await prisma.task.delete({ where: { id } });
		return res.status(204).send();
	} catch {
		return res.status(500).json({ message: 'Failed to delete task' });
	}
};
