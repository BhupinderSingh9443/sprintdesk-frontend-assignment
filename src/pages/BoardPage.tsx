

import {
  SprintBoard,
} from '../features/board/SprintBoard';

import {
  useBoardData,
} from '../features/board/useBoardData';

import {
  useState,
} from 'react';

import {
  TaskCreateModal,
} from '../features/board/TaskCreateModal';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/PageLoader';

export default function BoardPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useBoardData();

  const [
    createTaskOpen,
    setCreateTaskOpen,
  ] = useState(false);



  if (isLoading) {
    return <PageLoader />;
  }

  if (
    isError ||
    !data
  ) {
    return (
      <section>
        <h2
          className="
            text-xl
            font-semibold
            text-slate-900
            dark:text-white
          "
        >
          Unable to load board
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-slate-600
            dark:text-slate-400
          "
        >
          SprintDesk could not load
          the sprint data.
        </p>

        <Button
          className="mt-4"
          onClick={() => {
            void refetch();
          }}
        >
          Try again
        </Button>
      </section>
    );
  }

  const now = new Date();

  const activeSprint =
    data.sprints.find(
      (sprint) => {
        const start =
          new Date(
            `${sprint.startDate}T00:00:00`,
          );

        const end =
          new Date(
            `${sprint.endDate}T23:59:59`,
          );

        return (
          now >= start &&
          now <= end
        );
      },
    ) ??
    data.sprints[
    data.sprints.length - 1
    ];

  return (
    <section>
      <div
        className="
    mb-6
    flex
    items-center
    justify-between
    gap-4
  "
      >
        <div>
          <h2
            className="
        text-2xl
        font-semibold
        text-slate-900
        dark:text-white
      "
          >
            Sprint Board
          </h2>

          <p
            className="
        mt-1
        text-sm
        text-slate-600
        dark:text-slate-400
      "
          >
            Manage the current sprint tasks.
          </p>
        </div>

        <Button
          onClick={() =>
            setCreateTaskOpen(true)
          }
        >
          + New task
        </Button>
      </div>

      <SprintBoard
        users={data.users}
      />

      {activeSprint && (
        <TaskCreateModal
          open={createTaskOpen}
          users={data.users}
          sprintId={
            activeSprint.id
          }
          onClose={() =>
            setCreateTaskOpen(false)
          }
        />
      )}
    </section>
  );
}