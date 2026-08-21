import { useNavigate } from 'react-router-dom';

import {
  removeRefreshToken,
} from './auth.storage';

import {
  useAuthStore,
} from '../../stores/auth.store';

export function useLogout() {
  const navigate = useNavigate();

  const setUnauthenticated =
    useAuthStore(
      (state) => state.setUnauthenticated,
    );

  return function logout() {
    removeRefreshToken();

    setUnauthenticated();

    navigate('/login', {
      replace: true,
    });
  };
}