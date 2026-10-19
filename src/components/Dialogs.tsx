import React, { useState } from 'react';
import {
  X,
  Wallet,
  Target,
  PieChart,
  Check,
  AlertTriangle,
  Upload,
  Download,
  Copy,
  ClipboardCheck,
  Trash2,
  Edit2,
  FileText,
} from 'lucide-react';
import { Expense, MonthlySummary, RestoreStats, UserProfile } from '../types';
import { getCategoryStyle } from '../utils/categories';
import { formatCurrency } from '../utils/currency';

// ---------------------------------------------------------------------------
// 1. Edit Main Balance Dialog
// ---------------------------------------------------------------------------
interface EditBalanceDialogProps {
  currentBalance: number;
  initialBalance: number;
  currencySymbol: string;
  onDismiss: () => void;
  onConfirm: (newBalance: number) => void;
  onResetBaseline: () => void;
}

export const EditMainBalanceDialog: React.FC<EditBalanceDialogProps> = ({
  currentBalance,
  initialBalance,
  currencySymbol,
  onDismiss,
  onConfirm,
  onResetBaseline,
}) => {
  const [balanceText, setBalanceText] = useState<string>(
    currentBalance % 1 === 0 ? currentBalance.toString() : currentBalance.toFixed(2)
  );
  const [error, setError] = useState<string | null>(null);

  const presets = [100, 500, 1000];

  const handleSave = () => {
    const parsed = parseFloat(balanceText.replace(',', '.').trim());
    if (isNaN(parsed)) {
      setError('Please enter a valid amount');
      return;
    }
    onConfirm(parsed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FF6D00]/15 text-[#FF6D00] flex items-center justify-center shrink-0">
            <Wallet size={18} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
            Edit Main Balance
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Set your actual total wallet or bank balance. Pocket will adjust your baseline so your balance reflects this number.
        </p>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Main Balance ({currencySymbol})
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-base font-bold text-[#FF6D00]">
              {currencySymbol}
            </span>
            <input
              type="number"
              step="any"
              value={balanceText}
              onChange={(e) => {
                setBalanceText(e.target.value);
                setError(null);
              }}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#FF6D00]"
              autoFocus
            />
          </div>
          {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
        </div>

        {/* Quick Presets */}
        <div className="grid grid-cols-3 gap-2">
          {presets.map(val => (
            <button
              key={val}
              type="button"
              onClick={() => {
                const cur = parseFloat(balanceText) || 0;
                const next = cur + val;
                setBalanceText(next % 1 === 0 ? next.toString() : next.toFixed(2));
              }}
              className="py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              +{currencySymbol}{val}
            </button>
          ))}
        </div>

        {initialBalance !== 0 && (
          <div className="text-right">
            <button
              type="button"
              onClick={onResetBaseline}
              className="text-xs text-rose-500 hover:underline cursor-pointer"
            >
              Reset Baseline (0)
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onDismiss}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-[#FF6D00] hover:bg-[#E65100] text-xs font-bold text-white transition-colors"
          >
            Save Balance
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 2. Set Monthly Budget Dialog
// ---------------------------------------------------------------------------
interface SetBudgetDialogProps {
  currentBudget: number;
  currencySymbol: string;
  onDismiss: () => void;
  onSaveBudget: (budget: number) => void;
}

export const SetBudgetDialog: React.FC<SetBudgetDialogProps> = ({
  currentBudget,
  currencySymbol,
  onDismiss,
  onSaveBudget,
}) => {
  const [budgetText, setBudgetText] = useState<string>(
    currentBudget > 0 ? (currentBudget % 1 === 0 ? currentBudget.toString() : currentBudget.toFixed(2)) : ''
  );
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const trimmed = budgetText.trim().replace(',', '.');
    const parsed = trimmed === '' ? 0 : parseFloat(trimmed);

    if (isNaN(parsed) || parsed < 0) {
      setError('Please enter a valid amount');
      return;
    }
    onSaveBudget(parsed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FF6D00]/15 text-[#FF6D00] flex items-center justify-center shrink-0">
            <Target size={18} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
            Monthly Budget Goal
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Set a target monthly expense limit. You can track your spending against this target in the menu and dashboard.
        </p>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Budget Limit ({currencySymbol})
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-base font-bold text-[#FF6D00]">
              {currencySymbol}
            </span>
            <input
              type="number"
              step="any"
              min="0"
              placeholder="e.g. 500.00 (or 0 for none)"
              value={budgetText}
              onChange={(e) => {
                setBudgetText(e.target.value);
                setError(null);
              }}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#FF6D00]"
              autoFocus
            />
          </div>
          {error ? (
            <p className="text-xs text-rose-500 mt-1">{error}</p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-1">Enter 0 to clear the monthly budget target</p>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onDismiss}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-[#FF6D00] hover:bg-[#E65100] text-xs font-bold text-white transition-colors"
          >
            Save Budget
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 3. Category Breakdown Dialog
// ---------------------------------------------------------------------------
interface CategoryBreakdownDialogProps {
  expenses: Expense[];
  currencySymbol: string;
  monthTitle: string;
  onDismiss: () => void;
}

export const CategoryBreakdownDialog: React.FC<CategoryBreakdownDialogProps> = ({
  expenses,
  currencySymbol,
  monthTitle,
  onDismiss,
}) => {
  const expenseItems = expenses.filter(e => e.type === 'EXPENSE');
  const totalExpense = expenseItems.reduce((acc, e) => acc + e.amount, 0);

  // Group by category
  const categoryMap = new Map<string, { amount: number; count: number }>();
  expenseItems.forEach(e => {
    const existing = categoryMap.get(e.category) || { amount: 0, count: 0 };
    categoryMap.set(e.category, {
      amount: existing.amount + e.amount,
      count: existing.count + 1,
    });
  });

  const categoryTotals = Array.from(categoryMap.entries()).sort(
    (a, b) => b[1].amount - a[1].amount
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
              Spending by Category
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {monthTitle} • Total: <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(totalExpense, currencySymbol)}</span>
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto py-4 space-y-3 flex-1">
          {categoryTotals.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No expenses recorded for {monthTitle}.
            </div>
          ) : (
            categoryTotals.map(([category, data]) => {
              const visual = getCategoryStyle(category, false);
              const IconComp = visual.icon;
              const fraction = totalExpense > 0 ? data.amount / totalExpense : 0;
              const percent = Math.round(fraction * 100);

              return (
                <div
                  key={category}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${visual.bgColor} ${visual.textColor}`}
                      >
                        <IconComp size={15} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {category}
                        </div>
                        <div className="text-[10.5px] text-slate-400">
                          {data.count} {data.count === 1 ? 'entry' : 'entries'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatCurrency(data.amount, currencySymbol)}
                      </div>
                      <div className="text-[10.5px] font-bold text-[#FF6D00]">
                        {percent}%
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#FF6D00] transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-2">
          <button
            onClick={onDismiss}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 4. Add / Edit Profile Dialog
// ---------------------------------------------------------------------------
interface ProfileDialogProps {
  initialProfile?: UserProfile | null;
  canDelete?: boolean;
  onDismiss: () => void;
  onSave: (name: string, colorHex: string) => void;
  onDelete?: () => void;
}

const PROFILE_COLORS = [
  '#F97316', // Orange (Default Pocket)
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#8B5CF6', // Purple
  '#F43F5E', // Rose
  '#F59E0B', // Amber
  '#06B6D4', // Cyan
  '#EC4899', // Pink
];

export const ProfileDialog: React.FC<ProfileDialogProps> = ({
  initialProfile,
  canDelete = false,
  onDismiss,
  onSave,
  onDelete,
}) => {
  const isEditing = !!initialProfile;
  const [name, setName] = useState(initialProfile ? initialProfile.name : '');
  const [selectedColor, setSelectedColor] = useState(
    initialProfile ? initialProfile.colorHex : PROFILE_COLORS[0]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
          {isEditing ? `Edit "${initialProfile.name}"` : 'Add New Profile'}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Track personal, business, household, or travel finances independently with dedicated balances and budgets.
        </p>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Profile Name
          </label>
          <input
            type="text"
            placeholder="e.g. Side Hustle, Family, Trip"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#FF6D00]"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Profile Theme Color
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {PROFILE_COLORS.map(color => {
              const isSel = selectedColor.toLowerCase() === color.toLowerCase();
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-xs"
                >
                  {isSel && <Check size={16} className="text-white stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {isEditing && canDelete && onDelete && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onDelete}
              className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors flex items-center justify-center gap-1.5"
            >
              <Trash2 size={14} />
              <span>Delete Profile</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onDismiss}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (name.trim()) onSave(name.trim(), selectedColor);
            }}
            disabled={!name.trim()}
            className="flex-1 py-2.5 rounded-xl bg-[#FF6D00] hover:bg-[#E65100] disabled:opacity-50 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            {isEditing ? 'Save Changes' : 'Create Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 5. Reset Options Dialog
// ---------------------------------------------------------------------------
interface ResetDialogProps {
  currencySymbol: string;
  onDismiss: () => void;
  onResetTransactions: () => void;
  onResetBaseline: () => void;
  onResetEverything: () => void;
}

export const ResetDataDialog: React.FC<ResetDialogProps> = ({
  currencySymbol,
  onDismiss,
  onResetTransactions,
  onResetBaseline,
  onResetEverything,
}) => {
  const [selectedOption, setSelectedOption] = useState<number>(0);

  const options = [
    {
      title: 'Reset All Transactions',
      desc: 'Deletes all recorded expenses and incomes. Your starting balance baseline is kept unchanged.',
      color: 'rose',
    },
    {
      title: 'Reset Main Balance',
      desc: `Resets the starting balance baseline back to ${currencySymbol} 0.00. Transactions remain safe.`,
      color: 'amber',
    },
    {
      title: 'Factory Reset (All Data)',
      desc: `Completely clears all transactions AND resets balance to ${currencySymbol} 0.00. Clean slate.`,
      color: 'rose',
    },
  ];

  const handleConfirm = () => {
    if (selectedOption === 0) onResetTransactions();
    else if (selectedOption === 1) onResetBaseline();
    else onResetEverything();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-2.5 text-rose-500">
          <AlertTriangle size={22} />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
            Reset Pocket Data
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Choose what you would like to reset:
        </p>

        <div className="space-y-2">
          {options.map((opt, idx) => {
            const isSel = selectedOption === idx;
            return (
              <div
                key={opt.title}
                onClick={() => setSelectedOption(idx)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSel
                    ? 'border-rose-500/80 bg-rose-50/50 dark:bg-rose-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                      isSel ? 'border-rose-500 bg-rose-500' : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSel && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div
                      className={`text-xs font-bold ${
                        isSel ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {opt.title}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-normal mt-0.5">
                      {opt.desc}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-[11px] text-rose-600 dark:text-rose-400 leading-normal">
          ⚠️ Warning: This action cannot be undone. You can create a backup before resetting from the side menu.
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onDismiss}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition-colors"
          >
            Confirm Reset
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 6. Backup & Restore Modal Dialog
// ---------------------------------------------------------------------------
interface BackupDialogProps {
  onDismiss: () => void;
  onExportDownload: () => void;
  onCopyClipboard: () => Promise<boolean>;
  onRestoreJson: (rawJson: string, replaceAll: boolean) => void;
  onPreviewJson: (rawJson: string) => number | null;
}

export const BackupModal: React.FC<BackupDialogProps> = ({
  onDismiss,
  onExportDownload,
  onCopyClipboard,
  onRestoreJson,
  onPreviewJson,
}) => {
  const [selectedTab, setSelectedTab] = useState<number>(0); // 0: Export, 1: Restore
  const [isReplaceMode, setIsReplaceMode] = useState<boolean>(false);
  const [pastedJson, setPastedJson] = useState<string>('');
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    const success = await onCopyClipboard();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setPastedJson(text);
          setPreviewCount(onPreviewJson(text));
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
              Backup & Restore
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Cross-device transfer for your Pocket data
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl my-4">
          <button
            onClick={() => setSelectedTab(0)}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              selectedTab === 0
                ? 'bg-white dark:bg-slate-900 text-[#FF6D00] shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            1. Backup & Export
          </button>
          <button
            onClick={() => setSelectedTab(1)}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              selectedTab === 1
                ? 'bg-white dark:bg-slate-900 text-[#FF6D00] shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            2. Restore / Import
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 flex-1">
          {selectedTab === 0 ? (
            /* EXPORT TAB */
            <div className="space-y-3">
              {/* Option 1: Direct File Download */}
              <div className="p-4 rounded-2xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6D00] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Download size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Download Backup File
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Saves a clean JSON backup file to your device
                    </p>
                  </div>
                </div>

                <button
                  onClick={onExportDownload}
                  className="w-full py-2.5 rounded-xl bg-[#FF6D00] hover:bg-[#E65100] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Download size={15} />
                  <span>Download .json Backup</span>
                </button>
              </div>

              {/* Option 2: Copy to Clipboard */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0">
                    <Copy size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Copy Raw Backup Data
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Copy JSON text to easily paste into another device or note
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCopy}
                  className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copied ? <ClipboardCheck size={15} className="text-emerald-500" /> : <Copy size={15} />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy JSON to Clipboard'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* RESTORE TAB */
            <div className="space-y-4">
              {/* Restore Mode Switch */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Restore Mode:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsReplaceMode(false)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      !isReplaceMode
                        ? 'border-[#FF6D00] bg-[#FF6D00]/10 text-[#FF6D00] font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Merge (Keep Existing)
                  </button>
                  <button
                    onClick={() => setIsReplaceMode(true)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isReplaceMode
                        ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Clean (Replace All)
                  </button>
                </div>
              </div>

              {/* Upload File */}
              <div>
                <label className="block w-full cursor-pointer">
                  <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#FF6D00] dark:hover:border-[#FF6D00] text-center space-y-1 transition-colors">
                    <Upload size={22} className="mx-auto text-slate-400" />
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Select .json Backup File
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Tap to browse files from your device
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".json,application/json,text/plain"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Or Paste Raw JSON */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600 dark:text-slate-400">
                    Or Paste Backup Data Directly
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        if (text) {
                          setPastedJson(text);
                          setPreviewCount(onPreviewJson(text));
                        }
                      } catch {}
                    }}
                    className="text-[11px] text-[#FF6D00] hover:underline cursor-pointer"
                  >
                    Paste from Clipboard
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={pastedJson}
                  onChange={(e) => {
                    const text = e.target.value;
                    setPastedJson(text);
                    setPreviewCount(onPreviewJson(text));
                  }}
                  placeholder="Paste your exported Pocket JSON code here..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#FF6D00]"
                />

                {previewCount !== null && previewCount > 0 && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    <Check size={14} className="stroke-[3]" />
                    <span>{previewCount} transactions detected and ready to restore</span>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (pastedJson.trim()) {
                      onRestoreJson(pastedJson.trim(), isReplaceMode);
                    }
                  }}
                  disabled={!pastedJson.trim() || !previewCount}
                  className="w-full py-2.5 rounded-xl bg-[#FF6D00] hover:bg-[#E65100] disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Restore Pasted Transactions
                </button>
              </div>
            </div>
          )}

          {/* Guide */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              📱 Cross-Device Transfer Guide:
            </span>
            1. On old device: Tap "Download .json Backup" or copy JSON code.<br />
            2. On new device: Open Pocket → Backup & Restore → Upload or paste.<br />
            3. All expenses, categories, notes, baseline, and balances transfer instantly!
          </div>
        </div>
      </div>
    </div>
  );
};
