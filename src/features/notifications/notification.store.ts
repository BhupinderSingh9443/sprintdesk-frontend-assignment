import {
  create,
} from 'zustand';

import {
  persist,
} from 'zustand/middleware';

import type {
  Notification,
} from '../../types/domain';

interface NotificationState {
  notifications: Notification[];
  initialized: boolean;

  initializeNotifications: (
    notifications: Notification[],
  ) => void;

  addNotifications: (
    notifications: Notification[],
  ) => void;

  markAsRead: (
    notificationId: number,
  ) => void;

  markAllAsRead: () => void;
}

export const useNotificationStore =
  create<NotificationState>()(
    persist(
      (set, get) => ({
        notifications: [],

        initialized: false,

        initializeNotifications:
          (notifications) => {
            if (
              get().initialized
            ) {
              return;
            }

            set({
              notifications,
              initialized: true,
            });
          },

        addNotifications:
          (incoming) => {
            set((state) => {
              const existingIds =
                new Set(
                  state.notifications.map(
                    (notification) =>
                      notification.id,
                  ),
                );

              const newNotifications =
                incoming.filter(
                  (notification) =>
                    !existingIds.has(
                      notification.id,
                    ),
                );

              if (
                newNotifications.length === 0
              ) {
                return state;
              }

              return {
                notifications: [
                  ...newNotifications,
                  ...state.notifications,
                ],
              };
            });
          },

        markAsRead:
          (notificationId) => {
            set((state) => ({
              notifications:
                state.notifications.map(
                  (notification) =>
                    notification.id ===
                    notificationId
                      ? {
                          ...notification,
                          read: true,
                        }
                      : notification,
                ),
            }));
          },

        markAllAsRead: () => {
          set((state) => ({
            notifications:
              state.notifications.map(
                (notification) => ({
                  ...notification,
                  read: true,
                }),
              ),
          }));
        },
      }),

      {
        name:
          'sprintdesk-notifications',
      },
    ),
  );