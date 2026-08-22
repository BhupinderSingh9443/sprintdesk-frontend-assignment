import {
  useMemo,
} from 'react';

import type {
  Sprint,
} from '../../types/domain';

import {
  useBoardStore,
} from '../board/board.store';

import {
  getCompletionTrendData,
  getPriorityBreakdownData,
  getSprintVelocityData,
  getTaskStatusData,
} from './analytics.utils';

import {
  SprintVelocityChart,
} from './SprintVelocityChart';

import {
  TaskStatusChart,
} from './TaskStatusChart';

import {
  PriorityBreakdownChart,
} from './PriorityBreakdownChart';

import {
  CompletionTrendChart,
} from './CompletionTrendChart';

interface Props {
  sprints: Sprint[];
}

export function AnalyticsDashboard({
  sprints,
}: Props) {
  const tasks =
    useBoardStore(
      (state) => state.tasks,
    );

  const sprintVelocity =
    useMemo(
      () =>
        getSprintVelocityData(
          tasks,
          sprints,
        ),
      [
        tasks,
        sprints,
      ],
    );

  const taskStatus =
    useMemo(
      () =>
        getTaskStatusData(
          tasks,
        ),
      [tasks],
    );

  const priorityBreakdown =
    useMemo(
      () =>
        getPriorityBreakdownData(
          tasks,
        ),
      [tasks],
    );

  const completionTrend =
    useMemo(
      () =>
        getCompletionTrendData(
          tasks,
        ),
      [tasks],
    );

  return (
    <div
      className="
        grid
        min-w-0
        gap-6
        xl:grid-cols-2
      "
    >
      <SprintVelocityChart
        data={sprintVelocity}
      />

      <TaskStatusChart
        data={taskStatus}
      />

      <PriorityBreakdownChart
        data={priorityBreakdown}
      />

      <CompletionTrendChart
        data={completionTrend}
      />
    </div>
  );
}