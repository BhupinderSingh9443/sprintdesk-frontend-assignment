import { useThemeStore } from './theme.store';

export function ThemeToggle() {
  const theme = useThemeStore(
    (state) => state.theme,
  );

  const toggleTheme = useThemeStore(
    (state) => state.toggleTheme,
  );

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark
          ? 'Switch to light mode'
          : 'Switch to dark mode'
      }
      className="
        rounded-lg
        border
        border-slate-200
        bg-white
        px-3
        py-2
        text-sm
        font-medium
        text-slate-700
        transition
        hover:bg-slate-50
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        dark:border-slate-700
        dark:bg-slate-900
        dark:text-slate-200
        dark:hover:bg-slate-800
      "
    >
      {isDark ? 'Light mode' : 'Dark mode'}
    </button>
  );
}