import { useEffect } from 'react';

import { useThemeStore } from './theme.store';

export function ThemeSync() {
  const theme = useThemeStore(
    (state) => state.theme,
  );

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle(
      'dark',
      theme === 'dark',
    );

    root.style.colorScheme = theme;
  }, [theme]);

  return null;
}