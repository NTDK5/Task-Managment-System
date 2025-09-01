'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../../store/userStore';

interface CreateUserModalProps {
	onClose: () => void;
	onCreateUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export default function CreateUserModal({ onClose, onCreateUser }: CreateUserModalProps) {
	const { t } = useTranslation('common');
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		role: 'USER' as 'USER' | 'ADMIN'
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = t('admin.nameRequired');
		}

		if (!formData.email.trim()) {
			newErrors.email = t('admin.emailRequired');
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = t('admin.emailInvalid');
		}

		if (!formData.password.trim()) {
			newErrors.password = t('admin.passwordRequired');
		} else if (formData.password.length < 6) {
			newErrors.password = t('admin.passwordTooShort');
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validateForm()) return;

		setLoading(true);
		try {
			await onCreateUser(formData);
			onClose();
		} catch (error) {
			console.error('Failed to create user:', error);
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
		<div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-opacity-70 overflow-y-auto h-full w-full z-50">
			<div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
				<div className="mt-3">
					{/* Header */}
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-medium text-gray-900 dark:text-white">
							{t('admin.createNewUser')}
						</h3>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
						>
							<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Name Field */}
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								{t('admin.name')} *
							</label>
							<input
								type="text"
								id="name"
								value={formData.name}
								onChange={(e) => handleInputChange('name', e.target.value)}
								className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ${
									errors.name 
										? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100' 
										: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
								}`}
								placeholder={t('admin.namePlaceholder')}
							/>
							{errors.name && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
							)}
						</div>

						{/* Email Field */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								{t('admin.email')} *
							</label>
							<input
								type="email"
								id="email"
								value={formData.email}
								onChange={(e) => handleInputChange('email', e.target.value)}
								className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ${
									errors.email 
										? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100' 
										: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
								}`}
								placeholder={t('admin.emailPlaceholder')}
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
							)}
						</div>

						{/* Password Field */}
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								{t('admin.password')} *
							</label>
							<input
								type="password"
								id="password"
								value={formData.password}
								onChange={(e) => handleInputChange('password', e.target.value)}
								className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ${
									errors.password 
										? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100' 
										: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
								}`}
								placeholder={t('admin.passwordPlaceholder')}
							/>
							{errors.password && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
							)}
						</div>

						{/* Role Field */}
						<div>
							<label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								{t('admin.role')}
							</label>
							<select
								id="role"
								value={formData.role}
								onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'USER' | 'ADMIN' }))}
								className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
							>
								<option value="USER">{t('admin.userRole')}</option>
								<option value="ADMIN">{t('admin.adminRole')}</option>
							</select>
						</div>

						{/* Action Buttons */}
						<div className="flex justify-end space-x-3 pt-4">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
							>
								{t('admin.cancel')}
							</button>
							<button
								type="submit"
								disabled={loading}
								className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? t('admin.creating') : t('admin.createUser')}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
