import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export type AuthUser = {
	userId: string;
	email: string;
	role: 'USER' | 'ADMIN';
};

export const requireAuth = (
	req: Request & { user?: AuthUser },
	res: Response,
	next: NextFunction
) => {
	const auth = req.headers.authorization || '';
	const token = auth.startsWith('Bearer ') ? auth.slice(7) : undefined;
	if (!token) return res.status(401).json({ message: 'Unauthorized' });
	try {
		const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
		const payload = jwt.verify(token, secret) as AuthUser;
		req.user = payload;
		return next();
	} catch {
		return res.status(401).json({ message: 'Invalid token' });
	}
};

export const requireRole = (roles: Array<'USER' | 'ADMIN'>) => (
	req: Request & { user?: AuthUser },
	res: Response,
	next: NextFunction
) => {
	if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
	if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
	return next();
};
