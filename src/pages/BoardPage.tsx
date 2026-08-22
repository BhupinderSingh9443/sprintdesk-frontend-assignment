import {
  FullScreenLoader,
} from '../components/ui/FullScreenLoader';

import {
  SprintBoard,
} from '../features/board/SprintBoard';

import {
  useBoardData,
} from '../features/board/useBoardData';

export default function BoardPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useBoardData();

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

  return (
    <section>
      <div
        className="
          mb-6
          flex
          items-end
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
      </div>

      <SprintBoard
        users={data.users}
      />
    </section>
  );
}