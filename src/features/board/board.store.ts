import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type {
  Task,
  TaskStatus,
} from '../../types/domain';

interface BoardState {
  tasks: Task[];
  hasInitialized: boolean;

  initializeTasks: (tasks: Task[]) => void;

  addTask: (task: Task) => void;

  updateTask: (
    taskId: number,
    updates: Partial<Task>,
  ) => void;

  deleteTask: (taskId: number) => void;

  moveTask: (
    taskId: number,
    status: TaskStatus,
    order: number,
  ) => void;

  resetBoard: () => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      tasks: [],
      hasInitialized: false,

      initializeTasks: (tasks) => {
        if (get().hasInitialized) {
          return;
        }

        set({
          tasks,
          hasInitialized: true,
        });
      },

      addTask: (task) => {
        set((state) => ({
          tasks: [
            ...state.tasks,
            task,
          ],
        }));
      },

      updateTask: (
        taskId,
        updates,
      ) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  ...updates,
                }
              : task,
          ),
        }));
      },

      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter(
            (task) => task.id !== taskId,
          ),
        }));
      },

      moveTask: (
        taskId,
        status,
        order,
      ) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status,
                  order,
                  updatedAt:
                    new Date().toISOString(),
                }
              : task,
          ),
        }));
      },

      resetBoard: () => {
        set({
          tasks: [],
          hasInitialized: false,
        });
      },
    }),
    {
      name: 'sprintdesk-board',
    },
  ),
);