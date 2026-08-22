import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import {
  useBoardStore,
} from './board.store';

import type {
  Task,
} from '../../types/domain';

const taskOne: Task = {
  id: 1,
  title: 'Task One',
  description: 'First test task',
  status: 'backlog',
  priority: 'high',
  assigneeId: 1,
  dueDate: '2026-08-25',
  sprintId: 3,
  order: 1,
  createdAt: '2026-08-20T10:00:00Z',
  completedAt: null,
  updatedAt: '2026-08-20T10:00:00Z',
};

const taskTwo: Task = {
  id: 2,
  title: 'Task Two',
  description: 'Second test task',
  status: 'backlog',
  priority: 'medium',
  assigneeId: 2,
  dueDate: '2026-08-26',
  sprintId: 3,
  order: 2,
  createdAt: '2026-08-20T11:00:00Z',
  completedAt: null,
  updatedAt: '2026-08-20T11:00:00Z',
};

const taskThree: Task = {
  id: 3,
  title: 'Task Three',
  description: 'Third test task',
  status: 'in-progress',
  priority: 'low',
  assigneeId: 3,
  dueDate: '2026-08-27',
  sprintId: 3,
  order: 1,
  createdAt: '2026-08-20T12:00:00Z',
  completedAt: null,
  updatedAt: '2026-08-20T12:00:00Z',
};

describe('board store', () => {
  beforeEach(() => {
    localStorage.clear();

    useBoardStore.setState({
      tasks: [],
      comments: [],
      hasInitialized: false,
      commentsInitialized: false,
    });
  });

  it('adds a task', () => {
    useBoardStore
      .getState()
      .addTask(taskOne);

    const tasks =
      useBoardStore.getState().tasks;

    expect(tasks).toHaveLength(1);

    expect(tasks[0]).toEqual(taskOne);
  });

  it('deletes a task', () => {
    useBoardStore.setState({
      tasks: [
        taskOne,
        taskTwo,
      ],
    });

    useBoardStore
      .getState()
      .deleteTask(taskOne.id);

    const tasks =
      useBoardStore.getState().tasks;

    expect(tasks).toHaveLength(1);

    expect(
      tasks.find(
        (task) =>
          task.id === taskOne.id,
      ),
    ).toBeUndefined();

    expect(tasks[0]?.id).toBe(
      taskTwo.id,
    );
  });

  it('moves a task between columns', () => {
    useBoardStore.setState({
      tasks: [
        taskOne,
        taskTwo,
        taskThree,
      ],
    });

    useBoardStore
      .getState()
      .moveTask(
        taskOne.id,
        'in-progress',
        1,
      );

    const tasks =
      useBoardStore.getState().tasks;

    const movedTask =
      tasks.find(
        (task) =>
          task.id === taskOne.id,
      );

    expect(movedTask?.status).toBe(
      'in-progress',
    );

    expect(movedTask?.order).toBe(2);

    const backlogTasks =
      tasks
        .filter(
          (task) =>
            task.status ===
            'backlog',
        )
        .sort(
          (a, b) =>
            a.order - b.order,
        );

    expect(backlogTasks).toHaveLength(
      1,
    );

    expect(
      backlogTasks[0]?.id,
    ).toBe(taskTwo.id);

    expect(
      backlogTasks[0]?.order,
    ).toBe(1);
  });

  it('reorders a task within the same column', () => {
    useBoardStore.setState({
      tasks: [
        taskOne,
        taskTwo,
      ],
    });

    useBoardStore
      .getState()
      .moveTask(
        taskOne.id,
        'backlog',
        1,
      );

    const backlogTasks =
      useBoardStore
        .getState()
        .tasks
        .filter(
          (task) =>
            task.status ===
            'backlog',
        )
        .sort(
          (a, b) =>
            a.order - b.order,
        );

    expect(
      backlogTasks.map(
        (task) => task.id,
      ),
    ).toEqual([
      taskTwo.id,
      taskOne.id,
    ]);

    expect(
      backlogTasks[0]?.order,
    ).toBe(1);

    expect(
      backlogTasks[1]?.order,
    ).toBe(2);
  });
});