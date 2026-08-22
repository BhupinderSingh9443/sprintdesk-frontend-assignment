import type { TaskStatus } from '../../types/domain';

export interface BoardColumnDefinition {
  id: TaskStatus;
  title: string;
}

export const BOARD_COLUMNS: BoardColumnDefinition[] = [
  {
    id: 'backlog',
    title: 'Backlog',
  },
  {
    id: 'in-progress',
    title: 'In Progress',
  },
  {
    id: 'review',
    title: 'Review',
  },
  {
    id: 'done',
    title: 'Done',
  },
];