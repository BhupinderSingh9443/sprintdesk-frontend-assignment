import type {
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

import {
  authenticatedApi,
} from './httpClients';

import {
  getRefreshToken,
  removeRefreshToken,
  setRefreshToken,
} from '../features/auth/auth.storage';

import {
  refreshSession,
} from '../features/auth/auth.service';

import {
  useAuthStore,
} from '../stores/auth.store';

interface RetryableRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

/*
|--------------------------------------------------------------------------
| Request interceptor
|--------------------------------------------------------------------------
|
| Automatically attach the current access token.
|
*/

authenticatedApi.interceptors.request.use(
  (config) => {
    const accessToken =
      useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.set(
        'Authorization',
        `Bearer ${accessToken}`,
      );
    }

    return config;
  },
);

/*
|--------------------------------------------------------------------------
| Response interceptor
|--------------------------------------------------------------------------
|
| If access token expired:
|
| 1. Receive 401
| 2. Refresh token
| 3. Store new access token
| 4. Retry original request
|
*/

authenticatedApi.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      useAuthStore.getState().setUnauthenticated();

      return Promise.reject(error);
    }

    try {
      /*
       * Multiple API requests may fail at exactly
       * the same time.
       *
       * Only ONE refresh request should run.
       */

      if (!refreshPromise) {
        refreshPromise = refreshSession(refreshToken)
          .then((tokens) => {
            useAuthStore
              .getState()
              .setAccessToken(tokens.accessToken);

            setRefreshToken(tokens.refreshToken);

            return tokens.accessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken =
        await refreshPromise;

      originalRequest.headers.set(
        'Authorization',
        `Bearer ${newAccessToken}`,
      );

      return authenticatedApi(originalRequest);
    } catch (refreshError) {
      removeRefreshToken();

      useAuthStore
        .getState()
        .setUnauthenticated();

      return Promise.reject(refreshError);
    }
  },
);

export { authenticatedApi };