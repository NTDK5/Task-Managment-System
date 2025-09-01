'use client';

import DashboardLayout from '../../components/DashboardLayout';
import { useTranslation } from 'react-i18next';

export default function SettingsPage() {
	const { t } = useTranslation('common');

	return (
		<DashboardLayout title="Settings">
			<div className="space-y-6">
				{/* Welcome Message */}
				<div className="bg-white rounded-lg shadow-sm p-6">
					<h2 className="text-xl font-semibold text-gray-800 mb-2">Account Settings</h2>
					<p className="text-gray-600">
						Manage your profile, preferences, and account settings.
					</p>
				</div>

				{/* Settings Sections */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Profile Settings */}
					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">👤 Profile</h3>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Full Name
								</label>
								<input
									type="text"
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
									placeholder="Enter your full name"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Email
								</label>
								<input
									type="email"
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
									placeholder="Enter your email"
								/>
							</div>
							<button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
								Update Profile
							</button>
						</div>
					</div>

					{/* Preferences */}
					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">🎨 Preferences</h3>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Language
								</label>
								<select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
									<option value="en">English</option>
									<option value="am">Amharic</option>
									<option value="om">Afan Oromo</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Theme
								</label>
								<select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
									<option value="light">Light</option>
									<option value="dark">Dark</option>
									<option value="auto">Auto</option>
								</select>
							</div>
							<button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
								Save Preferences
							</button>
						</div>
					</div>

					{/* Notifications */}
					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">🔔 Notifications</h3>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-700">Email Notifications</span>
								<label className="relative inline-flex items-center cursor-pointer">
									<input type="checkbox" className="sr-only peer" defaultChecked />
									<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
								</label>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-700">Task Reminders</span>
								<label className="relative inline-flex items-center cursor-pointer">
									<input type="checkbox" className="sr-only peer" defaultChecked />
									<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
								</label>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-700">Weekly Reports</span>
								<label className="relative inline-flex items-center cursor-pointer">
									<input type="checkbox" className="sr-only peer" />
									<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
								</label>
							</div>
						</div>
					</div>

					{/* Security */}
					<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">🔒 Security</h3>
						<div className="space-y-4">
							<button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors">
								Change Password
							</button>
							<button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
								Enable 2FA
							</button>
							<button className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors">
								View Login History
							</button>
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
							<h3 className="text-sm font-medium text-blue-800">More Settings Coming Soon</h3>
							<div className="mt-2 text-sm text-blue-700">
								<p>Additional settings features are under development:</p>
								<ul className="mt-1 list-disc list-inside">
									<li>Advanced privacy controls</li>
									<li>Data export/import</li>
									<li>API key management</li>
									<li>Integration settings</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
