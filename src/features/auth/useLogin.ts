import { useMutation } from '@tanstack/react-query';

import { login } from './auth.service';
import { setRefreshToken } from './auth.storage';

import { useAuthStore } from '../../stores/auth.store';

import type {
  LoginCredentials,
} from './auth.types';

export function useLogin() {
  const setAuthenticated =
    useAuthStore(
      (state) => state.setAuthenticated,
    );

  return useMutation({
    mutationFn: (
      credentials: LoginCredentials,
    ) => login(credentials),

    onSuccess: (session) => {
      /*
       * Refresh token persists.
       */
      setRefreshToken(session.refreshToken);

      /*
       * Access token remains memory-only.
       */
      setAuthenticated(
        session.user,
        session.accessToken,
      );
    },
  });
}