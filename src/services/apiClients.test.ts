import {
  AxiosError,
  AxiosHeaders,
} from 'axios';

import type {
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

vi.mock(
  '../features/auth/auth.service',
  () => ({
    refreshSession:
      vi.fn(),
  }),
);

import {
  refreshSession,
} from '../features/auth/auth.service';

import {
  getRefreshToken,
  setRefreshToken,
} from '../features/auth/auth.storage';

import {
  useAuthStore,
} from '../stores/auth.store';

import {
  authenticatedApi,
} from './apiClients';

const mockedRefreshSession =
  vi.mocked(
    refreshSession,
  );

describe(
  'authenticatedApi interceptor',
  () => {
    beforeEach(() => {
      localStorage.clear();

      mockedRefreshSession
        .mockReset();

      useAuthStore.setState({
        user: null,
        accessToken:
          'expired-access-token',
        status:
          'authenticated',
      });
    });

    it(
      'refreshes the token and retries a request after 401',
      async () => {
        setRefreshToken(
          'old-refresh-token',
        );

        mockedRefreshSession
          .mockResolvedValue({
            accessToken:
              'new-access-token',

            refreshToken:
              'new-refresh-token',
          });

        let requestCount = 0;

        const authorizationHeaders:
          Array<
            string | null
          > = [];

        const adapter =
          vi.fn(
            async (
              config:
                InternalAxiosRequestConfig,
            ) => {
              requestCount += 1;

              const authorization =
                config.headers.get(
                  'Authorization',
                );

              authorizationHeaders.push(
                authorization
                  ? String(
                      authorization,
                    )
                  : null,
              );

              /*
               * First request:
               * simulate expired token.
               */

              if (
                requestCount ===
                1
              ) {
                const response:
                  AxiosResponse =
                {
                  data: {
                    message:
                      'Unauthorized',
                  },

                  status: 401,

                  statusText:
                    'Unauthorized',

                  headers:
                    new AxiosHeaders(),

                  config,
                };

                throw new AxiosError(
                  'Request failed with status code 401',
                  'ERR_BAD_REQUEST',
                  config,
                  undefined,
                  response,
                );
              }

              /*
               * Retried request:
               * simulate success.
               */

              return {
                data: {
                  ok: true,
                },

                status: 200,

                statusText:
                  'OK',

                headers:
                  new AxiosHeaders(),

                config,
              };
            },
          );

        const response =
          await authenticatedApi.get<{
            ok: boolean;
          }>(
            '/protected-resource',
            {
              adapter,
            },
          );

        expect(
          mockedRefreshSession,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          mockedRefreshSession,
        ).toHaveBeenCalledWith(
          'old-refresh-token',
        );

        expect(
          adapter,
        ).toHaveBeenCalledTimes(
          2,
        );

        expect(
          authorizationHeaders,
        ).toEqual([
          'Bearer expired-access-token',
          'Bearer new-access-token',
        ]);

        expect(
          response.data,
        ).toEqual({
          ok: true,
        });

        expect(
          useAuthStore
            .getState()
            .accessToken,
        ).toBe(
          'new-access-token',
        );

        expect(
          getRefreshToken(),
        ).toBe(
          'new-refresh-token',
        );
      },
    );
  },
);