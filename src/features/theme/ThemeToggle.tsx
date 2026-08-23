import { Button } from '../../components/ui/Button';
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
    <Button
      variant="secondary"
      size="sm"
      onClick={toggleTheme}
      aria-label={
        isDark
          ? 'Switch to light mode'
          : 'Switch to dark mode'
      }
    >
      {isDark
        ? 'Light mode'
        : 'Dark mode'}
    </Button>
  );
}