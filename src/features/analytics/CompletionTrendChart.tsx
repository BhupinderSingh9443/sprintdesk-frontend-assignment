import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ChartCard,
} from './ChartCard';

import type {
  CompletionTrendData,
} from './analytics.utils';

interface Props {
  data: CompletionTrendData[];
}

export function CompletionTrendChart({
  data,
}: Props) {
  return (
    <ChartCard
      title="Completion Trend"
      description="Cumulative task completion over time."
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart data={data}>
          <CartesianGrid
            stroke="var(--chart-grid)"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="date"
            stroke="var(--chart-text)"
            fontSize={12}
          />

          <YAxis
            allowDecimals={false}
            stroke="var(--chart-text)"
            fontSize={12}
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="completed"
            name="Completed"
            stroke="var(--chart-1)"
            strokeWidth={3}
            dot={{
              r: 4,
            }}
            activeDot={{
              r: 6,
            }}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}