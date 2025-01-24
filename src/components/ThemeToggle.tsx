import React, { useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useThemeStore } from '../stores/themeStore';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-custom-primary dark:bg-gray-700 text-custom-text dark:text-gray-200 hover:bg-opacity-80 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
    </button>
  );
}

export default ThemeToggle;