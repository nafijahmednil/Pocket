import React from 'react';
import { Trash2, StickyNote, Wallet, Plus } from 'lucide-react';
import { Expense } from '../types';
import { getCategoryStyle } from '../utils/categories';
import { formatCurrency } from '../utils/currency';

interface TransactionListProps {
  expenses: Expense[];
  currencySymbol: string;
  isPrivacyMode: boolean;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
  onAddExpense: () => void;
  hasFilter: boolean;
  periodLabel: string;
  onClearFilter: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  expenses,
  currencySymbol,
  isPrivacyMode,
  onEditExpense,
  onDeleteExpense,
  onAddExpense,
  hasFilter,
  periodLabel,
  onClearFilter,
}) => {
  if (expenses.length === 0) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3.5">
          <Wallet size={30} />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          {hasFilter ? 'No entries in this view' : `No activities for ${periodLabel}`}
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[260px] mt-1 mb-4">
          {hasFilter
            ? 'Try switching filters or clearing category filters.'
            : 'Tap + to add your first expense or money deposit.'}
        </p>

        {hasFilter ? (
          <button
            onClick={onClearFilter}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Show All
          </button>
        ) : (
          <button
            onClick={onAddExpense}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#FF6D00] hover:bg-[#E65100] text-white shadow-sm transition-colors cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Activity</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-2 pb-24">
      {expenses.map(expense => {
        const isIncome = expense.type === 'INCOME';
        const visual = getCategoryStyle(expense.category, isIncome);
        const IconComponent = visual.icon;

        const hasCustomTitle = expense.title && expense.title.trim().toLowerCase() !== expense.category.toLowerCase();
        const displayTitle = hasCustomTitle ? expense.title : expense.category;

        const dateObj = new Date(expense.dateMillis);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        });

        const subline = hasCustomTitle ? `${expense.category}  •  ${formattedDate}` : formattedDate;

        return (
          <div
            key={expense.id}
            onClick={() => onEditExpense(expense)}
            className="group flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs transition-all cursor-pointer select-none"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Category Icon Badge */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${visual.bgColor} ${visual.textColor}`}
              >
                <IconComponent size={18} />
              </div>

              {/* Title & Notes */}
              <div className="min-w-0 flex-1 pr-2">
                <div className="text-[13.5px] font-semibold text-slate-900 dark:text-white truncate">
                  {displayTitle}
                </div>

                {/* Optional Note (Prominently shown as designed in Pocket) */}
                {expense.note && (
                  <div className="flex items-center gap-1 text-[11.5px] italic text-[#FF6D00] dark:text-[#FFA040] truncate my-0.5">
                    <StickyNote size={11} className="shrink-0 not-italic opacity-80" />
                    <span className="truncate">{expense.note}</span>
                  </div>
                )}

                <div className="text-[10.5px] text-slate-400 dark:text-slate-500 truncate">
                  {subline}
                </div>
              </div>
            </div>

            {/* Amount & Delete */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`text-sm font-bold tabular-nums font-['Plus_Jakarta_Sans'] ${
                  isIncome
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {isIncome ? '+' : '-'}
                {formatCurrency(expense.amount, currencySymbol, isPrivacyMode)}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteExpense(expense);
                }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 dark:text-slate-600 dark:hover:text-rose-400 opacity-60 group-hover:opacity-100 transition-all cursor-pointer"
                title="Delete transaction"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
