import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ChartCard,
} from './ChartCard';

import type {
  PriorityData,
} from './analytics.utils';

interface Props {
  data: PriorityData[];
}

export function PriorityBreakdownChart({
  data,
}: Props) {
  return (
    <ChartCard
      title="Priority Breakdown"
      description="Task priorities across board columns."
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart data={data}>
          <CartesianGrid
            stroke="var(--chart-grid)"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="priority"
            stroke="var(--chart-text)"
            fontSize={12}
          />

          <YAxis
            allowDecimals={false}
            stroke="var(--chart-text)"
            fontSize={12}
          />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="backlog"
            name="Backlog"
            stackId="status"
            fill="var(--chart-1)"
          />

          <Bar
            dataKey="inProgress"
            name="In Progress"
            stackId="status"
            fill="var(--chart-2)"
          />

          <Bar
            dataKey="review"
            name="Review"
            stackId="status"
            fill="var(--chart-3)"
          />

          <Bar
            dataKey="done"
            name="Done"
            stackId="status"
            fill="var(--chart-4)"
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}