import {
  Navigate,
  Outlet,
} from 'react-router-dom';

import {
  useAuthStore,
} from '../../stores/auth.store';

import {
  FullScreenLoader,
} from '../../components/ui/FullScreenLoader';

export function ProtectedRoute() {
  const status =
    useAuthStore((state) => state.status);

  if (status === 'initializing') {
    return <FullScreenLoader />;
  }

  if (status === 'unauthenticated') {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
}