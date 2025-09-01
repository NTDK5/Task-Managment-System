'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useUserStore } from '../../store/userStore';
import { useReportStore } from '../../store/reportStore';
import TaskStatusChart from '../../components/charts/TaskStatusChart';
import UserTaskChart from '../../components/charts/UserTaskChart';
import MonthlyTrendChart from '../../components/charts/MonthlyTrendChart';
import CompletionRateChart from '../../components/charts/CompletionRateChart';
import { useTranslation } from 'react-i18next';
import { generateSampleTasks, generateSampleUsers } from '../../utils/sampleData';
import DashboardLayout from '../../components/DashboardLayout';

export default function ReportsPage() {
	const { t } = useTranslation('common');
	const { data: session, status } = useSession();
	const router = useRouter();
	const { tasks, fetchTasks } = useTaskStore();
	const { users, fetchUsers } = useUserStore();
	const { 
		taskStatusData, 
		userTaskData, 
		monthlyTaskData,
		generateTaskStatusReport, 
		generateUserTaskReport, 
		generateMonthlyReport 
	} = useReportStore();
	const [activeTab, setActiveTab] = useState('overview');
	const [demoMode, setDemoMode] = useState(false);

	useEffect(() => {
		if (session?.accessToken) {
			fetchTasks(session.accessToken);
			if ((session as any).user?.role === 'ADMIN') {
				fetchUsers(session.accessToken);
			}
		}
	}, [session, fetchTasks, fetchUsers]);

	// Demo mode for testing
	useEffect(() => {
		if (demoMode) {
			const sampleTasks = generateSampleTasks();
			const sampleUsers = generateSampleUsers();
			useTaskStore.getState().setTasks(sampleTasks);
			useUserStore.getState().setUsers(sampleUsers);
		}
	}, [demoMode]);

	useEffect(() => {
		if (tasks.length > 0) {
			generateTaskStatusReport(tasks);
			generateMonthlyReport(tasks);
			
			if (users.length > 0) {
				generateUserTaskReport(tasks, users);
			}
		}
	}, [tasks, users, generateTaskStatusReport, generateUserTaskReport, generateMonthlyReport]);

	if (status === 'loading') {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">{t('reports.loadingReports')}</p>
				</div>
			</div>
		);
	}

	if (!session) {
		router.push('/login');
		return null;
	}

	const user = (session as any).user;
	const isAdmin = user?.role === 'ADMIN';

	const tabs = [
		{ id: 'overview', label: t('reports.overview'), icon: '📊' },
		{ id: 'status', label: t('reports.taskStatus'), icon: '📋' },
		...(isAdmin ? [{ id: 'users', label: t('reports.userAnalytics'), icon: '👥' }] : []),
		{ id: 'trends', label: t('reports.monthlyTrends'), icon: '📈' }
	];

	return (
		<DashboardLayout title={t('reports.title')} showHeader={false}>
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">{t('reports.title')}</h1>
							<p className="text-gray-600 mt-2">{t('reports.description')}</p>
						</div>
						<div className="flex items-center gap-4">
							<button
								onClick={() => setDemoMode(!demoMode)}
								className={`px-4 py-2 rounded-lg transition-colors ${
									demoMode 
										? 'bg-green-600 text-white hover:bg-green-700' 
										: 'bg-gray-600 text-white hover:bg-gray-700'
								}`}
							>
								{demoMode ? `🎯 ${t('reports.demoModeOn')}` : `🎯 ${t('reports.demoMode')}`}
							</button>
						</div>
					</div>
				</div>

				{/* Tab Navigation */}
				<div className="mb-6">
					<div className="border-b border-gray-200">
						<nav className="-mb-px flex space-x-8">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
										activeTab === tab.id
											? 'border-indigo-500 text-indigo-600'
											: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
									}`}
								>
									<span>{tab.icon}</span>
									{tab.label}
								</button>
							))}
						</nav>
					</div>
				</div>

				{/* Content */}
				<div className="space-y-6">
					{/* Overview Tab */}
					{activeTab === 'overview' && (
						<div className="space-y-6">
							{/* Summary Cards */}
							<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
								<div className="bg-white p-6 rounded-lg shadow-md">
									<div className="flex items-center">
										<div className="p-2 bg-blue-100 rounded-lg">
											<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
											</svg>
										</div>
										<div className="ml-4">
											<p className="text-sm font-medium text-gray-600">{t('reports.totalTasks')}</p>
											<p className="text-2xl font-semibold text-gray-900">{tasks.length}</p>
										</div>
									</div>
								</div>

								<div className="bg-white p-6 rounded-lg shadow-md">
									<div className="flex items-center">
										<div className="p-2 bg-green-100 rounded-lg">
											<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
										</div>
										<div className="ml-4">
											<p className="text-sm font-medium text-gray-600">{t('reports.completed')}</p>
											<p className="text-2xl font-semibold text-gray-900">
												{tasks.filter(t => t.status === 'COMPLETED').length}
											</p>
										</div>
									</div>
								</div>

								<div className="bg-white p-6 rounded-lg shadow-md">
									<div className="flex items-center">
										<div className="p-2 bg-yellow-100 rounded-lg">
											<svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
										</div>
										<div className="ml-4">
											<p className="text-sm font-medium text-gray-600">{t('reports.pending')}</p>
											<p className="text-2xl font-semibold text-gray-900">
												{tasks.filter(t => t.status === 'PENDING').length}
											</p>
										</div>
									</div>
								</div>

								<div className="bg-white p-6 rounded-lg shadow-md">
									<div className="flex items-center">
										<div className="p-2 bg-purple-100 rounded-lg">
											<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
											</svg>
										</div>
										<div className="ml-4">
											<p className="text-sm font-medium text-gray-600">{t('reports.activeUsers')}</p>
											<p className="text-2xl font-semibold text-gray-900">{users.length}</p>
										</div>
									</div>
								</div>
							</div>

							{/* Charts Grid */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<TaskStatusChart data={taskStatusData} />
								{isAdmin && <CompletionRateChart data={userTaskData} />}
							</div>
						</div>
					)}

					{/* Task Status Tab */}
					{activeTab === 'status' && (
						<div className="space-y-6">
							<TaskStatusChart data={taskStatusData} />
							
							{/* Status Details Table */}
							<div className="bg-white rounded-lg shadow-md overflow-hidden">
								<div className="px-6 py-4 border-b border-gray-200">
									<h3 className="text-lg font-semibold text-gray-800">Task Status Details</h3>
								</div>
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{taskStatusData.map((item) => (
												<tr key={item.status}>
													<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
														{item.status.replace('_', ' ')}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.count}</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.percentage}%</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					)}

					{/* User Analytics Tab (Admin Only) */}
					{activeTab === 'users' && isAdmin && (
						<div className="space-y-6">
							<UserTaskChart data={userTaskData} />
							<CompletionRateChart data={userTaskData} />
							
							{/* User Details Table */}
							<div className="bg-white rounded-lg shadow-md overflow-hidden">
								<div className="px-6 py-4 border-b border-gray-200">
									<h3 className="text-lg font-semibold text-gray-800">User Performance Details</h3>
								</div>
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Tasks</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Progress</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{userTaskData.map((user) => (
												<tr key={user.userId}>
													<td className="px-6 py-4 whitespace-nowrap">
														<div>
															<div className="text-sm font-medium text-gray-900">{user.userName}</div>
															<div className="text-sm text-gray-500">{user.userEmail}</div>
														</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.totalTasks}</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.pendingTasks}</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.inProgressTasks}</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.completedTasks}</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
															user.completionRate >= 80 ? 'bg-green-100 text-green-800' :
															user.completionRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
															'bg-red-100 text-red-800'
														}`}>
															{user.completionRate}%
														</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					)}

					{/* Monthly Trends Tab */}
					{activeTab === 'trends' && (
						<div className="space-y-6">
							<MonthlyTrendChart data={monthlyTaskData} />
							
							{/* Trends Summary */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="bg-white p-6 rounded-lg shadow-md">
									<h4 className="text-lg font-semibold text-gray-800 mb-4">Trend Analysis</h4>
									<div className="space-y-3">
										<div className="flex justify-between">
											<span className="text-gray-600">Average Monthly Tasks:</span>
											<span className="font-semibold">
												{monthlyTaskData.length > 0 
													? Math.round(monthlyTaskData.reduce((sum, item) => sum + item.totalTasks, 0) / monthlyTaskData.length)
													: 0
												}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Peak Month:</span>
											<span className="font-semibold">
												{monthlyTaskData.length > 0 
													? monthlyTaskData.reduce((max, item) => item.totalTasks > max.totalTasks ? item : max).month
													: 'N/A'
												}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Growth Trend:</span>
											<span className="font-semibold text-green-600">↗️ Increasing</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</DashboardLayout>
	);
}
