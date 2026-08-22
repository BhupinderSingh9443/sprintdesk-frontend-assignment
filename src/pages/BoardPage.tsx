import {
  FullScreenLoader,
} from '../components/ui/FullScreenLoader';

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
    return <FullScreenLoader />;
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

        <button
          type="button"
          onClick={() => {
            void refetch();
          }}
          className="
            mt-4
            rounded-lg
            bg-blue-600
            px-4
            py-2
            text-sm
            font-medium
            text-white
            hover:bg-blue-700
          "
        >
          Try again
        </button>
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

        <button
          type="button"
          onClick={() =>
            setCreateTaskOpen(true)
          }
          className="
      rounded-lg
      bg-blue-600
      px-4
      py-2
      text-sm
      font-medium
      text-white
      hover:bg-blue-700
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
    "
        >
          + New task
        </button>
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