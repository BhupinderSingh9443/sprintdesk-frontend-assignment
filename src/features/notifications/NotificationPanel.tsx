import {
  useMemo,
  useState,
} from 'react';

import {
  useNotificationStore,
} from './notification.store';
import { Button } from '../../components/ui/Button';

const PAGE_SIZE = 20;

export function NotificationPanel() {
  const [
    page,
    setPage,
  ] = useState(1);

  const notifications =
    useNotificationStore(
      (state) =>
        state.notifications,
    );

  const markAsRead =
    useNotificationStore(
      (state) =>
        state.markAsRead,
    );

  const markAllAsRead =
    useNotificationStore(
      (state) =>
        state.markAllAsRead,
    );

  const sortedNotifications =
    useMemo(
      () =>
        [...notifications].sort(
          (a, b) =>
            new Date(
              b.createdAt,
            ).getTime() -
            new Date(
              a.createdAt,
            ).getTime(),
        ),
      [notifications],
    );

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        sortedNotifications.length /
        PAGE_SIZE,
      ),
    );

  const currentPage =
    Math.min(
      page,
      totalPages,
    );

  const start =
    (currentPage - 1) *
    PAGE_SIZE;

  const visibleNotifications =
    sortedNotifications.slice(
      start,
      start + PAGE_SIZE,
    );

  return (
    <div
      className="
        absolute
        right-0
        top-full
        mt-3
        w-[min(24rem,calc(100vw-2rem))]
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        shadow-2xl
        dark:border-slate-700
        dark:bg-slate-900
      "
    >
      <header
        className="
          flex
          items-center
          justify-between
          border-b
          border-slate-200
          px-4
          py-3
          dark:border-slate-800
        "
      >
        <h2
          className="
            font-semibold
            text-slate-900
            dark:text-white
          "
        >
          Notifications
        </h2>

        <Button
          variant="ghost"
          size="sm"
          onClick={markAllAsRead}
          className="text-xs"
        >
          Mark all as read
        </Button>
      </header>

      <div
        className="
          max-h-[28rem]
          overflow-y-auto
        "
      >
        {visibleNotifications.map(
          (notification) => (
            <button
              key={
                notification.id
              }
              type="button"
              onClick={() =>
                markAsRead(
                  notification.id,
                )
              }
              className={`
                block
                w-full
                border-b
                border-slate-100
                px-4
                py-3
                text-left
                hover:bg-slate-50
                dark:border-slate-800
                dark:hover:bg-slate-800

                ${notification.read
                  ? ''
                  : 'bg-blue-50/70 dark:bg-blue-950/30'
                }
              `}
            >
              <div
                className="
                  flex
                  items-start
                  gap-3
                "
              >
                {!notification.read && (
                  <span
                    className="
                      mt-2
                      h-2
                      w-2
                      shrink-0
                      rounded-full
                      bg-blue-600
                    "
                    aria-label="Unread"
                  />
                )}

                <div>
                  <p
                    className="
                      text-sm
                      font-medium
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {
                      notification.title
                    }
                  </p>

                  <p
                    className="
                      mt-1
                      line-clamp-2
                      text-sm
                      text-slate-600
                      dark:text-slate-400
                    "
                  >
                    {
                      notification.message
                    }
                  </p>

                  <time
                    dateTime={
                      notification.createdAt
                    }
                    className="
                      mt-2
                      block
                      text-xs
                      text-slate-400
                    "
                  >
                    {new Intl.DateTimeFormat(
                      'en-AU',
                      {
                        dateStyle:
                          'medium',
                        timeStyle:
                          'short',
                      },
                    ).format(
                      new Date(
                        notification.createdAt,
                      ),
                    )}
                  </time>
                </div>
              </div>
            </button>
          ),
        )}

        {visibleNotifications.length ===
          0 && (
            <p
              className="
              px-4
              py-8
              text-center
              text-sm
              text-slate-500
            "
            >
              No notifications.
            </p>
          )}
      </div>

      {totalPages > 1 && (
        <footer
          className="
            flex
            items-center
            justify-between
            border-t
            border-slate-200
            px-4
            py-3
            dark:border-slate-800
          "
        >
          <Button
            variant="secondary"
            size="sm"
            disabled={
              currentPage <= 1
            }
            onClick={() =>
              setPage((value) =>
                Math.max(1, value - 1)
              )
            }
          >
            Previous
          </Button>

          <span className="text-xs">
            {currentPage} /{' '}
            {totalPages}
          </span>

          <Button
            variant="secondary"
            size="sm"
            disabled={
              currentPage >= totalPages
            }
            onClick={() =>
              setPage((value) =>
                Math.min(
                  totalPages,
                  value + 1,
                )
              )
            }
          >
            Next
          </Button>
        </footer>
      )}
    </div>
  );
}