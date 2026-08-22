

import { getMockData } from '../../types/mockData.service';
import type { BoardData } from './board.types';

export async function getBoardData(): Promise<BoardData> {
  const data = await getMockData();

  return {
    tasks: data.tasks.slice(0, 30),
    users: data.users,
    sprints: data.sprints,
  };
}