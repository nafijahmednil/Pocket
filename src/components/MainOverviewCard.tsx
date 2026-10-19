import React from 'react';
import { TrendingUp, TrendingDown, Edit2 } from 'lucide-react';
import { MonthlySummary } from '../types';
import { formatCurrency } from '../utils/currency';

interface MainOverviewCardProps {
  summary: MonthlySummary;
  viewAllMonths: boolean;
  currencySymbol: string;
  isPrivacyMode: boolean;
  onEditBalance: () => void;
}

export const MainOverviewCard: React.FC<MainOverviewCardProps> = ({
  summary,
  viewAllMonths,
  currencySymbol,
  isPrivacyMode,
  onEditBalance,
}) => {
  const currentExpenses = viewAllMonths ? summary.allTimeExpenses : summary.selectedMonthExpenses;
  const currentIncome = viewAllMonths ? summary.allTimeIncome : summary.selectedMonthIncome;

  const monthDate = new Date(summary.yearMonth.year, summary.yearMonth.month, 1);
  const monthNameUpper = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();

  const diffVsPrev = currentExpenses - summary.previousMonthExpenses;
  const isSpendingMore = diffVsPrev > 0;
  const hasPrevData = !viewAllMonths && summary.previousMonthExpenses > 0;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs select-none">
      {/* Hero Highlight: Current Month Expenses */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
          <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            {viewAllMonths ? 'ALL-TIME EXPENSES' : `${monthNameUpper} EXPENSES`}
          </span>
        </div>

        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums font-['Plus_Jakarta_Sans']">
          {formatCurrency(currentExpenses, currencySymbol, isPrivacyMode)}
        </div>

        {/* Comparison Context */}
        {hasPrevData ? (
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            {isSpendingMore ? (
              <TrendingUp size={15} className="text-rose-500 shrink-0" />
            ) : (
              <TrendingDown size={15} className="text-emerald-500 shrink-0" />
            )}
            <span>
              {isPrivacyMode ? (
                `vs last month (${isSpendingMore ? '+ spending' : '- spending'})`
              ) : (
                `${isSpendingMore ? '+' : ''}${formatCurrency(diffVsPrev, currencySymbol)} vs last month (${formatCurrency(
                  summary.previousMonthExpenses,
                  currencySymbol
                )})`
              )}
            </span>
          </div>
        ) : summary.topExpenseCategory ? (
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Top category: <span className="font-semibold text-slate-700 dark:text-slate-300">{summary.topExpenseCategory}</span>
          </div>
        ) : null}
      </div>

      {/* Hairline Divider */}
      <hr className="my-5 border-slate-100 dark:border-slate-800/80" />

      {/* Secondary Companion Metrics: Main Balance & Money Added */}
      <div className="flex items-start justify-between gap-4">
        {/* Main Balance */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              MAIN BALANCE
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                summary.mainBalance >= 0
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}
            >
              {summary.mainBalance >= 0 ? 'Healthy' : 'Deficit'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {formatCurrency(summary.mainBalance, currencySymbol, isPrivacyMode)}
            </span>
            <button
              onClick={onEditBalance}
              className="w-5 h-5 rounded-full bg-[#FF6D00]/15 hover:bg-[#FF6D00]/25 text-[#FF6D00] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Edit Main Balance"
            >
              <Edit2 size={11} />
            </button>
          </div>

          {summary.initialBalance !== 0 && (
            <div className="text-[10px] text-[#FF6D00] font-medium mt-0.5">
              {isPrivacyMode
                ? 'Baseline: ••••'
                : `Baseline: ${formatCurrency(summary.initialBalance, currencySymbol)}`}
            </div>
          )}
        </div>

        {/* Money Added (Income) */}
        <div className="text-right">
          <div className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-1">
            MONEY ADDED
          </div>
          <div className="text-lg sm:text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
            {isPrivacyMode ? '+••••' : `+${formatCurrency(currentIncome, currencySymbol)}`}
          </div>
          <div className="text-[10.5px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
            {summary.incomeCount} {summary.incomeCount === 1 ? 'deposit' : 'deposits'}
          </div>
        </div>
      </div>
    </div>
  );
};
