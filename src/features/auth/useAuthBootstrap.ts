import { useEffect } from 'react';

import {
  getRefreshToken,
  removeRefreshToken,
  setRefreshToken,
} from './auth.storage';

import {
  getCurrentUser,
  refreshSession,
} from './auth.service';

import {
  useAuthStore,
} from '../../stores/auth.store';

let bootstrapPromise: Promise<void> | null = null;

async function bootstrapSession(): Promise<void> {
  const refreshToken = getRefreshToken();

  const {
    setAuthenticated,
    setUnauthenticated,
  } = useAuthStore.getState();

  if (!refreshToken) {
    setUnauthenticated();
    return;
  }

  try {
    /*
     * Access token disappeared after browser refresh.
     * Generate a fresh one using refresh token.
     */

    const tokens =
      await refreshSession(refreshToken);

    setRefreshToken(tokens.refreshToken);

    /*
     * Validate session and retrieve authenticated user.
     */

    const user =
      await getCurrentUser(tokens.accessToken);

    setAuthenticated(
      user,
      tokens.accessToken,
    );
  } catch {
    removeRefreshToken();
    setUnauthenticated();
  }
}

export function useAuthBootstrap(): void {
  useEffect(() => {
    /*
     * React StrictMode runs effects twice
     * during development.
     *
     * The singleton promise prevents duplicate
     * refresh requests.
     */

    if (!bootstrapPromise) {
      bootstrapPromise = bootstrapSession();
    }

    void bootstrapPromise;
  }, []);
}