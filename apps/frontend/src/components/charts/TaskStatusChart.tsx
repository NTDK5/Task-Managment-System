'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TaskStatusData } from '../../store/reportStore';
import { useTranslation } from 'react-i18next';

interface TaskStatusChartProps {
	data: TaskStatusData[];
}

interface TooltipProps {
	active?: boolean;
	payload?: Array<{
		payload: {
			status: string;
			count: number;
			percentage: number;
		};
	}>;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

const TaskStatusChart: React.FC<TaskStatusChartProps> = ({ data }) => {
	const { t } = useTranslation('common');
	
	const formatStatus = (status: string): string => {
		// Ensure status is a string before calling replace
		if (typeof status !== 'string') {
			return t('common.unknown');
		}
		return t(`status.${status}`);
	};

	const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
					<p className="font-semibold">{formatStatus(data.status)}</p>
					<p className="text-gray-600">{t('common.count')}: {data.count}</p>
					<p className="text-gray-600">{t('common.percentage')}: {data.percentage}%</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h3 className="text-lg font-semibold mb-4 text-gray-800">{t('reports.taskDistribution')}</h3>
			<div className="h-64">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							labelLine={false}
							label={({ status, percentage }) => `${formatStatus(status)} ${percentage}%`}
							outerRadius={80}
							fill="#8884d8"
							dataKey="count"
							nameKey="status"
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip content={<CustomTooltip />} />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default TaskStatusChart;
