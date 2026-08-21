import { NavLink } from 'react-router-dom';

import {
  navigationItems,
} from '../../../app/navigation';

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({
  onNavigate,
}: SidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div
        className="
          flex
          h-16
          items-center
          border-b
          border-slate-200
          px-6
          dark:border-slate-800
        "
      >
        <span
          className="
            text-xl
            font-bold
            tracking-tight
            text-slate-900
            dark:text-white
          "
        >
          SprintDesk
        </span>
      </div>

      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-1 p-4"
      >
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                'block rounded-lg px-3 py-2',
                'text-sm font-medium',
                'transition-colors',

                isActive
                  ? [
                      'bg-blue-50',
                      'text-blue-700',
                      'dark:bg-blue-950',
                      'dark:text-blue-300',
                    ].join(' ')
                  : [
                      'text-slate-600',
                      'hover:bg-slate-100',
                      'hover:text-slate-900',
                      'dark:text-slate-400',
                      'dark:hover:bg-slate-800',
                      'dark:hover:text-white',
                    ].join(' '),
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}