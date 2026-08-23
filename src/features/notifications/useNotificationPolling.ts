import {
  useEffect,
} from 'react';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  mapPostToNotification,
  pollNotifications,
} from './notification.service';

import {
  useNotificationStore,
} from './notification.store';

import {
  usePageVisibility,
} from './usePageVisibility';

import {
  useToast,
} from '../toast/useToast';

export function useNotificationPolling(
  panelOpen: boolean,
) {
  const isVisible =
    usePageVisibility();

  const notifications =
    useNotificationStore(
      (state) =>
        state.notifications,
    );

  const addNotifications =
    useNotificationStore(
      (state) =>
        state.addNotifications,
    );

  const {
    showToast,
  } = useToast();

  const query = useQuery({
    queryKey: [
      'notification-poll',
    ],

    queryFn:
      pollNotifications,

    enabled: isVisible,

    refetchInterval:
      isVisible
        ? 15_000
        : false,

    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!query.data) {
      return;
    }

    const existingIds =
      new Set(
        notifications.map(
          (notification) =>
            notification.id,
        ),
      );

    const incoming =
      query.data
        .map(
          mapPostToNotification,
        )
        .filter(
          (notification) =>
            !existingIds.has(
              notification.id,
            ),
        );

    if (
      incoming.length === 0
    ) {
      return;
    }

    addNotifications(
      incoming,
    );

    if (!panelOpen) {
      showToast({
        title:
          incoming.length === 1
            ? 'New notification'
            : `${incoming.length} new notifications`,

        message:
          incoming[0]?.title,
      });
    }
  }, [
    query.data,
    notifications,
    addNotifications,
    panelOpen,
    showToast,
  ]);

  return query;
}