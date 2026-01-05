import React from 'react';
import ThemeToggle from './ThemeToggle';
import MaterialIcon from './MaterialIcon';

interface HeaderProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onOpenAccount: () => void;
  showLogout?: boolean;
  collectionName?: string;
}

const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle, onOpenAccount, showLogout = true, collectionName = 'My ZoéLu Collection' }) => {
  return (
    <header className="bg-white dark:bg-zinc-800 shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start space-x-4 min-w-0 flex-1">
            <img src="/ZLCM-logo.svg" alt="ZoéLu Logo" className="w-12 h-12 flex-shrink-0" />
            <h1 className="text-3xl font-bold tracking-tight text-brand-text dark:text-gray-100 truncate">
              {collectionName}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle theme={theme} toggleTheme={onThemeToggle} />
            {showLogout && (
              <button
                onClick={onOpenAccount}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors focus:outline-none"
                aria-label="Account"
                title="Mein Konto"
              >
                <MaterialIcon name="account_circle" className="text-xl" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;