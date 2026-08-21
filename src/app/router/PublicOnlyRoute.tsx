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

export function PublicOnlyRoute() {
  const status =
    useAuthStore((state) => state.status);

  if (status === 'initializing') {
    return <FullScreenLoader />;
  }

  if (status === 'authenticated') {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
}