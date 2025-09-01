'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../components/DashboardLayout';
import TaskList from '../../components/TaskList';
import CreateTaskForm from '../../components/CreateTaskForm';
import { useTaskStore } from '../../store/taskStore';

export default function TasksPage() {
	const { t } = useTranslation('common');
	const { data: session, status } = useSession();
	const router = useRouter();
	const { tasks } = useTaskStore();

	useEffect(() => {
		if (status === 'loading') return;
		
		if (!session) {
			router.push('/login');
		}
	}, [session, status, router]);

	if (status === 'loading') {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
					<p className="mt-4 text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
				</div>
			</div>
		);
	}

	if (!session) {
		return null;
	}

	// Calculate task statistics
	const taskStats = {
		total: tasks.length,
		completed: tasks.filter(task => task.status === 'COMPLETED').length,
		inProgress: tasks.filter(task => task.status === 'IN_PROGRESS').length,
		pending: tasks.filter(task => task.status === 'PENDING').length
	};

	return (
		<DashboardLayout title={t('tasks.title')}>
			<div className="space-y-6">
				{/* Header */}
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
								{t('tasks.title')}
							</h1>
							<p className="text-gray-600 dark:text-gray-400 mt-1">
								{t('tasks.description')}
							</p>
						</div>
						<div className="flex items-center space-x-3">
							<div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
								<div className="w-3 h-3 bg-green-500 rounded-full"></div>
								<span>{t('tasks.completed')}</span>
							</div>
							<div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
								<div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
								<span>{t('tasks.inProgress')}</span>
							</div>
							<div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
								<div className="w-3 h-3 bg-red-500 rounded-full">
									<span>{t('tasks.pending')}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Create Task Section */}
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<CreateTaskForm />
				</div>

				{/* Tasks List Section */}
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<div className="p-6 border-b border-gray-200 dark:border-gray-700">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							{t('tasks.allTasks')}
						</h2>
						<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
							{t('tasks.manageDescription')}
						</p>
					</div>
					<TaskList />
				</div>

				{/* Quick Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					<div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
						<div className="flex items-center">
							<div className="p-2 bg-blue-400 bg-opacity-30 rounded-lg">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
								</svg>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-blue-100">{t('tasks.totalTasks')}</p>
								<p className="text-2xl font-bold">{taskStats.total}</p>
							</div>
						</div>
					</div>

					<div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
						<div className="flex items-center">
							<div className="p-2 bg-green-400 bg-opacity-30 rounded-lg">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-green-100">{t('tasks.completed')}</p>
								<p className="text-2xl font-bold">{taskStats.completed}</p>
							</div>
						</div>
					</div>

					<div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
						<div className="flex items-center">
							<div className="p-2 bg-yellow-400 bg-opacity-30 rounded-lg">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-yellow-100">{t('tasks.inProgress')}</p>
								<p className="text-2xl font-bold">{taskStats.inProgress}</p>
							</div>
						</div>
					</div>

					<div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
						<div className="flex items-center">
							<div className="p-2 bg-red-400 bg-opacity-30 rounded-lg">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
								</svg>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-red-100">{t('tasks.pending')}</p>
								<p className="text-2xl font-bold">{taskStats.pending}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
