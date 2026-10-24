import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, handleToggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={handleToggleTheme}
      className="btn-ghost !rounded-full !p-2.5"
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
