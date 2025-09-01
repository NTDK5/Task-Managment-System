'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MonthlyTaskData } from '../../store/reportStore';

interface MonthlyTrendChartProps {
	data: MonthlyTaskData[];
}

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data }) => {
	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
					<p className="font-semibold">{label}</p>
					{payload.map((entry: any, index: number) => (
						<p key={index} style={{ color: entry.color }}>
							{entry.name}: {entry.value}
						</p>
					))}
				</div>
			);
		}
		return null;
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Task Trends</h3>
			<div className="h-80">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="month" />
						<YAxis />
						<Tooltip content={<CustomTooltip />} />
						<Legend />
						<Line 
							type="monotone" 
							dataKey="totalTasks" 
							stroke="#8884d8" 
							strokeWidth={2}
							name="Total Tasks"
						/>
						<Line 
							type="monotone" 
							dataKey="completedTasks" 
							stroke="#82ca9d" 
							strokeWidth={2}
							name="Completed Tasks"
						/>
						<Line 
							type="monotone" 
							dataKey="pendingTasks" 
							stroke="#ffc658" 
							strokeWidth={2}
							name="Pending Tasks"
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default MonthlyTrendChart;
