import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import {
  ChartCard,
} from './ChartCard';

import type {
  TaskStatusData,
} from './analytics.utils';

interface Props {
  data: TaskStatusData[];
}

const STATUS_COLOURS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
];

export function TaskStatusChart({
  data,
}: Props) {
  return (
    <ChartCard
      title="Task Status"
      description="Distribution across board columns."
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
            isAnimationActive
          >
            {data.map(
              (entry, index) => (
                <Cell
                  key={entry.status}
                  fill={
                    STATUS_COLOURS[
                      index %
                        STATUS_COLOURS.length
                    ]
                  }
                />
              ),
            )}
          </Pie>

          <Tooltip />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}