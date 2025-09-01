'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../components/DashboardLayout';
import UserManagementTable from '../../components/admin/UserManagementTable';
import CreateUserModal from '../../components/admin/CreateUserModal';
import { User } from '../../store/userStore';

export default function AdminPage() {
	const { t } = useTranslation('common');
	const { data: session, status } = useSession();
	const router = useRouter();
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterRole, setFilterRole] = useState<string>('all');

	useEffect(() => {
		if (status === 'loading') return;
		
		if (!session) {
			router.push('/login');
			return;
		}

		// Check if user is admin
		const user = (session as any).user;
		if (user?.role !== 'ADMIN') {
			router.push('/');
			return;
		}

		fetchUsers();
	}, [session, status, router]);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const token = (session as any)?.accessToken;
			
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/users`, {
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error('Failed to fetch users');
			}

			const data = await response.json();
			setUsers(data);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	};

	const handleCreateUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
		try {
			const token = (session as any)?.accessToken;
			
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/users`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(userData)
			});

			if (!response.ok) {
				throw new Error('Failed to create user');
			}

			const newUser = await response.json();
			setUsers(prev => [newUser, ...prev]);
			setShowCreateModal(false);
		} catch (err) {
			setError((err as Error).message);
		}
	};

	const handleDeleteUser = async (userId: string) => {
		if (!confirm(t('admin.confirmDeleteUser'))) return;

		try {
			const token = (session as any)?.accessToken;
			
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/users/${userId}`, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error('Failed to delete user');
			}

			setUsers(prev => prev.filter(user => user.id !== userId));
		} catch (err) {
			setError((err as Error).message);
		}
	};

	const handleUpdateUserRole = async (userId: string, newRole: 'USER' | 'ADMIN') => {
		try {
			const token = (session as any)?.accessToken;
			
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/users/${userId}/role`, {
				method: 'PATCH',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ role: newRole })
			});

			if (!response.ok) {
				throw new Error('Failed to update user role');
			}

			const updatedUser = await response.json();
			setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user));
		} catch (err) {
			setError((err as Error).message);
		}
	};

	// Filter users based on search and role
	const filteredUsers = users.filter(user => {
		const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
							user.email.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesRole = filterRole === 'all' || user.role === filterRole;
		return matchesSearch && matchesRole;
	});

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

	if (!session || (session as any).user?.role !== 'ADMIN') {
		return null;
	}

	return (
		<DashboardLayout title={t('admin.title')}>
			<div className="space-y-6">
				{/* Header */}
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.title')}</h1>
							<p className="text-gray-600 dark:text-gray-400">{t('admin.description')}</p>
						</div>
						<button
							onClick={() => setShowCreateModal(true)}
							className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
						>
							{t('admin.createUser')}
						</button>
					</div>
				</div>

				{/* Filters */}
				<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								{t('admin.searchUsers')}
							</label>
							<input
								type="text"
								id="search"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder={t('admin.searchPlaceholder')}
								className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
							/>
						</div>
						<div className="sm:w-48">
							<label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								{t('admin.filterByRole')}
							</label>
							<select
								id="role-filter"
								value={filterRole}
								onChange={(e) => setFilterRole(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
							>
								<option value="all">{t('admin.allRoles')}</option>
								<option value="USER">{t('admin.userRole')}</option>
								<option value="ADMIN">{t('admin.adminRole')}</option>
							</select>
						</div>
					</div>
				</div>

				{/* Error Display */}
				{error && (
					<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
								</svg>
							</div>
							<div className="ml-3">
								<h3 className="text-sm font-medium text-red-800 dark:text-red-200">{t('admin.error')}</h3>
								<div className="mt-2 text-sm text-red-700 dark:text-red-300">
									<p>{error}</p>
								</div>
								<div className="mt-4">
									<button
										type="button"
										onClick={() => setError(null)}
										className="bg-red-50 dark:bg-red-900/30 px-2 py-1 text-xs font-medium text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md"
									>
										{t('admin.dismiss')}
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Users Table */}
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
					{loading ? (
						<div className="p-8 text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
							<p className="mt-2 text-gray-600 dark:text-gray-400">{t('admin.loadingUsers')}</p>
						</div>
					) : (
						<UserManagementTable
							users={filteredUsers}
							onDeleteUser={handleDeleteUser}
							onUpdateUserRole={handleUpdateUserRole}
							currentUserId={(session as any).user?.id}
						/>
					)}
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
						<div className="flex items-center">
							<div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
								<svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
								</svg>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('admin.totalUsers')}</p>
								<p className="text-2xl font-semibold text-gray-900 dark:text-white">{users.length}</p>
							</div>
						</div>
					</div>

					<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
						<div className="flex items-center">
							<div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
								<svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('admin.activeUsers')}</p>
								<p className="text-2xl font-semibold text-gray-900 dark:text-white">
									{users.filter(u => u.role === 'USER').length}
								</p>
							</div>
						</div>
					</div>

					<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
						<div className="flex items-center">
							<div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
								<svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('admin.adminUsers')}</p>
								<p className="text-2xl font-semibold text-gray-900 dark:text-white">
									{users.filter(u => u.role === 'ADMIN').length}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Create User Modal */}
			{showCreateModal && (
				<CreateUserModal
					onClose={() => setShowCreateModal(false)}
					onCreateUser={handleCreateUser}
				/>
			)}
		</DashboardLayout>
	);
}
