import { create } from 'zustand';
import { Task } from './taskStore';
import { User } from './userStore';

export interface TaskStatusData {
	status: string;
	count: number;
	percentage: number;
}

export interface UserTaskData {
	userId: string;
	userName: string;
	userEmail: string;
	totalTasks: number;
	pendingTasks: number;
	inProgressTasks: number;
	completedTasks: number;
	completionRate: number;
}

export interface MonthlyTaskData {
	month: string;
	totalTasks: number;
	completedTasks: number;
	pendingTasks: number;
}

interface ReportStore {
	loading: boolean;
	error: string | null;
	taskStatusData: TaskStatusData[];
	userTaskData: UserTaskData[];
	monthlyTaskData: MonthlyTaskData[];
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	generateTaskStatusReport: (tasks: Task[]) => void;
	generateUserTaskReport: (tasks: Task[], users: User[]) => void;
	generateMonthlyReport: (tasks: Task[]) => void;
}

export const useReportStore = create<ReportStore>((set) => ({
	loading: false,
	error: null,
	taskStatusData: [],
	userTaskData: [],
	monthlyTaskData: [],
	setLoading: (loading) => set({ loading }),
	setError: (error) => set({ error }),
	
	generateTaskStatusReport: (tasks: Task[]) => {
		const totalTasks = tasks.length;
		const statusCounts = tasks.reduce((acc, task) => {
			acc[task.status] = (acc[task.status] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const statusData: TaskStatusData[] = Object.entries(statusCounts).map(([status, count]) => ({
			status,
			count,
			percentage: totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0
		}));

		set({ taskStatusData: statusData });
	},

	generateUserTaskReport: (tasks: Task[], users: User[]) => {
		const userTaskMap = new Map<string, { total: number; pending: number; inProgress: number; completed: number }>();

		// Initialize user task counts
		users.forEach(user => {
			userTaskMap.set(user.id, { total: 0, pending: 0, inProgress: 0, completed: 0 });
		});

		// Count tasks by user
		tasks.forEach(task => {
			const userData = userTaskMap.get(task.ownerId);
			if (userData) {
				userData.total++;
				switch (task.status) {
					case 'PENDING':
						userData.pending++;
						break;
					case 'IN_PROGRESS':
						userData.inProgress++;
						break;
					case 'COMPLETED':
						userData.completed++;
						break;
				}
			}
		});

		const userTaskData: UserTaskData[] = users.map(user => {
			const taskData = userTaskMap.get(user.id) || { total: 0, pending: 0, inProgress: 0, completed: 0 };
			return {
				userId: user.id,
				userName: user.name || 'Unknown',
				userEmail: user.email,
				totalTasks: taskData.total,
				pendingTasks: taskData.pending,
				inProgressTasks: taskData.inProgress,
				completedTasks: taskData.completed,
				completionRate: taskData.total > 0 ? Math.round((taskData.completed / taskData.total) * 100) : 0
			};
		});

		set({ userTaskData });
	},

	generateMonthlyReport: (tasks: Task[]) => {
		const monthlyData = new Map<string, { total: number; completed: number; pending: number }>();

		tasks.forEach(task => {
			const date = new Date(task.createdAt);
			const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
			
			if (!monthlyData.has(monthKey)) {
				monthlyData.set(monthKey, { total: 0, completed: 0, pending: 0 });
			}

			const data = monthlyData.get(monthKey)!;
			data.total++;
			
			if (task.status === 'COMPLETED') {
				data.completed++;
			} else if (task.status === 'PENDING') {
				data.pending++;
			}
		});

		const monthlyTaskData: MonthlyTaskData[] = Array.from(monthlyData.entries())
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([monthKey, data]) => {
				const [year, month] = monthKey.split('-');
				const date = new Date(parseInt(year), parseInt(month) - 1);
				return {
					month: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
					totalTasks: data.total,
					completedTasks: data.completed,
					pendingTasks: data.pending
				};
			});

		set({ monthlyTaskData });
	}
}));
