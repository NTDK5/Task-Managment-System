'use client';

import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

interface DashboardLayoutProps {
	children: React.ReactNode;
	title?: string;
	showHeader?: boolean;
}

export default function DashboardLayout({ children, title = 'Dashboard', showHeader = true }: DashboardLayoutProps) {
	const { t } = useTranslation('common');
	const { data: session } = useSession();

	if (!session) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
					<p className="mt-4 text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
				</div>
			</div>
		);
	}

	const user = (session as any).user;
	const displayTitle = title === 'Dashboard' ? t('dashboard.title') : title;

	return (
		<div className="flex h-screen bg-gray-50 dark:bg-gray-900">
			<Sidebar />
			<div className="flex-1 flex flex-col overflow-hidden">
				{showHeader && (
					<header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{displayTitle}</h1>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									{t('common.welcomeBack')}, {user?.name || user?.email}
								</p>
							</div>
							<div className="flex items-center space-x-4">
								<ThemeToggle />
								<LanguageSwitcher />
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
										<span className="text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
											{user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
										</span>
									</div>
									<div className="text-right">
										<p className="text-sm font-medium text-gray-900 dark:text-white">
											{user?.name || t('common.user')}
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{user?.role || t('common.user')}
										</p>
									</div>
								</div>
							</div>
						</div>
					</header>
				)}
				<main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
					{children}
				</main>
			</div>
		</div>
	);
}
