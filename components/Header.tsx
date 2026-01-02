
import React from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onOpenAccount: () => void;
  showLogout?: boolean;
}

const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle, onOpenAccount, showLogout = true }) => {
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
            {showLogout && (
              <button
                onClick={onOpenAccount}
                className="p-2 rounded-full border border-gray-300 dark:border-zinc-600 bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                aria-label="Account"
                title="Mein Konto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;