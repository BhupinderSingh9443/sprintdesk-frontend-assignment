import {
  create,
} from 'zustand';

export interface ToastItem {
  id: number;
  title: string;
  message?: string;
}

interface ToastState {
  toasts: ToastItem[];

  addToast: (
    toast: Omit<
      ToastItem,
      'id'
    >,
  ) => number;

  removeToast: (
    id: number,
  ) => void;
}

let toastId = 0;

export const useToastStore =
  create<ToastState>(
    (set) => ({
      toasts: [],

      addToast: (toast) => {
        toastId += 1;

        const id = toastId;

        set((state) => ({
          toasts: [
            ...state.toasts,
            {
              id,
              ...toast,
            },
          ],
        }));

        return id;
      },

      removeToast: (id) => {
        set((state) => ({
          toasts:
            state.toasts.filter(
              (toast) =>
                toast.id !== id,
            ),
        }));
      },
    }),
  );