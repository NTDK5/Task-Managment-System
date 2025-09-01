'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../../store/userStore';

interface UserManagementTableProps {
	users: User[];
	onDeleteUser: (userId: string) => void;
	onUpdateUserRole: (userId: string, role: 'USER' | 'ADMIN') => void;
	currentUserId: string;
}

export default function UserManagementTable({
	users,
	onDeleteUser,
	onUpdateUserRole,
	currentUserId
}: UserManagementTableProps) {
	const { t } = useTranslation('common');
	const [editingUser, setEditingUser] = useState<string | null>(null);

	const handleRoleChange = (userId: string, newRole: 'USER' | 'ADMIN') => {
		onUpdateUserRole(userId, newRole);
		setEditingUser(null);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString();
	};

	const getRoleBadgeColor = (role: string) => {
		return role === 'ADMIN' 
			? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700'
			: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700';
	};

	if (users.length === 0) {
		return (
			<div className="p-8 text-center">
				<svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
				</svg>
				<h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{t('admin.noUsers')}</h3>
				<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('admin.noUsersDescription')}</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
				<thead className="bg-gray-50 dark:bg-gray-800">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
							{t('admin.user')}
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
							{t('admin.role')}
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
							{t('admin.createdAt')}
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
							{t('admin.lastUpdated')}
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
							{t('admin.actions')}
						</th>
					</tr>
				</thead>
				<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
					{users.map((user) => (
						<tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
							<td className="px-6 py-4 whitespace-nowrap">
								<div className="flex items-center">
									<div className="flex-shrink-0 h-10 w-10">
										<div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
											<span className="text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
												{user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
											</span>
										</div>
									</div>
									<div className="ml-4">
										<div className="text-sm font-medium text-gray-900 dark:text-white">
											{user.name || t('admin.noName')}
										</div>
										<div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
									</div>
								</div>
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								{editingUser === user.id ? (
									<select
										value={user.role}
										onChange={(e) => handleRoleChange(user.id, e.target.value as 'USER' | 'ADMIN')}
										className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
									>
										<option value="USER">{t('admin.userRole')}</option>
										<option value="ADMIN">{t('admin.adminRole')}</option>
									</select>
								) : (
									<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeColor(user.role)}`}>
										{user.role}
									</span>
								)}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
								{formatDate(user.createdAt)}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
								{formatDate(user.updatedAt)}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
								<div className="flex space-x-2">
									{editingUser === user.id ? (
										<>
											<button
												onClick={() => handleRoleChange(user.id, user.role)}
												className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
											>
												{t('admin.save')}
											</button>
											<button
												onClick={() => setEditingUser(null)}
												className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
											>
												{t('admin.cancel')}
											</button>
										</>
									) : (
										<>
											<button
												onClick={() => setEditingUser(user.id)}
												className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
											>
												{t('admin.edit')}
											</button>
											{user.id !== currentUserId && (
												<button
													onClick={() => onDeleteUser(user.id)}
													className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
												>
													{t('admin.delete')}
												</button>
											)}
										</>
									)}
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
