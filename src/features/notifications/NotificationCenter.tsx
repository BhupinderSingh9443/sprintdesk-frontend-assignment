import {
  useEffect,
  useState,
} from 'react';

import {
  NotificationPanel,
} from './NotificationPanel';

import {
  useNotificationBootstrap,
} from './useNotificationBootstrap';

import {
  useNotificationPolling,
} from './useNotificationPolling';

import {
  useNotificationStore,
} from './notification.store';

export function NotificationCenter() {
  const [
    open,
    setOpen,
  ] = useState(false);

  useNotificationBootstrap();

  useNotificationPolling(
    open,
  );

  const unreadCount =
    useNotificationStore(
      (state) =>
        state.notifications.filter(
          (notification) =>
            !notification.read,
        ).length,
    );

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (
        event.key === 'Escape'
      ) {
        setOpen(false);
      }
    }

    window.addEventListener(
      'keydown',
      handleEscape,
    );

    return () =>
      window.removeEventListener(
        'keydown',
        handleEscape,
      );
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() =>
          setOpen(
            (value) => !value,
          )
        }
        className="
          relative
          rounded-lg
          p-2
          text-slate-600
          hover:bg-slate-100
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          dark:text-slate-300
          dark:hover:bg-slate-800
        "
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17H9m9-2V10a6 6 0 10-12 0v5l-2 2h16l-2-2zm-8 5h4"
          />
        </svg>

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-1
              min-w-5
              rounded-full
              bg-red-600
              px-1
              text-center
              text-xs
              font-semibold
              leading-5
              text-white
            "
          >
            {unreadCount > 99
              ? '99+'
              : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationPanel />
      )}
    </div>
  );
}