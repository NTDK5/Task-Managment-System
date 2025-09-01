'use client';

import DashboardLayout from '../../components/DashboardLayout';
import { useTranslation } from 'react-i18next';

export default function TeamPage() {
	const { t } = useTranslation('common');

	return (
		<DashboardLayout title="Team Management">
			<div className="space-y-6">
				{/* Welcome Message */}
				<div className="bg-white rounded-lg shadow-sm p-6">
					<h2 className="text-xl font-semibold text-gray-800 mb-2">Team Overview</h2>
					<p className="text-gray-600">
						Manage your team members, roles, and collaboration settings.
					</p>
				</div>

				{/* Team Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<div className="flex items-center">
							<div className="p-2 bg-blue-100 rounded-lg">
								<span className="text-2xl">👥</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Total Members</p>
								<p className="text-2xl font-semibold text-gray-900">5</p>
							</div>
						</div>
					</div>
					
					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<div className="flex items-center">
							<div className="p-2 bg-green-100 rounded-lg">
								<span className="text-2xl">✅</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Active Members</p>
								<p className="text-2xl font-semibold text-gray-900">5</p>
							</div>
						</div>
					</div>
					
					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<div className="flex items-center">
							<div className="p-2 bg-purple-100 rounded-lg">
								<span className="text-2xl">🎭</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Roles</p>
								<p className="text-2xl font-semibold text-gray-900">3</p>
							</div>
						</div>
					</div>
				</div>

				{/* Team Members List */}
				<div className="bg-white rounded-lg shadow-sm overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200">
						<h3 className="text-lg font-semibold text-gray-800">Team Members</h3>
					</div>
					<div className="divide-y divide-gray-200">
						<div className="px-6 py-4 flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
									<span className="text-indigo-600 font-semibold">J</span>
								</div>
								<div>
									<p className="font-medium text-gray-900">John Doe</p>
									<p className="text-sm text-gray-500">john@example.com</p>
								</div>
							</div>
							<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
								Admin
							</span>
						</div>
						
						<div className="px-6 py-4 flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
									<span className="text-green-600 font-semibold">J</span>
								</div>
								<div>
									<p className="font-medium text-gray-900">Jane Smith</p>
									<p className="text-sm text-gray-500">jane@example.com</p>
								</div>
							</div>
							<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
								Member
							</span>
						</div>
						
						<div className="px-6 py-4 flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
									<span className="text-yellow-600 font-semibold">B</span>
								</div>
								<div>
									<p className="font-medium text-gray-900">Bob Johnson</p>
									<p className="text-sm text-gray-500">bob@example.com</p>
								</div>
							</div>
							<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
								Member
							</span>
						</div>
					</div>
				</div>

				{/* Coming Soon */}
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<span className="text-2xl">🚀</span>
						</div>
						<div className="ml-3">
							<h3 className="text-sm font-medium text-blue-800">More Features Coming Soon</h3>
							<div className="mt-2 text-sm text-blue-700">
								<p>Team management features are under development. Stay tuned for:</p>
								<ul className="mt-1 list-disc list-inside">
									<li>Role-based permissions</li>
									<li>Team collaboration tools</li>
									<li>Performance metrics</li>
									<li>Communication channels</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
