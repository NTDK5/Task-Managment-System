'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserTaskData } from '../../store/reportStore';

interface UserTaskChartProps {
	data: UserTaskData[];
}

const UserTaskChart: React.FC<UserTaskChartProps> = ({ data }) => {
	const chartData = data.map(user => ({
		name: user.userName,
		'Total Tasks': user.totalTasks,
		'Pending': user.pendingTasks,
		'In Progress': user.inProgressTasks,
		'Completed': user.completedTasks,
		'Completion Rate': user.completionRate
	}));

	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
					<p className="font-semibold">{label}</p>
					{payload.map((entry: any, index: number) => (
						<p key={index} style={{ color: entry.color }}>
							{entry.name}: {entry.value}
							{entry.name === 'Completion Rate' ? '%' : ''}
						</p>
					))}
				</div>
			);
		}
		return null;
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h3 className="text-lg font-semibold mb-4 text-gray-800">Task Statistics by User</h3>
			<div className="h-80">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis />
						<Tooltip content={<CustomTooltip />} />
						<Legend />
						<Bar dataKey="Total Tasks" fill="#8884d8" />
						<Bar dataKey="Pending" fill="#ffc658" />
						<Bar dataKey="In Progress" fill="#82ca9d" />
						<Bar dataKey="Completed" fill="#ff7300" />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default UserTaskChart;
