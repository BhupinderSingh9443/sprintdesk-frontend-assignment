import type {
  Comment,
  Sprint,
  Task,
  User,
} from '../../types/domain';

export interface BoardData {
  tasks: Task[];
  users: User[];
  sprints: Sprint[];
  comments: Comment[];
}