import {
  useEffect,
} from 'react';

import type {
  ToastItem,
} from './toast.store';

import {
  useToastStore,
} from './toast.store';

interface ToastProps {
  toast: ToastItem;
}

function Toast({
  toast,
}: ToastProps) {
  const removeToast =
    useToastStore(
      (state) =>
        state.removeToast,
    );

  useEffect(() => {
    const timeout =
      window.setTimeout(
        () => {
          removeToast(
            toast.id,
          );
        },
        5000,
      );

    return () => {
      window.clearTimeout(
        timeout,
      );
    };
  }, [
    removeToast,
    toast.id,
  ]);

  return (
    <div
      role="status"
      className="
        w-80
        rounded-xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-xl
        dark:border-slate-700
        dark:bg-slate-900
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <div>
          <p
            className="
              text-sm
              font-semibold
              text-slate-900
              dark:text-white
            "
          >
            {toast.title}
          </p>

          {toast.message && (
            <p
              className="
                mt-1
                text-sm
                text-slate-600
                dark:text-slate-400
              "
            >
              {toast.message}
            </p>
          )}
        </div>

        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() =>
            removeToast(
              toast.id,
            )
          }
          className="
            text-slate-400
            hover:text-slate-700
            dark:hover:text-white
          "
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function ToastViewport() {
  const toasts =
    useToastStore(
      (state) =>
        state.toasts,
    );

  return (
    <div
      aria-live="polite"
      className="
        fixed
        bottom-4
        right-4
        z-[100]
        space-y-3
      "
    >
      {toasts.map(
        (toast) => (
          <Toast
            key={toast.id}
            toast={toast}
          />
        ),
      )}
    </div>
  );
}