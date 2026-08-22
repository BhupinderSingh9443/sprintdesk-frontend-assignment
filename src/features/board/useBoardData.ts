import {
  useEffect,
} from 'react';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  getBoardData,
} from './board.service';

import {
  useBoardStore,
} from './board.store';

export function useBoardData() {
  const initializeTasks =
    useBoardStore(
      (state) => state.initializeTasks,
    );

  const query = useQuery({
    queryKey: ['board-data'],
    queryFn: getBoardData,
  });

  useEffect(() => {
    if (!query.data) {
      return;
    }

    initializeTasks(
      query.data.tasks,
    );
  }, [
    query.data,
    initializeTasks,
  ]);

  return query;
}