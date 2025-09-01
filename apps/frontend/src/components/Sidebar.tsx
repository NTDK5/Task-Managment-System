'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface NavItem {
	id: string;
	labelKey: string;
	icon: string;
	href: string;
	children?: NavItem[];
}

export default function Sidebar() {
	const { t } = useTranslation('common');
	const { data: session } = useSession();
	const router = useRouter();
	const pathname = usePathname();
	const [collapsed, setCollapsed] = useState(false);
	const [expandedItems, setExpandedItems] = useState<string[]>([]);

	const user = (session as any)?.user;
	const isAdmin = user?.role === 'ADMIN';

	const navItems: NavItem[] = [
		{
			id: 'dashboard',
			labelKey: 'sidebar.dashboard',
			icon: '🏠',
			href: '/'
		},
		{
			id: 'tasks',
			labelKey: 'sidebar.tasks',
			icon: '📋',
			href: '/tasks'
		},
		{
			id: 'reports',
			labelKey: 'sidebar.reports',
			icon: '📊',
			href: '/reports'
		},
		{
			id: 'team',
			labelKey: 'sidebar.team',
			icon: '👥',
			href: '/team',
			children: [
				{
					id: 'team-overview',
					labelKey: 'sidebar.teamOverview',
					icon: '👁️',
					href: '/team/overview'
				},
				{
					id: 'team-members',
					labelKey: 'sidebar.teamMembers',
					icon: '👤',
					href: '/team/members'
				},
				{
					id: 'team-roles',
					labelKey: 'sidebar.teamRoles',
					icon: '🎭',
					href: '/team/roles'
				}
			]
		},
		{
			id: 'projects',
			labelKey: 'sidebar.projects',
			icon: '🚀',
			href: '/projects',
			children: [
				{
					id: 'projects-active',
					labelKey: 'sidebar.projectsActive',
					icon: '🟢',
					href: '/projects/active'
				},
				{
					id: 'projects-completed',
					labelKey: 'sidebar.projectsCompleted',
					icon: '✅',
					href: '/projects/completed'
				},
				{
					id: 'projects-archived',
					labelKey: 'sidebar.projectsArchived',
					icon: '📦',
					href: '/projects/archived'
				}
			]
		},
		{
			id: 'calendar',
			labelKey: 'sidebar.calendar',
			icon: '📅',
			href: '/calendar'
		},
		...(isAdmin ? [{
			id: 'admin',
			labelKey: 'sidebar.admin',
			icon: '⚙️',
			href: '/admin',
			children: [
				{
					id: 'admin-users',
					labelKey: 'sidebar.adminUsers',
					icon: '👥',
					href: '/admin'
				},
				{
					id: 'admin-settings',
					labelKey: 'sidebar.adminSettings',
					icon: '🔧',
					href: '/admin/settings'
				},
				{
					id: 'admin-logs',
					labelKey: 'sidebar.adminLogs',
					icon: '📝',
					href: '/admin/logs'
				}
			]
		}] : []),
		{
			id: 'settings',
			labelKey: 'sidebar.settings',
			icon: '⚙️',
			href: '/settings',
			children: [
				{
					id: 'settings-profile',
					labelKey: 'sidebar.settingsProfile',
					icon: '👤',
					href: '/settings/profile'
				},
				{
					id: 'settings-preferences',
					labelKey: 'sidebar.settingsPreferences',
					icon: '🎨',
					href: '/settings/preferences'
				},
				{
					id: 'settings-notifications',
					labelKey: 'sidebar.settingsNotifications',
					icon: '🔔',
					href: '/settings/notifications'
				},
				{
					id: 'settings-security',
					labelKey: 'sidebar.settingsSecurity',
					icon: '🔒',
					href: '/settings/security'
				}
			]
		},
		{
			id: 'help',
			labelKey: 'sidebar.help',
			icon: '❓',
			href: '/help',
			children: [
				{
					id: 'help-docs',
					labelKey: 'sidebar.helpDocs',
					icon: '📚',
					href: '/help/docs'
				},
				{
					id: 'help-faq',
					labelKey: 'sidebar.helpFaq',
					icon: '❔',
					href: '/help/faq'
				},
				{
					id: 'help-contact',
					labelKey: 'sidebar.helpContact',
					icon: '📞',
					href: '/help/contact'
				}
			]
		}
	];

	const toggleExpanded = (itemId: string) => {
		setExpandedItems(prev => 
			prev.includes(itemId) 
				? prev.filter(id => id !== itemId)
				: [...prev, itemId]
		);
	};

	const isActive = (href: string) => {
		if (href === '/') {
			return pathname === '/';
		}
		return pathname.startsWith(href);
	};

	const handleLogout = () => {
		signOut({ callbackUrl: '/login' });
	};

	return (
		<aside className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
			collapsed ? 'w-16' : 'w-64'
		}`}>
			{/* Header */}
			<div className="p-4 border-b border-gray-200 dark:border-gray-700">
				<div className="flex items-center justify-between">
					{!collapsed && (
						<h1 className="text-xl font-bold text-gray-900 dark:text-white">
							{t('sidebar.dashboard')}
						</h1>
					)}
					<button
						onClick={() => setCollapsed(!collapsed)}
						className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
						title={collapsed ? t('sidebar.expandSidebar') : t('sidebar.collapseSidebar')}
					>
						<svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={collapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
						</svg>
					</button>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 overflow-y-auto py-4">
				<ul className="space-y-2 px-3">
					{navItems.map((item) => (
						<li key={item.id}>
							{/* Main Navigation Item */}
							<div className="relative">
								<button
									onClick={() => {
										if (item.children) {
											toggleExpanded(item.id);
										} else {
											router.push(item.href);
										}
									}}
									className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
										isActive(item.href)
											? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
											: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
									}`}
								>
									<span className="text-lg mr-3">{item.icon}</span>
									{!collapsed && (
										<>
											<span className="flex-1 text-left">{t(item.labelKey)}</span>
											{item.children && (
												<svg
													className={`w-4 h-4 transition-transform ${
														expandedItems.includes(item.id) ? 'rotate-180' : ''
													}`}
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
												</svg>
											)}
										</>
									)}
								</button>

								{/* Sub-navigation */}
								{item.children && expandedItems.includes(item.id) && !collapsed && (
									<ul className="mt-2 ml-6 space-y-1">
										{item.children.map((child) => (
											<li key={child.id}>
												<button
													onClick={() => router.push(child.href)}
													className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
														isActive(child.href)
															? 'bg-indigo-50 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-400'
															: 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
													}`}
												>
													<span className="text-sm mr-2">{child.icon}</span>
													<span>{t(child.labelKey)}</span>
												</button>
											</li>
										))}
									</ul>
								)}
							</div>
						</li>
					))}
				</ul>
			</nav>

			{/* User Info & Logout */}
			<div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 w-64">
				{!collapsed && (
					<div className="flex items-center space-x-3 mb-3">
						<div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
							<span className="text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
								{user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
							</span>
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-gray-900 dark:text-white truncate">
								{user?.name || user?.email}
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{user?.role || t('common.user')}
							</p>
						</div>
					</div>
				)}
				<button
					onClick={handleLogout}
					className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
					title={t('sidebar.logout')}
				>
					<span className="text-lg mr-3">🚪</span>
					{!collapsed && <span>{t('sidebar.logout')}</span>}
				</button>
			</div>
		</aside>
	);
}
