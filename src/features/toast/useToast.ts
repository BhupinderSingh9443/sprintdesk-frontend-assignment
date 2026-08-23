import {
  useToastStore,
} from './toast.store';

export function useToast() {
  const addToast =
    useToastStore(
      (state) =>
        state.addToast,
    );

  return {
    showToast: addToast,
  };
}