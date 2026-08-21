import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

function getInitialTheme(): Theme {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return 'light';
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: getInitialTheme(),

      setTheme: (theme) => {
        set({ theme });
      },

      toggleTheme: () => {
        set({
          theme:
            get().theme === 'light'
              ? 'dark'
              : 'light',
        });
      },
    }),
    {
      name: 'sprintdesk-theme',
    },
  ),
);