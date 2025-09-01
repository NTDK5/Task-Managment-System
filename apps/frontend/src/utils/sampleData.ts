import { Task } from '../store/taskStore';

export const generateSampleTasks = (): Task[] => {
	const statuses: Task['status'][] = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
	const sampleTasks = [
		'Design new landing page',
		'Implement user authentication',
		'Create API documentation',
		'Set up CI/CD pipeline',
		'Optimize database queries',
		'Write unit tests',
		'Deploy to production',
		'Code review for feature branch',
		'Update dependencies',
		'Fix critical bug in payment system',
		'Create user onboarding flow',
		'Implement search functionality',
		'Add email notifications',
		'Set up monitoring and logging',
		'Create admin dashboard',
		'Optimize image loading',
		'Implement caching strategy',
		'Add multi-language support',
		'Create mobile responsive design',
		'Set up automated backups'
	];

	const tasks: Task[] = [];
	const now = new Date();
	
	// Generate tasks for the last 6 months
	for (let i = 0; i < 50; i++) {
		const randomDaysAgo = Math.floor(Math.random() * 180); // Last 6 months
		const createdAt = new Date(now.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
		const updatedAt = new Date(createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
		
		tasks.push({
			id: `task-${i + 1}`,
			title: sampleTasks[i % sampleTasks.length],
			description: `Sample task description for ${sampleTasks[i % sampleTasks.length]}`,
			status: statuses[Math.floor(Math.random() * statuses.length)],
			dueDate: new Date(createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
			ownerId: `user-${Math.floor(Math.random() * 5) + 1}`, // 5 users
			assignedTo: `user-${Math.floor(Math.random() * 5) + 1}`,
			createdAt: createdAt.toISOString(),
			updatedAt: updatedAt.toISOString()
		});
	}

	return tasks;
};

export const generateSampleUsers = () => {
	return [
		{ id: 'user-1', name: 'John Doe', email: 'john@example.com', role: 'ADMIN' as const },
		{ id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', role: 'USER' as const },
		{ id: 'user-3', name: 'Bob Johnson', email: 'bob@example.com', role: 'USER' as const },
		{ id: 'user-4', name: 'Alice Brown', email: 'alice@example.com', role: 'USER' as const },
		{ id: 'user-5', name: 'Charlie Wilson', email: 'charlie@example.com', role: 'USER' as const }
	];
};
