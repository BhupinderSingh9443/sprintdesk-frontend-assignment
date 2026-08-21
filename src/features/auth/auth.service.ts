import { publicApi } from '../../services/httpClients';

import type {
  AuthSession,
  AuthUser,
  LoginCredentials,
  LoginResponse,
  RefreshResponse,
} from './auth.types';

const ACCESS_TOKEN_EXPIRY_MINUTES = 1;

export async function login(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  const response = await publicApi.post<LoginResponse>(
    '/auth/login',
    {
      username: credentials.username,
      password: credentials.password,

      // Short duration intentionally used so
      // silent refresh can be demonstrated.
      expiresInMins: ACCESS_TOKEN_EXPIRY_MINUTES,
    },
  );

  const data = response.data;

  const user: AuthUser = {
    id: data.id,
    username: data.username,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    image: data.image,
  };

  return {
    user,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
}

export async function refreshSession(
  refreshToken: string,
): Promise<RefreshResponse> {
  const response = await publicApi.post<RefreshResponse>(
    '/auth/refresh',
    {
      refreshToken,
      expiresInMins: ACCESS_TOKEN_EXPIRY_MINUTES,
    },
  );

  return response.data;
}

export async function getCurrentUser(
  accessToken: string,
): Promise<AuthUser> {
  const response = await publicApi.get<AuthUser>(
    '/auth/me',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response.data;
}