import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type {
  Comment,
  Task,
  TaskStatus,
} from '../../types/domain';

interface BoardState {
  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  tasks: Task[];

  comments: Comment[];

  hasInitialized: boolean;

  commentsInitialized: boolean;

  /*
  |--------------------------------------------------------------------------
  | Initialisation
  |--------------------------------------------------------------------------
  */

  initializeTasks: (
    tasks: Task[],
  ) => void;

  initializeComments: (
    comments: Comment[],
  ) => void;

  /*
  |--------------------------------------------------------------------------
  | Task actions
  |--------------------------------------------------------------------------
  */

  addTask: (
    task: Task,
  ) => void;

  updateTask: (
    taskId: number,
    updates: Partial<Task>,
  ) => void;

  deleteTask: (
    taskId: number,
  ) => void;

  moveTask: (
    taskId: number,
    targetStatus: TaskStatus,
    targetIndex: number,
  ) => void;

  /*
  |--------------------------------------------------------------------------
  | Comment actions
  |--------------------------------------------------------------------------
  */

  addComment: (
    taskId: number,
    authorId: number,
    message: string,
  ) => void;

  /*
  |--------------------------------------------------------------------------
  | Reset
  |--------------------------------------------------------------------------
  */

  resetBoard: () => void;
}

export const useBoardStore =
  create<BoardState>()(
    persist(
      (set, get) => ({
        /*
        |--------------------------------------------------------------------------
        | Initial state
        |--------------------------------------------------------------------------
        */

        tasks: [],

        comments: [],

        hasInitialized: false,

        commentsInitialized: false,

        /*
        |--------------------------------------------------------------------------
        | Initialise tasks
        |--------------------------------------------------------------------------
        |
        | The initial task data comes from mock-data.json.
        |
        | We initialise only once because after that the Zustand store becomes
        | the interactive source of truth for the Kanban board.
        |
        */

        initializeTasks: (
          tasks,
        ) => {
          if (
            get().hasInitialized
          ) {
            return;
          }

          set({
            tasks,
            hasInitialized: true,
          });
        },

        /*
        |--------------------------------------------------------------------------
        | Initialise comments
        |--------------------------------------------------------------------------
        */

        initializeComments: (
          comments,
        ) => {
          if (
            get()
              .commentsInitialized
          ) {
            return;
          }

          set({
            comments,
            commentsInitialized:
              true,
          });
        },

        /*
        |--------------------------------------------------------------------------
        | Add task
        |--------------------------------------------------------------------------
        */

        addTask: (
          task,
        ) => {
          set(
            (state) => ({
              tasks: [
                ...state.tasks,
                task,
              ],
            }),
          );
        },

        /*
        |--------------------------------------------------------------------------
        | Update task
        |--------------------------------------------------------------------------
        */

        updateTask: (
          taskId,
          updates,
        ) => {
          set(
            (state) => ({
              tasks:
                state.tasks.map(
                  (task) =>
                    task.id ===
                      taskId
                      ? {
                        ...task,
                        ...updates,
                      }
                      : task,
                ),
            }),
          );
        },

        /*
        |--------------------------------------------------------------------------
        | Delete task
        |--------------------------------------------------------------------------
        |
        | We also remove comments belonging to the deleted task so that
        | orphaned comment data is not left behind.
        |
        */

        deleteTask: (taskId) => {
          set((state) => {
            const taskToDelete =
              state.tasks.find(
                (task) => task.id === taskId,
              );

            if (!taskToDelete) {
              return state;
            }

            const remainingTasks =
              state.tasks.filter(
                (task) => task.id !== taskId,
              );

            const normalizedTasks =
              remainingTasks.map((task) => {
                if (
                  task.status !==
                  taskToDelete.status
                ) {
                  return task;
                }

                const columnTasks =
                  remainingTasks
                    .filter(
                      (columnTask) =>
                        columnTask.status ===
                        task.status,
                    )
                    .sort(
                      (a, b) =>
                        a.order - b.order,
                    );

                const newOrder =
                  columnTasks.findIndex(
                    (columnTask) =>
                      columnTask.id === task.id,
                  ) + 1;

                return {
                  ...task,
                  order: newOrder,
                };
              });

            return {
              tasks: normalizedTasks,

              comments:
                state.comments.filter(
                  (comment) =>
                    comment.taskId !== taskId,
                ),
            };
          });
        },

        /*
        |--------------------------------------------------------------------------
        | Move / reorder task
        |--------------------------------------------------------------------------
        |
        | Supports:
        |
        | 1. Reordering inside the same column
        | 2. Moving between different columns
        | 3. Re-normalising order values
        |
        */

        moveTask: (
          taskId,
          targetStatus,
          targetIndex,
        ) => {
          set(
            (state) => {
              const movingTask =
                state.tasks.find(
                  (task) =>
                    task.id ===
                    taskId,
                );

              if (
                !movingTask
              ) {
                return state;
              }

              const sourceStatus =
                movingTask.status;

              /*
               * Remove the moving task from
               * its current column.
               */

              const sourceTasks =
                state.tasks
                  .filter(
                    (task) =>
                      task.status ===
                      sourceStatus &&
                      task.id !==
                      taskId,
                  )
                  .sort(
                    (
                      first,
                      second,
                    ) =>
                      first.order -
                      second.order,
                  );

              /*
               * Determine the tasks that are
               * currently in the target column.
               */

              const targetTasks =
                sourceStatus ===
                  targetStatus
                  ? sourceTasks
                  : state.tasks
                    .filter(
                      (task) =>
                        task.status ===
                        targetStatus,
                    )
                    .sort(
                      (
                        first,
                        second,
                      ) =>
                        first.order -
                        second.order,
                    );

              /*
               * Prevent invalid indexes.
               */

              const safeTargetIndex =
                Math.max(
                  0,
                  Math.min(
                    targetIndex,
                    targetTasks.length,
                  ),
                );

              const now = new Date().toISOString();

              const updatedMovingTask: Task = {
                ...movingTask,

                status: targetStatus,

                updatedAt: now,

                completedAt:
                  targetStatus === 'done'
                    ? movingTask.completedAt ?? now
                    : null,
              };

              /*
               * Insert task into its new
               * position.
               */

              const newTargetTasks =
                [
                  ...targetTasks,
                ];

              newTargetTasks.splice(
                safeTargetIndex,
                0,
                updatedMovingTask,
              );

              /*
               * Normalise the order values
               * inside the target column.
               */

              const normalizedTargetTasks =
                newTargetTasks.map(
                  (
                    task,
                    index,
                  ) => ({
                    ...task,

                    order:
                      index + 1,
                  }),
                );

              /*
               * Reordering within the same
               * column.
               */

              if (
                sourceStatus ===
                targetStatus
              ) {
                const unaffectedTasks =
                  state.tasks.filter(
                    (task) =>
                      task.status !==
                      sourceStatus,
                  );

                return {
                  tasks: [
                    ...unaffectedTasks,

                    ...normalizedTargetTasks,
                  ],
                };
              }

              /*
               * Task moved between columns.
               *
               * Re-normalise the source column
               * as well.
               */

              const normalizedSourceTasks =
                sourceTasks.map(
                  (
                    task,
                    index,
                  ) => ({
                    ...task,

                    order:
                      index + 1,
                  }),
                );

              const unaffectedTasks =
                state.tasks.filter(
                  (task) =>
                    task.status !==
                    sourceStatus &&
                    task.status !==
                    targetStatus,
                );

              return {
                tasks: [
                  ...unaffectedTasks,

                  ...normalizedSourceTasks,

                  ...normalizedTargetTasks,
                ],
              };
            },
          );
        },

        /*
        |--------------------------------------------------------------------------
        | Add comment
        |--------------------------------------------------------------------------
        */

        addComment: (
          taskId,
          authorId,
          message,
        ) => {
          set(
            (state) => {
              /*
               * Generate an ID that will not
               * conflict with existing mock
               * comments.
               */

              const nextId =
                state.comments
                  .length > 0
                  ? Math.max(
                    ...state.comments.map(
                      (
                        comment,
                      ) =>
                        comment.id,
                    ),
                  ) + 1
                  : 1;

              const comment: Comment =
              {
                id: nextId,

                taskId,

                authorId,

                message,

                createdAt:
                  new Date().toISOString(),
              };

              return {
                comments: [
                  ...state.comments,

                  comment,
                ],
              };
            },
          );
        },

        /*
        |--------------------------------------------------------------------------
        | Reset board
        |--------------------------------------------------------------------------
        */

        resetBoard: () => {
          set({
            tasks: [],

            comments: [],

            hasInitialized:
              false,

            commentsInitialized:
              false,
          });
        },
      }),

      /*
      |--------------------------------------------------------------------------
      | Persistence
      |--------------------------------------------------------------------------
      |
      | This preserves task movement, edits and comments across page refreshes.
      |
      */

      {
        name: 'sprintdesk-board',
      },
    ),
  );