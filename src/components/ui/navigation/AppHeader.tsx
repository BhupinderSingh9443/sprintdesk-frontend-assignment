import { useLocation } from 'react-router-dom';

import {
  useAuthStore,
} from '../../../stores/auth.store';

import {
  ThemeToggle,
} from '../../../features/theme/ThemeToggle';

import {
  useLogout,
} from '../../../features/auth/useLogout';

interface AppHeaderProps {
  onMenuOpen: () => void;
}

function getPageTitle(
  pathname: string,
): string {
  switch (pathname) {
    case '/dashboard':
      return 'Dashboard';

    case '/board':
      return 'Sprint Board';

    case '/analytics':
      return 'Analytics';

    default:
      return 'SprintDesk';
  }
}

export function AppHeader({
  onMenuOpen,
}: AppHeaderProps) {
  const location = useLocation();

  const logout = useLogout();

  const user = useAuthStore(
    (state) => state.user,
  );

  const pageTitle =
    getPageTitle(location.pathname);

  return (
    <header
      className="
        sticky
        top-0
        z-20
        flex
        h-16
        items-center
        justify-between
        border-b
        border-slate-200
        bg-white
        px-4
        md:px-6
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuOpen}
          aria-label="Open navigation"
          className="
            rounded-lg
            p-2
            text-slate-600
            hover:bg-slate-100
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            md:hidden
            dark:text-slate-300
            dark:hover:bg-slate-800
          "
        >
          <span aria-hidden="true">
            ☰
          </span>
        </button>

        <h1
          className="
            text-lg
            font-semibold
            text-slate-900
            dark:text-white
          "
        >
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div
          className="
            hidden
            text-right
            sm:block
          "
        >
          <p
            className="
              text-sm
              font-medium
              text-slate-900
              dark:text-white
            "
          >
            {user?.firstName}{' '}
            {user?.lastName}
          </p>

          <p
            className="
              text-xs
              text-slate-500
              dark:text-slate-400
            "
          >
            {user?.email}
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="
            rounded-lg
            px-3
            py-2
            text-sm
            font-medium
            text-slate-600
            hover:bg-slate-100
            hover:text-slate-900
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            dark:text-slate-300
            dark:hover:bg-slate-800
            dark:hover:text-white
          "
        >
          Logout
        </button>
      </div>
    </header>
  );
}