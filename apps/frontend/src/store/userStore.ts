import { create } from 'zustand';

export interface User {
	id: string;
	email: string;
	name?: string;
	role: 'USER' | 'ADMIN';
	createdAt: string;
	updatedAt: string;
	_count?: {
		tasks: number;
		assigned: number;
	};
}

interface UserStore {
	users: User[];
	loading: boolean;
	error: string | null;
	setUsers: (users: User[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	fetchUsers: (token?: string) => Promise<void>;
	createUser: (userData: { email: string; password: string; name?: string; role?: 'USER' | 'ADMIN' }, token?: string) => Promise<void>;
	deleteUser: (id: string, token?: string) => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const useUserStore = create<UserStore>((set, get) => ({
	users: [],
	loading: false,
	error: null,
	setUsers: (users) => set({ users }),
	setLoading: (loading) => set({ loading }),
	setError: (error) => set({ error }),
	fetchUsers: async (token) => {
		set({ loading: true, error: null });
		try {
			const headers: Record<string, string> = { 'Content-Type': 'application/json' };
			if (token) headers['Authorization'] = `Bearer ${token}`;
			
			const res = await fetch(`${API_URL}/api/users`, { headers });
			if (!res.ok) throw new Error('Failed to fetch users');
			const users = await res.json();
			set({ users, loading: false });
		} catch (error) {
			set({ error: (error as Error).message, loading: false });
		}
	},
	createUser: async (userData, token) => {
		set({ loading: true, error: null });
		try {
			const headers: Record<string, string> = { 'Content-Type': 'application/json' };
			if (token) headers['Authorization'] = `Bearer ${token}`;
			
			const res = await fetch(`${API_URL}/api/users`, {
				method: 'POST',
				headers,
				body: JSON.stringify(userData)
			});
			if (!res.ok) throw new Error('Failed to create user');
			const user = await res.json();
			set((state) => ({ users: [...state.users, user], loading: false }));
		} catch (error) {
			set({ error: (error as Error).message, loading: false });
		}
	},
	deleteUser: async (id, token) => {
		set({ loading: true, error: null });
		try {
			const headers: Record<string, string> = { 'Content-Type': 'application/json' };
			if (token) headers['Authorization'] = `Bearer ${token}`;
			
			const res = await fetch(`${API_URL}/api/users/${id}`, { 
				method: 'DELETE',
				headers
			});
			if (!res.ok) throw new Error('Failed to delete user');
			set((state) => ({ users: state.users.filter((user) => user.id !== id), loading: false }));
		} catch (error) {
			set({ error: (error as Error).message, loading: false });
		}
	}
}));
