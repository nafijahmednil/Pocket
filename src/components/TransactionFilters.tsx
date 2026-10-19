import React from 'react';

interface TransactionFiltersProps {
  selectedType: string; // 'ALL' | 'EXPENSE' | 'INCOME'
  onSelectType: (type: string) => void;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CATEGORIES = [
  'Food',
  'Transport',
  'Bills',
  'Shopping',
  'Health',
  'Entertainment',
  'Salary',
  'Freelance',
  'Deposit',
  'Gift',
  'Other',
];

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  selectedType,
  onSelectType,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full space-y-2.5 select-none">
      {/* Type Filter Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { key: 'ALL', label: 'All Activities' },
          { key: 'EXPENSE', label: 'Deducted (Expenses)' },
          { key: 'INCOME', label: 'Added (Income)' },
        ].map(tab => {
          const isSelected = selectedType === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onSelectType(tab.key)}
              className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer truncate ${
                isSelected
                  ? 'bg-[#FF6D00] text-white shadow-xs font-bold'
                  : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
        {/* All Categories Chip */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
            selectedCategory === null
              ? 'bg-[#FF6D00] text-white border-[#FF6D00] font-bold shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 font-medium'
          }`}
        >
          All Categories
        </button>

        {CATEGORIES.map(category => {
          const isSelected = selectedCategory?.toLowerCase() === category.toLowerCase();
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(isSelected ? null : category)}
              className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#FF6D00] text-white border-[#FF6D00] font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 font-medium'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};
