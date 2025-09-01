'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTaskStore } from '../store/taskStore';
import { useSession } from 'next-auth/react';

export default function TaskList() {
	const { t } = useTranslation('common');
	const { tasks, fetchTasks, deleteTask, updateTaskAPI } = useTaskStore();
	const { data: session } = useSession();
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState('all');
	const [sortBy, setSortBy] = useState('newest');

	useEffect(() => {
		const loadTasks = async () => {
			try {
				await fetchTasks((session as any)?.accessToken);
			} catch (error) {
				console.error('Failed to fetch tasks:', error);
			} finally {
				setLoading(false);
			}
		};

		loadTasks();
	}, [fetchTasks, session]);

	const handleDelete = async (taskId: string) => {
		if (confirm(t('tasks.confirmDelete'))) {
			try {
				await deleteTask(taskId, (session as any)?.accessToken);
			} catch (error) {
				console.error('Failed to delete task:', error);
			}
		}
	};

	const handleStatusChange = async (taskId: string, newStatus: string) => {
		try {
			await updateTaskAPI(taskId, { status: newStatus as any }, (session as any)?.accessToken);
		} catch (error) {
			console.error('Failed to update task status:', error);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'COMPLETED':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-700';
			case 'IN_PROGRESS':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
			case 'PENDING':
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-700';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-700';
		}
	};

	const filteredAndSortedTasks = tasks
		.filter(task => filter === 'all' || task.status === filter)
		.sort((a, b) => {
			if (sortBy === 'newest') {
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			} else {
				return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
			}
		});

	if (loading) {
		return (
			<div className="p-8 text-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
				<p className="mt-2 text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
			</div>
		);
	}

	return (
		<div className="p-6">
			{/* Filters and Sort */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
				<div className="flex space-x-2">
					<select
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
						className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
					>
						<option value="all">{t('tasks.allStatus')}</option>
						<option value="PENDING">{t('tasks.pending')}</option>
						<option value="IN_PROGRESS">{t('tasks.inProgress')}</option>
						<option value="COMPLETED">{t('tasks.completed')}</option>
					</select>
				</div>
				<div className="flex space-x-2">
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}
						className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
					>
						<option value="newest">{t('tasks.newestFirst')}</option>
						<option value="oldest">{t('tasks.oldestFirst')}</option>
					</select>
				</div>
			</div>

			{/* Tasks Grid */}
			{filteredAndSortedTasks.length === 0 ? (
				<div className="text-center py-12">
					<div className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500">
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
						</svg>
					</div>
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
						{t('tasks.noTasksFound')}
					</h3>
					<p className="text-gray-500 dark:text-gray-400">
						{t('tasks.noTasksDescription')}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredAndSortedTasks.map((task) => (
						<div
							key={task.id}
							className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200"
						>
							{/* Task Header */}
							<div className="flex items-start justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
									{task.title}
								</h3>
								<div className="flex space-x-2">
									<button
										onClick={() => handleDelete(task.id)}
										className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
										title={t('tasks.delete')}
									>
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
										</svg>
									</button>
								</div>
							</div>

							{/* Task Description */}
							<p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
								{task.description}
							</p>

							{/* Task Meta */}
							<div className="space-y-3">
								{/* Status */}
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-500 dark:text-gray-400">{t('tasks.status')}</span>
									<select
										value={task.status}
										onChange={(e) => handleStatusChange(task.id, e.target.value)}
										className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
									>
										<option value="PENDING">{t('tasks.pending')}</option>
										<option value="IN_PROGRESS">{t('tasks.inProgress')}</option>
										<option value="COMPLETED">{t('tasks.completed')}</option>
									</select>
								</div>

								{/* Status Badge */}
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-500 dark:text-gray-400">{t('tasks.currentStatus')}</span>
									<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(task.status)}`}>
										{task.status}
									</span>
								</div>

								{/* Due Date */}
								{task.dueDate && (
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-500 dark:text-gray-400">{t('tasks.due')}</span>
										<span className="text-sm text-gray-900 dark:text-white">
											{new Date(task.dueDate).toLocaleDateString()}
										</span>
									</div>
								)}

								{/* Assigned To */}
								{task.assignedTo && (
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-500 dark:text-gray-400">{t('tasks.assignedTo')}</span>
										<span className="text-sm text-gray-900 dark:text-white">
											{task.assignedTo}
										</span>
									</div>
								)}
							</div>

							{/* Task Footer */}
							<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
								<div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
									<span>{t('tasks.created')}: {new Date(task.createdAt).toLocaleDateString()}</span>
									<span>{t('tasks.updated')}: {new Date(task.updatedAt).toLocaleDateString()}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
