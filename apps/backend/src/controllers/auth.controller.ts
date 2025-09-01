import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';

export const register = async (req: Request, res: Response) => {
	try {
		const { email, password, name } = req.body;

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email }
		});

		if (existingUser) {
			return res.status(400).json({ message: 'User already exists' });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				name,
				role: 'USER'
			}
		});

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user.id, email: user.email, role: user.role },
			process.env.JWT_SECRET!,
			{ expiresIn: '7d' }
		);

		// Remove password from response
		const { password: _, ...userWithoutPassword } = user;

		res.status(201).json({
			message: 'User created successfully',
			user: userWithoutPassword,
			token
		});
	} catch (error) {
		console.error('Registration error:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		// Find user
		const user = await prisma.user.findUnique({
			where: { email }
		});

		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		// Check password
		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user.id, email: user.email, role: user.role },
			process.env.JWT_SECRET!,
			{ expiresIn: '7d' }
		);

		// Remove password from response
		const { password: _, ...userWithoutPassword } = user;

		res.json({
			message: 'Login successful',
			user: userWithoutPassword,
			token
		});
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const oauth = async (req: Request, res: Response) => {
	try {
		const { email, name, provider, providerId, image } = req.body;

		if (!email) {
			return res.status(400).json({ message: 'Email is required' });
		}

		// Check if user already exists
		let user = await prisma.user.findUnique({
			where: { email }
		});

		if (!user) {
			// Create new user for OAuth
			user = await prisma.user.create({
				data: {
					email,
					name: name || email.split('@')[0],
					password: '', // OAuth users don't need password
					role: 'USER'
				}
			});
		}

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user.id, email: user.email, role: user.role },
			process.env.JWT_SECRET!,
			{ expiresIn: '7d' }
		);

		// Remove password from response
		const { password: _, ...userWithoutPassword } = user;

		res.json({
			message: 'OAuth login successful',
			user: userWithoutPassword,
			token
		});
	} catch (error) {
		console.error('OAuth error:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
