import { create } from 'zustand';

import type { AuthUser } from '../features/auth/auth.types';

export type AuthStatus =
  | 'initializing'
  | 'authenticated'
  | 'unauthenticated';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  status: AuthStatus;

  setAuthenticated: (
    user: AuthUser,
    accessToken: string,
  ) => void;

  setAccessToken: (accessToken: string) => void;

  setUnauthenticated: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  status: 'initializing',

  setAuthenticated: (user, accessToken) =>
    set({
      user,
      accessToken,
      status: 'authenticated',
    }),

  setAccessToken: (accessToken) =>
    set({
      accessToken,
    }),

  setUnauthenticated: () =>
    set({
      user: null,
      accessToken: null,
      status: 'unauthenticated',
    }),
}));