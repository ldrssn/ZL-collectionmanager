
import React from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle, onLogout }) => {
  return (
    <header className="bg-white dark:bg-zinc-800 shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start space-x-4">
            <img src="https://zoelu.com/cdn/shop/files/webseite-zoe-lu-logo-schwarz_220x.png?v=1723470522" alt="Zoué Lu Logo" className="h-10 w-auto dark:invert" />
            <h1 className="text-3xl font-bold tracking-tight text-brand-text dark:text-gray-100">
              My Collection
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle theme={theme} toggleTheme={onThemeToggle} />
            <button
              onClick={onLogout}
              className="p-2 rounded-md bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
              aria-label="Logout"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;