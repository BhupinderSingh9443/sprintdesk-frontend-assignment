import {
  useMemo,
} from 'react';

import {
  DataTable,
} from '../components/ui/DataTable';

import type {
  DataTableColumn,
} from '../components/ui/DataTable';

import {
  Skeleton,
} from '../components/ui/Skeleton';

import {
  useBoardData,
} from '../features/board/useBoardData';

import {
  useBoardStore,
} from '../features/board/board.store';

import type {
  Task,
} from '../types/domain';

export default function DashboardPage() {
  const {
    data,
    isLoading,
    isError,
  } = useBoardData();

  const tasks =
    useBoardStore(
      (state) =>
        state.tasks,
    );

  const usersById =
    useMemo(
      () =>
        new Map(
          data?.users.map(
            (user) => [
              user.id,
              user,
            ],
          ) ?? [],
        ),
      [data?.users],
    );

  const recentTasks =
    useMemo(
      () =>
        [...tasks]
          .sort(
            (a, b) =>
              new Date(
                b.updatedAt,
              ).getTime() -
              new Date(
                a.updatedAt,
              ).getTime(),
          )
          .slice(0, 8),
      [tasks],
    );

  const columns:
    DataTableColumn<Task>[] =
    [
      {
        id: 'task',
        header: 'Task',
        cell: (task) =>
          task.title,
      },

      {
        id: 'status',
        header: 'Status',
        cell: (task) =>
          task.status,
      },

      {
        id: 'priority',
        header: 'Priority',
        cell: (task) =>
          task.priority,
      },

      {
        id: 'assignee',
        header: 'Assignee',
        cell: (task) =>
          usersById.get(
            task.assigneeId,
          )?.name ??
          'Unassigned',
      },

      {
        id: 'due',
        header: 'Due date',
        cell: (task) =>
          new Intl
            .DateTimeFormat(
              'en-AU',
              {
                day:
                  'numeric',
                month:
                  'short',
                year:
                  'numeric',
              },
            )
            .format(
              new Date(
                task.dueDate,
              ),
            ),
      },
    ];

  return (
    <section>
      <header>
        <h2
          className="
            text-2xl
            font-semibold
            text-slate-900
            dark:text-white
          "
        >
          Sprint overview
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-slate-600
            dark:text-slate-400
          "
        >
          Recently updated sprint tasks.
        </p>
      </header>

      <div className="mt-6">
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {isError && (
          <p
            role="alert"
            className="
              text-sm
              text-red-600
            "
          >
            Unable to load dashboard data.
          </p>
        )}

        {!isLoading &&
          !isError && (
          <DataTable
            caption="Recently updated sprint tasks"
            columns={
              columns
            }
            rows={
              recentTasks
            }
            getRowKey={(
              task,
            ) =>
              task.id
            }
          />
        )}
      </div>
    </section>
  );
}