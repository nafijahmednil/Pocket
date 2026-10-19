import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { YearMonth } from '../types';

interface MonthNavigatorProps {
  yearMonth: YearMonth;
  viewAllMonths: boolean;
  onPrev: () => void;
  onNext: () => void;
  onResetCurrent: () => void;
  onToggleAll: () => void;
}

export const MonthNavigator: React.FC<MonthNavigatorProps> = ({
  yearMonth,
  viewAllMonths,
  onPrev,
  onNext,
  onResetCurrent,
  onToggleAll,
}) => {
  const now = new Date();
  const isCurrent = yearMonth.year === now.getFullYear() && yearMonth.month === now.getMonth();

  const monthDate = new Date(yearMonth.year, yearMonth.month, 1);
  const displayTitle = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="w-full flex items-center justify-between py-2 select-none">
      {/* Month pagination */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onPrev}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="text-base font-bold text-slate-800 dark:text-slate-100 min-w-[130px] text-center">
          {viewAllMonths ? 'All Time' : displayTitle}
        </span>

        <button
          onClick={onNext}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Quick filter pills */}
      <div className="flex items-center gap-1.5">
        {!isCurrent && !viewAllMonths && (
          <button
            onClick={onResetCurrent}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            This Month
          </button>
        )}

        <button
          onClick={onToggleAll}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            viewAllMonths
              ? 'bg-[#FF6D00] text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          {viewAllMonths ? 'Monthly' : 'All'}
        </button>
      </div>
    </div>
  );
};
