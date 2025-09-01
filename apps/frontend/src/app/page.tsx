'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../components/DashboardLayout';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Link from 'next/link';

export default function Home() {
	const { t } = useTranslation('common');
	const { data: session, status } = useSession();
	const { tasks, fetchTasks } = useTaskStore();

	// Load tasks when user is authenticated
	useEffect(() => {
		const token = (session as any)?.accessToken as string | undefined;
		if (token) {
			fetchTasks(token);
		}
	}, [session, fetchTasks]);

	if (status === 'loading') {
		return <div className="text-center py-8">{t('common.loading')}</div>;
	}

	// Show welcome page for unauthenticated users
	if (!session) {
		return (
			<div className="min-h-screen bg-gray-50">
				<header className="flex items-center justify-end p-6">
					<LanguageSwitcher />
				</header>
				
				<main className="flex items-center justify-center min-h-[calc(100vh-100px)]">
					<div className="text-center max-w-2xl mx-auto px-6">
						<h1 className="text-4xl font-bold text-gray-900 mb-4">
							{t('title')}
						</h1>
						<p className="text-xl text-gray-600 mb-8">
							{t('manageTasksEfficiently')}
						</p>
						
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								href="/login"
								className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
							>
								{t('signIn')}
							</Link>
							<Link
								href="/register"
								className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
							>
								{t('createAccount')}
							</Link>
						</div>
						
						<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="text-center">
								<div className="text-3xl font-bold text-indigo-600 mb-2">📋</div>
								<h3 className="font-semibold mb-2">{t('taskManagement')}</h3>
								<p className="text-gray-600">{t('createOrganizeTrack')}</p>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-indigo-600 mb-2">👥</div>
								<h3 className="font-semibold mb-2">{t('teamCollaboration')}</h3>
								<p className="text-gray-600">{t('assignCollaborate')}</p>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-indigo-600 mb-2">🌍</div>
								<h3 className="font-semibold mb-2">{t('multilingual')}</h3>
								<p className="text-gray-600">{t('availableLanguages')}</p>
							</div>
						</div>
					</div>
				</main>
			</div>
		);
	}

	const taskStats = {
		total: tasks.length,
		pending: tasks.filter(t => t.status === 'PENDING').length,
		inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
		completed: tasks.filter(t => t.status === 'COMPLETED').length
	};

	return (
		<DashboardLayout title={t('dashboard.title')}>
			<div className="space-y-6">
				{/* Welcome Message */}
				<div className="bg-white rounded-lg shadow-sm p-6">
					<h2 className="text-xl font-semibold text-gray-800 mb-2">{t('dashboard.welcomeMessage')}</h2>
					<p className="text-gray-600">
						{t('dashboard.welcomeDescription')}
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<div className="flex items-center">
							<div className="p-2 bg-blue-100 rounded-lg">
								<span className="text-2xl">📋</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">{t('dashboard.totalTasks')}</p>
								<p className="text-2xl font-semibold text-gray-900">{taskStats.total}</p>
							</div>
						</div>
					</div>
					
					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<div className="flex items-center">
							<div className="p-2 bg-yellow-100 rounded-lg">
								<span className="text-2xl">⏳</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">{t('status.PENDING')}</p>
								<p className="text-2xl font-semibold text-gray-900">{taskStats.pending}</p>
							</div>
						</div>
					</div>
					
					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<div className="flex items-center">
							<div className="p-2 bg-orange-100 rounded-lg">
								<span className="text-2xl">🔄</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">{t('status.IN_PROGRESS')}</p>
								<p className="text-2xl font-semibold text-gray-900">{taskStats.inProgress}</p>
							</div>
						</div>
					</div>
					
					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<div className="flex items-center">
							<div className="p-2 bg-green-100 rounded-lg">
								<span className="text-2xl">✅</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">{t('status.COMPLETED')}</p>
								<p className="text-2xl font-semibold text-gray-900">{taskStats.completed}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.quickActions')}</h3>
						<div className="space-y-3">
							<a
								href="/tasks"
								className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
							>
								<span className="text-xl mr-3">📋</span>
								<div>
									<p className="font-medium text-gray-900">{t('dashboard.viewAllTasks')}</p>
									<p className="text-sm text-gray-600">{t('dashboard.manageOrganizeTasks')}</p>
								</div>
							</a>
							<a
								href="/reports"
								className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
							>
								<span className="text-xl mr-3">📊</span>
								<div>
									<p className="font-medium text-gray-900">{t('dashboard.viewReports')}</p>
									<p className="text-sm text-gray-600">{t('dashboard.analyticsInsights')}</p>
								</div>
							</a>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.recentActivity')}</h3>
						<div className="space-y-3">
							<div className="flex items-center text-sm text-gray-600">
								<span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
								<span>{t('dashboard.dashboardAccessed')}</span>
								<span className="ml-auto">{t('dashboard.justNow')}</span>
							</div>
							<div className="flex items-center text-sm text-gray-600">
								<span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
								<span>{t('dashboard.tasksLoaded')}</span>
								<span className="ml-auto">{t('dashboard.justNow')}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
