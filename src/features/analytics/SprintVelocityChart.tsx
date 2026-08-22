import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ChartCard,
} from './ChartCard';

import type {
  SprintVelocityData,
} from './analytics.utils';

interface Props {
  data: SprintVelocityData[];
}

export function SprintVelocityChart({
  data,
}: Props) {
  return (
    <ChartCard
      title="Sprint Velocity"
      description="Completed tasks per sprint."
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
            dataKey="sprint"
            stroke="var(--chart-text)"
            fontSize={12}
          />

          <YAxis
            allowDecimals={false}
            stroke="var(--chart-text)"
            fontSize={12}
          />

          <Tooltip />

          <Bar
            dataKey="completed"
            fill="var(--chart-1)"
            radius={[6, 6, 0, 0]}
            isAnimationActive
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}