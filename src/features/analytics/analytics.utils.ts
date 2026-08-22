import type {
  Sprint,
  Task,
  TaskPriority,
  TaskStatus,
} from '../../types/domain';

export interface SprintVelocityData {
  sprint: string;
  completed: number;
}

export interface TaskStatusData {
  status: string;
  count: number;
}

export interface PriorityData {
  priority: string;
  backlog: number;
  inProgress: number;
  review: number;
  done: number;
}

export interface CompletionTrendData {
  date: string;
  completed: number;
}

const STATUS_LABELS: Record<
  TaskStatus,
  string
> = {
  backlog: 'Backlog',
  'in-progress': 'In Progress',
  review: 'Review',
  done: 'Done',
};

const PRIORITIES: TaskPriority[] = [
  'high',
  'medium',
  'low',
];

export function getSprintVelocityData(
  tasks: Task[],
  sprints: Sprint[],
): SprintVelocityData[] {
  return sprints.map((sprint) => ({
    sprint: sprint.name,

    completed: tasks.filter(
      (task) =>
        task.sprintId === sprint.id &&
        task.completedAt !== null,
    ).length,
  }));
}

export function getTaskStatusData(
  tasks: Task[],
): TaskStatusData[] {
  const statuses: TaskStatus[] = [
    'backlog',
    'in-progress',
    'review',
    'done',
  ];

  return statuses.map((status) => ({
    status: STATUS_LABELS[status],

    count: tasks.filter(
      (task) =>
        task.status === status,
    ).length,
  }));
}

export function getPriorityBreakdownData(
  tasks: Task[],
): PriorityData[] {
  return PRIORITIES.map(
    (priority) => ({
      priority:
        priority.charAt(0).toUpperCase() +
        priority.slice(1),

      backlog: countTasks(
        tasks,
        priority,
        'backlog',
      ),

      inProgress: countTasks(
        tasks,
        priority,
        'in-progress',
      ),

      review: countTasks(
        tasks,
        priority,
        'review',
      ),

      done: countTasks(
        tasks,
        priority,
        'done',
      ),
    }),
  );
}

function countTasks(
  tasks: Task[],
  priority: TaskPriority,
  status: TaskStatus,
): number {
  return tasks.filter(
    (task) =>
      task.priority === priority &&
      task.status === status,
  ).length;
}

export function getCompletionTrendData(
  tasks: Task[],
): CompletionTrendData[] {
  const grouped =
    new Map<string, number>();

  tasks.forEach((task) => {
    if (!task.completedAt) {
      return;
    }

    const date =
      task.completedAt.split('T')[0];

    if (!date) {
      return;
    }

    grouped.set(
      date,
      (grouped.get(date) ?? 0) + 1,
    );
  });

  let cumulative = 0;

  return [...grouped.entries()]
    .sort(([dateA], [dateB]) =>
      dateA.localeCompare(dateB),
    )
    .map(([date, count]) => {
      cumulative += count;

      return {
        date: new Intl.DateTimeFormat(
          'en-AU',
          {
            day: 'numeric',
            month: 'short',
          },
        ).format(
          new Date(
            `${date}T00:00:00`,
          ),
        ),

        completed: cumulative,
      };
    });
}