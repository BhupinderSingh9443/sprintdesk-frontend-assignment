import {
  useMemo,
} from 'react';

import {
  BOARD_COLUMNS,
} from './board.constants';

import {
  useBoardStore,
} from './board.store';

import {
  BoardColumn,
} from './BoardColumn';

import type {
  User,
} from '../../types/domain';

interface SprintBoardProps {
  users: User[];
}

export function SprintBoard({
  users,
}: SprintBoardProps) {
  const tasks = useBoardStore(
    (state) => state.tasks,
  );

  const usersById = useMemo(
    () =>
      new Map(
        users.map((user) => [
          user.id,
          user,
        ]),
      ),
    [users],
  );

  return (
    <div
      className="
        overflow-x-auto
        pb-4
      "
    >
      <div
        className="
          grid
          min-w-[1180px]
          grid-cols-4
          gap-4
        "
      >
        {BOARD_COLUMNS.map(
          (column) => {
            const columnTasks =
              tasks.filter(
                (task) =>
                  task.status ===
                  column.id,
              );

            return (
              <BoardColumn
                key={column.id}
                title={column.title}
                status={column.id}
                tasks={columnTasks}
                usersById={usersById}
              />
            );
          },
        )}
      </div>
    </div>
  );
}