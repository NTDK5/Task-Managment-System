import { create } from 'zustand';

export interface Task {
	id: string;
	title: string;
	description: string;
	status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
	dueDate?: string;
	ownerId: string;
	assignedTo?: string;
	createdAt: string;
	updatedAt: string;
}

interface TaskStore {
	tasks: Task[];
	loading: boolean;
	error: string | null;
	filter: {
		status?: string;
		order: 'asc' | 'desc';
	};
	setTasks: (tasks: Task[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	setFilter: (filter: Partial<TaskStore['filter']>) => void;
	addTask: (task: Task) => void;
	updateTask: (id: string, updates: Partial<Task>) => void;
	updateTaskAPI: (id: string, updates: Partial<Task>, token?: string) => Promise<void>;
	removeTask: (id: string) => void;
	fetchTasks: (token?: string) => Promise<void>;
	createTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, token?: string) => Promise<void>;
	deleteTask: (id: string, token?: string) => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const useTaskStore = create<TaskStore>((set, get) => ({
	tasks: [],
	loading: false,
	error: null,
	filter: { order: 'asc' },
	setTasks: (tasks) => set({ tasks }),
	setLoading: (loading) => set({ loading }),
	setError: (error) => set({ error }),
	setFilter: (filter) => set((state) => ({ filter: { ...state.filter, ...filter } })),
	addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
	updateTask: (id, updates) => set((state) => ({
		tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
	})),
	updateTaskAPI: async (id, updates, token) => {
		set({ loading: true, error: null });
		try {
			const headers: Record<string, string> = { 'Content-Type': 'application/json' };
			if (token) headers['Authorization'] = `Bearer ${token}`;
			
			const res = await fetch(`${API_URL}/api/tasks/${id}`, {
				method: 'PUT',
				headers,
				body: JSON.stringify(updates)
			});
			if (!res.ok) throw new Error('Failed to update task');
			const updatedTask = await res.json();
			set((state) => ({
				tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
				loading: false
			}));
		} catch (error) {
			set({ error: (error as Error).message, loading: false });
		}
	},
	removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
	fetchTasks: async (token) => {
		const { filter } = get();
		set({ loading: true, error: null });
		try {
			const params = new URLSearchParams();
			if (filter.status) params.append('status', filter.status);
			if (filter.order) params.append('order', filter.order);
			
			const headers: Record<string, string> = { 'Content-Type': 'application/json' };
			if (token) headers['Authorization'] = `Bearer ${token}`;
			
			const res = await fetch(`${API_URL}/api/tasks?${params}`, { headers });
			if (!res.ok) throw new Error('Failed to fetch tasks');
			const tasks = await res.json();
			set({ tasks, loading: false });
		} catch (error) {
			set({ error: (error as Error).message, loading: false });
		}
	},
	createTask: async (taskData, token) => {
		set({ loading: true, error: null });
		try {
			const headers: Record<string, string> = { 'Content-Type': 'application/json' };
			if (token) headers['Authorization'] = `Bearer ${token}`;
			
			const res = await fetch(`${API_URL}/api/tasks`, {
				method: 'POST',
				headers,
				body: JSON.stringify(taskData)
			});
			if (!res.ok) throw new Error('Failed to create task');
			const task = await res.json();
			set((state) => ({ tasks: [...state.tasks, task], loading: false }));
		} catch (error) {
			set({ error: (error as Error).message, loading: false });
		}
	},
	deleteTask: async (id, token) => {
		set({ loading: true, error: null });
		try {
			const headers: Record<string, string> = { 'Content-Type': 'application/json' };
			if (token) headers['Authorization'] = `Bearer ${token}`;
			
			const res = await fetch(`${API_URL}/api/tasks/${id}`, { 
				method: 'DELETE',
				headers
			});
			if (!res.ok) throw new Error('Failed to delete task');
			set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id), loading: false }));
		} catch (error) {
			set({ error: (error as Error).message, loading: false });
		}
	}
}));
