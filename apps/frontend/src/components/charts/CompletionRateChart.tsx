'use client';

import { PieChart } from '@mui/x-charts/PieChart';
import { UserTaskData } from '../../store/reportStore';

interface CompletionRateChartProps {
	data: UserTaskData[];
}

const CompletionRateChart: React.FC<CompletionRateChartProps> = ({ data }) => {
	const chartData = data.map(user => ({
		id: user.userId,
		value: user.completionRate,
		label: user.userName,
		color: user.completionRate >= 80 ? '#4ade80' : user.completionRate >= 60 ? '#fbbf24' : '#f87171'
	}));

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h3 className="text-lg font-semibold mb-4 text-gray-800">User Completion Rates</h3>
			<div className="h-64">
				<PieChart
					series={[
						{
							data: chartData,
							highlightScope: { faded: 'global', highlighted: 'item' },
							faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
						},
					]}
					height={250}
				/>
			</div>
			<div className="mt-4 grid grid-cols-3 gap-4 text-sm">
				<div className="text-center">
					<div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-1"></div>
					<span className="text-gray-600">High (≥80%)</span>
				</div>
				<div className="text-center">
					<div className="w-3 h-3 bg-yellow-400 rounded-full mx-auto mb-1"></div>
					<span className="text-gray-600">Medium (60-79%)</span>
				</div>
				<div className="text-center">
					<div className="w-3 h-3 bg-red-400 rounded-full mx-auto mb-1"></div>
					<span className="text-gray-600">Low (&lt;60%)</span>
				</div>
			</div>
		</div>
	);
};

export default CompletionRateChart;
