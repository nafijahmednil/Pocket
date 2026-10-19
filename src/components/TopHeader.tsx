import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { AppThemeMode } from '../types';
import { PocketLogo } from './PocketLogo';

interface TopHeaderProps {
  themeMode: AppThemeMode;
  isMenuOpen: boolean;
  onToggleTheme: () => Unit;
  onToggleMenu: () => Unit;
}

type Unit = void;

export const TopHeader: React.FC<TopHeaderProps> = ({
  themeMode,
  isMenuOpen,
  onToggleTheme,
  onToggleMenu,
}) => {
  const todayString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="w-full flex items-center justify-between py-3.5 mb-1.5 select-none">
      <div className="flex items-center gap-3">
        {/* "=" Menu Toggle button on top-left (toggles drawer) */}
        <button
          onClick={onToggleMenu}
          className={`w-10 h-10 rounded-full flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
            isMenuOpen
              ? 'bg-[#FF6D00]/20 text-[#FF6D00]'
              : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}
          aria-label="Toggle Side Menu"
          title="Menu & Settings"
        >
          <div
            className={`w-[18px] h-[2.5px] rounded-full transition-colors ${
              isMenuOpen ? 'bg-[#FF6D00]' : 'bg-slate-700 dark:bg-slate-300'
            }`}
          />
          <div
            className={`w-[18px] h-[2.5px] rounded-full transition-colors ${
              isMenuOpen ? 'bg-[#FF6D00]' : 'bg-slate-700 dark:bg-slate-300'
            }`}
          />
        </button>

        {/* Branding & Date */}
        <div>
          <div className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            {todayString}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <PocketLogo size={30} />
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
              Pocket
            </span>
          </div>
        </div>
      </div>

      {/* Theme Toggle Button on top-right */}
      <button
        onClick={onToggleTheme}
        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-[#FF6D00] transition-colors cursor-pointer"
        aria-label="Switch Theme Mode"
        title={themeMode === 'DARK' ? 'Switch to White & Orange' : 'Switch to Dark Mode'}
      >
        {themeMode === 'DARK' ? (
          <Sun size={20} className="stroke-[2.2]" />
        ) : (
          <Moon size={20} className="stroke-[2.2]" />
        )}
      </button>
    </header>
  );
};
