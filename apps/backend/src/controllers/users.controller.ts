import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthUser } from '../middleware/auth';

export const listUsers = async (req: Request & { user?: AuthUser }, res: Response) => {
	try {
		if (req.user?.role !== 'ADMIN') {
			return res.status(403).json({ message: 'Forbidden' });
		}

		const users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				createdAt: true,
				updatedAt: true,
				_count: {
					select: {
						tasks: true,
						assigned: true
					}
				}
			},
			orderBy: { createdAt: 'desc' }
		});

		return res.json(users);
	} catch (error) {
		return res.status(500).json({ message: 'Failed to fetch users' });
	}
};

export const createUser = async (req: Request & { user?: AuthUser }, res: Response) => {
	try {
		if (req.user?.role !== 'ADMIN') {
			return res.status(403).json({ message: 'Forbidden' });
		}

		const { email, password, name, role } = req.body as {
			email: string;
			password: string;
			name?: string;
			role?: 'USER' | 'ADMIN';
		};

		if (!email || !password) {
			return res.status(400).json({ message: 'Email and password required' });
		}

		const exists = await prisma.user.findUnique({ where: { email } });
		if (exists) {
			return res.status(409).json({ message: 'User already exists' });
		}

		const bcrypt = await import('bcrypt');
		const hashed = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				email,
				password: hashed,
				name,
				role: role || 'USER'
			},
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				createdAt: true,
				updatedAt: true
			}
		});

		return res.status(201).json(user);
	} catch (error) {
		return res.status(500).json({ message: 'Failed to create user' });
	}
};

export const promoteToAdmin = async (req: Request & { user?: AuthUser }, res: Response) => {
	try {
		// Allow this endpoint to be called without authentication for initial setup
		// In production, you might want to add additional security measures
		
		const { email, secretKey } = req.body as {
			email: string;
			secretKey?: string;
		};

		if (!email) {
			return res.status(400).json({ message: 'Email is required' });
		}

		// Optional secret key for additional security
		const expectedSecretKey = process.env.ADMIN_SECRET_KEY || 'admin-setup-2024';
		if (secretKey && secretKey !== expectedSecretKey) {
			return res.status(403).json({ message: 'Invalid secret key' });
		}

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		if (user.role === 'ADMIN') {
			return res.status(200).json({ message: 'User is already an admin', user });
		}

		const updatedUser = await prisma.user.update({
			where: { email },
			data: { role: 'ADMIN' },
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				createdAt: true,
				updatedAt: true
			}
		});

		return res.json({ 
			message: 'User promoted to admin successfully', 
			user: updatedUser 
		});
	} catch (error) {
		return res.status(500).json({ message: 'Failed to promote user to admin' });
	}
};

export const updateUserRole = async (req: Request & { user?: AuthUser }, res: Response) => {
	try {
		if (req.user?.role !== 'ADMIN') {
			return res.status(403).json({ message: 'Forbidden' });
		}

		const userId = req.params.id;
		const { role } = req.body as { role: 'USER' | 'ADMIN' };

		if (!role || !['USER', 'ADMIN'].includes(role)) {
			return res.status(400).json({ message: 'Invalid role. Must be USER or ADMIN' });
		}

		// Prevent admin from changing their own role
		if (userId === req.user.id) {
			return res.status(400).json({ message: 'Cannot change your own role' });
		}

		const user = await prisma.user.findUnique({ where: { id: userId } });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: { role },
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				createdAt: true,
				updatedAt: true
			}
		});

		return res.json({ 
			message: 'User role updated successfully', 
			user: updatedUser 
		});
	} catch (error) {
		return res.status(500).json({ message: 'Failed to update user role' });
	}
};

export const deleteUser = async (req: Request & { user?: AuthUser }, res: Response) => {
	try {
		if (req.user?.role !== 'ADMIN') {
			return res.status(403).json({ message: 'Forbidden' });
		}

		const userId = req.params.id;
		
		// Prevent admin from deleting themselves
		if (userId === req.user.id) {
			return res.status(400).json({ message: 'Cannot delete your own account' });
		}

		// Delete user's tasks first
		await prisma.task.deleteMany({
			where: {
				OR: [
					{ ownerId: userId },
					{ assignedTo: userId }
				]
			}
		});

		// Delete the user
		await prisma.user.delete({ where: { id: userId } });

		return res.status(204).send();
	} catch (error) {
		return res.status(500).json({ message: 'Failed to delete user' });
	}
};
