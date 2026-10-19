import React from 'react';
import {
  PieChart,
  Eye,
  EyeOff,
  Share2,
  CloudUpload,
  RotateCcw,
  Wallet,
  Target,
  Plus,
  CheckCircle2,
  Edit2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { MonthlySummary, UserProfile } from '../types';
import { CURRENCY_CONFIGS, formatCurrency } from '../utils/currency';
import { PocketLogo } from './PocketLogo';

interface SlideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currencySymbol: string;
  summary: MonthlySummary;
  monthlyBudget: number;
  isPrivacyMode: boolean;
  profiles: UserProfile[];
  activeProfileId: string;
  onTogglePrivacyMode: () => void;
  onOpenCategoryBreakdown: () => void;
  onShareSummary: () => void;
  onOpenBackup: () => void;
  onOpenReset: () => void;
  onSelectCurrency: (symbol: string) => void;
  onOpenBudgetDialog: () => void;
  onEditMainBalance: () => void;
  onSelectProfile: (id: string) => void;
  onOpenAddProfile: () => void;
  onEditProfile: (profile: UserProfile) => void;
}

export const SlideMenu: React.FC<SlideMenuProps> = ({
  isOpen,
  onClose,
  currencySymbol,
  summary,
  monthlyBudget,
  isPrivacyMode,
  profiles,
  activeProfileId,
  onTogglePrivacyMode,
  onOpenCategoryBreakdown,
  onShareSummary,
  onOpenBackup,
  onOpenReset,
  onSelectCurrency,
  onOpenBudgetDialog,
  onEditMainBalance,
  onSelectProfile,
  onOpenAddProfile,
  onEditProfile,
}) => {
  if (!isOpen) return null;

  const spentRatio = monthlyBudget > 0 ? Math.min(1.0, summary.selectedMonthExpenses / monthlyBudget) : 0;
  const spentPercent = monthlyBudget > 0 ? Math.round((summary.selectedMonthExpenses / monthlyBudget) * 100) : 0;

  const budgetColor =
    spentPercent > 100 ? 'text-rose-500 bg-rose-500' : spentPercent > 80 ? 'text-amber-500 bg-amber-500' : 'text-emerald-500 bg-emerald-500';

  return (
    <div className="fixed inset-0 z-50 flex select-none animate-in fade-in duration-200">
      {/* Dimmed Backdrop (tapping outside closes menu) */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Side Slide Drawer View (Covering max 340px width) */}
      <div
        className="relative w-[85%] max-w-[340px] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10 overflow-y-auto animate-in slide-in-from-left duration-250 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 space-y-5 flex-1">
          {/* App Identity Header */}
          <div className="flex items-center gap-3 pt-2">
            <PocketLogo size={38} />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                Pocket
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Personal Finance • v1.4.0
              </p>
            </div>
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#FF6D00]/15 text-[#FF6D00]">
              OFFLINE
            </span>
          </div>

          {/* Monthly Budget Goal Banner */}
          <div
            onClick={onOpenBudgetDialog}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                <Target size={14} className="text-[#FF6D00]" />
                <span>MONTHLY BUDGET</span>
              </div>
              <span className="text-xs font-bold text-[#FF6D00]">
                {monthlyBudget > 0 ? 'Edit Limit' : 'Set Limit'}
              </span>
            </div>

            {monthlyBudget > 0 ? (
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(summary.selectedMonthExpenses, currencySymbol, isPrivacyMode)} of{' '}
                    {formatCurrency(monthlyBudget, currencySymbol, isPrivacyMode)}
                  </span>
                  <span className={`font-bold ${budgetColor.split(' ')[0]}`}>{spentPercent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${budgetColor.split(' ')[1]}`}
                    style={{ width: `${Math.min(100, spentPercent)}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500">
                No spending target set. Tap here to set a monthly budget goal.
              </p>
            )}
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* SECTION 1: INSIGHTS & TOOLS */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-1">
              INSIGHTS & TOOLS
            </div>

            {/* Category Breakdown */}
            <button
              onClick={onOpenCategoryBreakdown}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-violet-500/15 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                <PieChart size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  Spending by Category
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  Visual distribution and ranking for current view
                </div>
              </div>
              <ChevronRight size={15} className="text-slate-400" />
            </button>

            {/* Privacy / Discreet Mode */}
            <div className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-left">
              <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isPrivacyMode
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {isPrivacyMode ? <EyeOff size={17} /> : <Eye size={17} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Privacy / Discreet Mode
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {isPrivacyMode ? 'Balances masked with •••• on home screen' : 'Full balances visible on home screen'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onTogglePrivacyMode}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isPrivacyMode ? 'bg-[#FF6D00]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isPrivacyMode ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Share Month Summary */}
            <button
              onClick={onShareSummary}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <Share2 size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  Share Month Summary
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  Send formatted totals via message or notes
                </div>
              </div>
              <ChevronRight size={15} className="text-slate-400" />
            </button>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* SECTION 2: DATA & BACKUP */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-1">
              DATA & BACKUP
            </div>

            <button
              onClick={onOpenBackup}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FF6D00]/15 text-[#FF6D00] flex items-center justify-center shrink-0">
                <CloudUpload size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  Backup & Restore
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  Save JSON file, copy data, or import across devices
                </div>
              </div>
              <ChevronRight size={15} className="text-slate-400" />
            </button>

            <button
              onClick={onOpenReset}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <RotateCcw size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  Reset Options
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  Delete transactions or reset balance baseline
                </div>
              </div>
              <ChevronRight size={15} className="text-slate-400" />
            </button>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* SECTION 3: FINANCIAL PREFERENCES */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-1">
              FINANCIAL PREFERENCES
            </div>

            {/* Currency Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Currency</span>
                <span className="font-bold text-[#FF6D00]">Active: {currencySymbol}</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
                {CURRENCY_CONFIGS.map(c => {
                  const isSel = currencySymbol.trim() === c.symbol.trim();
                  return (
                    <button
                      key={c.symbol}
                      onClick={() => onSelectCurrency(c.symbol)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        isSel
                          ? 'bg-[#FF6D00] text-white font-bold'
                          : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 px-1">
                Switching currency automatically converts all numeric amounts using standard exchange rates.
              </p>
            </div>

            {/* Starting Balance Baseline */}
            <button
              onClick={onEditMainBalance}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Wallet size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  Starting Balance Baseline
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  Current baseline: {formatCurrency(summary.initialBalance, currencySymbol, isPrivacyMode)}
                </div>
              </div>
              <ChevronRight size={15} className="text-slate-400" />
            </button>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* SECTION 4: PROFILES */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                PROFILES
              </span>
              <button
                onClick={onOpenAddProfile}
                className="flex items-center gap-1 text-xs font-bold text-[#FF6D00] hover:opacity-80 transition-opacity cursor-pointer"
              >
                <Plus size={13} className="stroke-[2.5]" />
                <span>Add Profile</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {profiles.map(p => {
                const isActive = p.id === activeProfileId;
                const color = p.colorHex || '#F97316';
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProfile(p.id)}
                    style={{
                      backgroundColor: isActive ? `${color}18` : undefined,
                      borderColor: isActive ? color : undefined,
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer border ${
                      isActive
                        ? 'border'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${color}25` }}
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {p.name}
                        </div>
                        <div
                          className="text-[10.5px] truncate"
                          style={{ color: isActive ? color : '#94A3B8' }}
                        >
                          {isActive ? 'Active Profile' : 'Tap to switch'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isActive && (
                        <CheckCircle2 size={16} style={{ color }} className="mr-1" />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProfile(p);
                        }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* SECTION 5: MONTH SNAPSHOT */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-1">
              MONTH SNAPSHOT
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center">
              <div>
                <div className="text-[10.5px] text-slate-400 mb-0.5">Entries</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {summary.expenseCount + summary.incomeCount}
                </div>
              </div>
              <div>
                <div className="text-[10.5px] text-slate-400 mb-0.5">Inflow</div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  +{formatCurrency(summary.selectedMonthIncome, currencySymbol, isPrivacyMode)}
                </div>
              </div>
              <div>
                <div className="text-[10.5px] text-slate-400 mb-0.5">Net Flow</div>
                <div
                  className={`text-xs font-bold ${
                    summary.selectedMonthNet >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {summary.selectedMonthNet >= 0 ? '+' : ''}
                  {formatCurrency(summary.selectedMonthNet, currencySymbol, isPrivacyMode)}
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Offline Guarantee Footer */}
          <div className="flex items-start gap-2 pt-2 text-[10.5px] text-slate-400 dark:text-slate-500 leading-relaxed">
            <ShieldCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" />
            <span>
              Pocket operates 100% locally in your browser. All data is saved on your device and never uploaded to any external server.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
