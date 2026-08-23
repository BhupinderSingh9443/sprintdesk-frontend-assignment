import {
  act,
  renderHook,
} from '@testing-library/react';

import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import {
  useToast,
} from './useToast';

import {
  useToastStore,
} from './toast.store';

describe('useToast', () => {
  beforeEach(() => {
    useToastStore.setState({
      toasts: [],
    });
  });

  it('adds a toast through showToast', () => {
    const {
      result,
    } = renderHook(() =>
      useToast(),
    );

    let toastId = -1;

    act(() => {
      toastId =
        result.current.showToast({
          title: 'Task updated',
          message:
            'Your changes were saved.',
        });
    });

    const {
      toasts,
    } =
      useToastStore.getState();

    expect(toastId).toEqual(
      expect.any(Number),
    );

    expect(toasts).toHaveLength(1);

    expect(toasts[0]).toEqual({
      id: toastId,
      title: 'Task updated',
      message:
        'Your changes were saved.',
    });
  });
});