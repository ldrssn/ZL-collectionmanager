import React from 'react';
import MaterialIcon from './MaterialIcon';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-lg bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 focus:outline-none transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <MaterialIcon name="light_mode" className="h-6 w-6" />
      ) : (
        <MaterialIcon name="dark_mode" className="h-6 w-6" />
      )}
    </button>
  );
};

export default ThemeToggle;