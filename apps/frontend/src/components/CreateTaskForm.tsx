'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTaskStore } from '../store/taskStore';
import { useSession } from 'next-auth/react';
import { useUserStore } from '../store/userStore';

export default function CreateTaskForm() {
	const { t } = useTranslation('common');
	const { createTask } = useTaskStore();
	const { data: session } = useSession();
	const { users, fetchUsers } = useUserStore();
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		dueDate: '',
		assignedTo: ''
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		const isAdmin = (session as any)?.user?.role === 'ADMIN';
		const token = (session as any)?.accessToken as string | undefined;
		if (isAdmin && token) {
			fetchUsers(token);
		}
	}, [session, fetchUsers]);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.title.trim()) {
			newErrors.title = t('tasks.titleRequired');
		}

		if (!formData.description.trim()) {
			newErrors.description = t('tasks.descriptionRequired');
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validateForm()) return;

		setLoading(true);
		try {
			await createTask({
				...formData,
				status: 'PENDING',
				ownerId: (session as any)?.user?.id
			}, (session as any)?.accessToken);
			
			// Reset form
			setFormData({
				title: '',
				description: '',
				dueDate: '',
				assignedTo: ''
			});
			setErrors({});
		} catch (error) {
			console.error('Failed to create task:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: '' }));
		}
	};

	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
						{t('tasks.createNewTask')}
					</h2>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
						{t('tasks.createDescription')}
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Title Field */}
					<div className="md:col-span-2">
						<label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							{t('tasks.title')} *
						</label>
						<input
							type="text"
							id="title"
							value={formData.title}
							onChange={(e) => handleInputChange('title', e.target.value)}
							className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors ${
								errors.title 
									? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20' 
									: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
							}`}
							placeholder={t('tasks.titlePlaceholder')}
						/>
						{errors.title && (
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
						)}
					</div>

					{/* Description Field */}
					<div className="md:col-span-2">
						<label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							{t('tasks.description')} *
						</label>
						<textarea
							id="description"
							rows={4}
							value={formData.description}
							onChange={(e) => handleInputChange('description', e.target.value)}
							className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors resize-none ${
								errors.description 
									? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20' 
									: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
							}`}
							placeholder={t('tasks.descriptionPlaceholder')}
						/>
						{errors.description && (
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
						)}
					</div>

					{/* Due Date Field */}
					<div>
						<label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							{t('tasks.dueDate')}
						</label>
						<input
							type="date"
							id="dueDate"
							value={formData.dueDate}
							onChange={(e) => handleInputChange('dueDate', e.target.value)}
							className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
						/>
					</div>

					{/* Assigned To Field */}
					<div>
						<label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							{t('tasks.assignTo')}
						</label>
						{(session as any)?.user?.role === 'ADMIN' ? (
							<select
								id="assignedTo"
								value={formData.assignedTo}
								onChange={(e) => handleInputChange('assignedTo', e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
							>
								<option value="">{t('tasks.assignToPlaceholder')}</option>
								{users.map((user) => (
									<option key={user.id} value={user.id}>
										{user.name || user.email}
									</option>
								))}
							</select>
						) : (
							<input
								type="text"
								id="assignedTo"
								value={formData.assignedTo}
								onChange={(e) => handleInputChange('assignedTo', e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
								placeholder={t('tasks.assignToPlaceholder')}
							/>
						)}
					</div>
				</div>

				{/* Submit Button */}
				<div className="flex justify-end">
					<button
						type="submit"
						disabled={loading}
						className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
					>
						{loading ? (
							<div className="flex items-center space-x-2">
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
								<span>{t('tasks.creating')}</span>
							</div>
						) : (
								t('tasks.createTask')
							)}
					</button>
				</div>
			</form>
		</div>
	);
}
