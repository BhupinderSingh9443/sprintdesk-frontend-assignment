import {
  useEffect,
  useState,
} from 'react';

import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/ui/navigation/Sidebar';
import { AppHeader } from '../components/ui/navigation/AppHeader';



export default function AppLayout() {
  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    }

    window.addEventListener(
      'keydown',
      handleEscape,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleEscape,
      );
    };
  }, [mobileMenuOpen]);

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        dark:bg-slate-950
      "
    >
      <a
        href="#main-content"
        className="
          sr-only
          z-50
          rounded-md
          bg-blue-600
          px-4
          py-2
          text-white
          focus:not-sr-only
          focus:fixed
          focus:left-4
          focus:top-4
        "
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside
        className="
          fixed
          inset-y-0
          left-0
          hidden
          w-64
          border-r
          border-slate-200
          bg-white
          md:block
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <Sidebar />
      </aside>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div
          className="
            fixed
            inset-0
            z-40
            md:hidden
          "
        >
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="
              absolute
              inset-0
              bg-slate-950/50
            "
          />

          <aside
            id="mobile-navigation"
            className="
              relative
              h-full
              w-72
              max-w-[85vw]
              bg-white
              shadow-xl
              dark:bg-slate-900
            "
          >
            <Sidebar
              onNavigate={() =>
                setMobileMenuOpen(false)
              }
            />
          </aside>
        </div>
      )}

      <div className="md:pl-64">
        <AppHeader
          onMenuOpen={() =>
            setMobileMenuOpen(true)
          }
        />

        <main
          id="main-content"
          className="
            min-h-[calc(100vh-4rem)]
            p-4
            md:p-6
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}