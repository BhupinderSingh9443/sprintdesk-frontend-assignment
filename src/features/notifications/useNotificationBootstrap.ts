import {
  useEffect,
} from 'react';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  getInitialNotifications,
} from './notification.service';

import {
  useNotificationStore,
} from './notification.store';

export function useNotificationBootstrap() {
  const initializeNotifications =
    useNotificationStore(
      (state) =>
        state.initializeNotifications,
    );

  const query = useQuery({
    queryKey: [
      'initial-notifications',
    ],

    queryFn:
      getInitialNotifications,

    staleTime: Infinity,
  });

  useEffect(() => {
    if (!query.data) {
      return;
    }

    initializeNotifications(
      query.data,
    );
  }, [
    query.data,
    initializeNotifications,
  ]);

  return query;
}