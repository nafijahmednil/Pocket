import React, { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import {
  Expense,
  UserProfile,
  YearMonth,
  MonthlySummary,
  TransactionType,
  AppThemeMode,
} from './types';
import { INITIAL_PROFILES, getInitialExpenses } from './data/seedData';
import { getCurrencyRate, formatCurrency } from './utils/currency';
import { exportBackupJson, parseExpensesFromJson, mergeExpenses } from './utils/backup';
import { TopHeader } from './components/TopHeader';
import { ProfileSelector } from './components/ProfileSelector';
import { MonthNavigator } from './components/MonthNavigator';
import { MainOverviewCard } from './components/MainOverviewCard';
import { TransactionFilters } from './components/TransactionFilters';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { SlideMenu } from './components/SlideMenu';
import {
  EditMainBalanceDialog,
  SetBudgetDialog,
  CategoryBreakdownDialog,
  ProfileDialog,
  ResetDataDialog,
  BackupModal,
} from './components/Dialogs';

export default function App() {
  // -------------------------------------------------------------------------
  // 1. Persistent State
  // -------------------------------------------------------------------------
  const [themeMode, setThemeMode] = useState<AppThemeMode>(() => {
    const saved = localStorage.getItem('pocket_theme_mode');
    return saved === 'DARK' ? 'DARK' : 'WHITE_ORANGE';
  });

  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('pocket_profiles');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    return localStorage.getItem('pocket_active_profile_id') || 'personal';
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem('pocket_expenses');
      if (saved) return JSON.parse(saved);
    } catch {}
    return getInitialExpenses();
  });

  const [initialBalanceMap, setInitialBalanceMap] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('pocket_initial_balance_map');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { personal: 1200, professional: 2400 };
  });

  const [budgetMap, setBudgetMap] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('pocket_budget_map');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { personal: 2500, professional: 1500 };
  });

  const [currencySymbol, setCurrencySymbol] = useState<string>(() => {
    return localStorage.getItem('pocket_currency_symbol') || '$';
  });

  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(() => {
    return localStorage.getItem('pocket_privacy_mode') === 'true';
  });

  // -------------------------------------------------------------------------
  // 2. Navigation & UI State
  // -------------------------------------------------------------------------
  const [selectedMonth, setSelectedMonth] = useState<YearMonth>(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const [viewAllMonths, setViewAllMonths] = useState<boolean>(false);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Modals & Drawers
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [isEditBalanceOpen, setIsEditBalanceOpen] = useState<boolean>(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState<boolean>(false);
  const [isCategoryBreakdownOpen, setIsCategoryBreakdownOpen] = useState<boolean>(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState<boolean>(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);

  const [profileToEdit, setProfileToEdit] = useState<UserProfile | null>(null);
  const [isAddProfileOpen, setIsAddProfileOpen] = useState<boolean>(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // 3. Effects for Persistence & DOM Theme Class
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (themeMode === 'DARK') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('pocket_theme_mode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('pocket_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('pocket_active_profile_id', activeProfileId);
  }, [activeProfileId]);

  useEffect(() => {
    localStorage.setItem('pocket_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('pocket_initial_balance_map', JSON.stringify(initialBalanceMap));
  }, [initialBalanceMap]);

  useEffect(() => {
    localStorage.setItem('pocket_budget_map', JSON.stringify(budgetMap));
  }, [budgetMap]);

  useEffect(() => {
    localStorage.setItem('pocket_currency_symbol', currencySymbol);
  }, [currencySymbol]);

  useEffect(() => {
    localStorage.setItem('pocket_privacy_mode', String(isPrivacyMode));
  }, [isPrivacyMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3200);
  };

  // -------------------------------------------------------------------------
  // 4. Calculations & Summaries (matching Pocket ExpenseViewModel)
  // -------------------------------------------------------------------------
  const activeInitialBalance = initialBalanceMap[activeProfileId] || 0;
  const activeMonthlyBudget = budgetMap[activeProfileId] || 0;

  // Filtered by Active Profile
  const profileExpenses = useMemo(() => {
    return expenses.filter(e => {
      if (activeProfileId === 'personal') {
        return !e.profileId || e.profileId === 'personal';
      }
      return e.profileId === activeProfileId;
    });
  }, [expenses, activeProfileId]);

  // Monthly Summary computation
  const summary: MonthlySummary = useMemo(() => {
    const curYear = selectedMonth.year;
    const curMonth = selectedMonth.month;

    const startOfCurrentMonth = new Date(curYear, curMonth, 1, 0, 0, 0, 0).getTime();
    const endOfCurrentMonth = new Date(curYear, curMonth + 1, 0, 23, 59, 59, 999).getTime();

    const prevDate = new Date(curYear, curMonth - 1, 1);
    const startOfPrevMonth = new Date(prevDate.getFullYear(), prevDate.getMonth(), 1, 0, 0, 0, 0).getTime();
    const endOfPrevMonth = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

    const currentMonthItems = profileExpenses.filter(
      e => e.dateMillis >= startOfCurrentMonth && e.dateMillis <= endOfCurrentMonth
    );

    const prevMonthItems = profileExpenses.filter(
      e => e.dateMillis >= startOfPrevMonth && e.dateMillis <= endOfPrevMonth
    );

    const currExpenses = currentMonthItems.filter(e => e.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0);
    const currIncome = currentMonthItems.filter(e => e.type === 'INCOME').reduce((a, b) => a + b.amount, 0);
    const currNet = currIncome - currExpenses;

    const prevExpenses = prevMonthItems.filter(e => e.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0);
    const prevIncome = prevMonthItems.filter(e => e.type === 'INCOME').reduce((a, b) => a + b.amount, 0);

    const allTimeExp = profileExpenses.filter(e => e.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0);
    const allTimeInc = profileExpenses.filter(e => e.type === 'INCOME').reduce((a, b) => a + b.amount, 0);

    const mainBalance = activeInitialBalance + (allTimeInc - allTimeExp);

    // Top Category
    const categoryTotals: Record<string, number> = {};
    currentMonthItems
      .filter(e => e.type === 'EXPENSE')
      .forEach(e => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
      });

    let topCat: string | null = null;
    let maxAmt = -1;
    for (const [cat, amt] of Object.entries(categoryTotals)) {
      if (amt > maxAmt) {
        maxAmt = amt;
        topCat = cat;
      }
    }

    const now = new Date();
    const isCurrent = curYear === now.getFullYear() && curMonth === now.getMonth();

    return {
      selectedMonthExpenses: currExpenses,
      selectedMonthIncome: currIncome,
      selectedMonthNet: currNet,
      previousMonthExpenses: prevExpenses,
      previousMonthIncome: prevIncome,
      allTimeIncome: allTimeInc,
      allTimeExpenses: allTimeExp,
      mainBalance,
      initialBalance: activeInitialBalance,
      expenseCount: currentMonthItems.filter(e => e.type === 'EXPENSE').length,
      incomeCount: currentMonthItems.filter(e => e.type === 'INCOME').length,
      topExpenseCategory: topCat,
      yearMonth: selectedMonth,
      isCurrentMonth: isCurrent,
    };
  }, [profileExpenses, selectedMonth, activeInitialBalance]);

  // Filtered List for Display
  const displayedExpenses = useMemo(() => {
    const curYear = selectedMonth.year;
    const curMonth = selectedMonth.month;

    const startOfCurrentMonth = new Date(curYear, curMonth, 1, 0, 0, 0, 0).getTime();
    const endOfCurrentMonth = new Date(curYear, curMonth + 1, 0, 23, 59, 59, 999).getTime();

    return profileExpenses
      .filter(e => {
        // Month filter
        const matchMonth = viewAllMonths || (e.dateMillis >= startOfCurrentMonth && e.dateMillis <= endOfCurrentMonth);

        // Type filter
        const matchType =
          selectedTypeFilter === 'ALL'
            ? true
            : selectedTypeFilter === 'EXPENSE'
            ? e.type === 'EXPENSE'
            : e.type === 'INCOME';

        // Category filter
        const matchCategory =
          selectedCategory === null
            ? true
            : e.category.toLowerCase() === selectedCategory.toLowerCase();

        return matchMonth && matchType && matchCategory;
      })
      .sort((a, b) => b.dateMillis - a.dateMillis);
  }, [profileExpenses, selectedMonth, viewAllMonths, selectedTypeFilter, selectedCategory]);

  // -------------------------------------------------------------------------
  // 5. Actions & Handlers
  // -------------------------------------------------------------------------
  const handleToggleTheme = () => {
    setThemeMode(prev => (prev === 'WHITE_ORANGE' ? 'DARK' : 'WHITE_ORANGE'));
  };

  const handlePreviousMonth = () => {
    setViewAllMonths(false);
    setSelectedMonth(prev => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setViewAllMonths(false);
    setSelectedMonth(prev => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const handleResetCurrentMonth = () => {
    setViewAllMonths(false);
    const d = new Date();
    setSelectedMonth({ year: d.getFullYear(), month: d.getMonth() });
  };

  const handleToggleViewAllMonths = () => {
    setViewAllMonths(prev => !prev);
  };

  // Main balance target setting
  const handleSetMainBalance = (targetBalance: number) => {
    const allTimeExp = profileExpenses.filter(e => e.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0);
    const allTimeInc = profileExpenses.filter(e => e.type === 'INCOME').reduce((a, b) => a + b.amount, 0);
    const net = allTimeInc - allTimeExp;
    const newInitial = targetBalance - net;

    setInitialBalanceMap(prev => ({
      ...prev,
      [activeProfileId]: newInitial,
    }));
    setIsEditBalanceOpen(false);
    showToast(`Main balance updated to ${formatCurrency(targetBalance, currencySymbol)}`);
  };

  const handleResetMainBalance = () => {
    setInitialBalanceMap(prev => ({
      ...prev,
      [activeProfileId]: 0,
    }));
    setIsEditBalanceOpen(false);
    showToast(`Baseline reset to ${currencySymbol} 0.00`);
  };

  const handleSaveBudget = (budget: number) => {
    setBudgetMap(prev => ({
      ...prev,
      [activeProfileId]: budget,
    }));
    setIsBudgetDialogOpen(false);
    showToast(
      budget > 0
        ? `Monthly budget set to ${formatCurrency(budget, currencySymbol)}`
        : 'Monthly budget limit cleared'
    );
  };

  // Currency Conversion
  const handleSelectCurrency = (newSymbol: string) => {
    if (newSymbol === currencySymbol) return;

    const oldRate = getCurrencyRate(currencySymbol);
    const newRate = getCurrencyRate(newSymbol);
    const ratio = newRate / oldRate;

    setCurrencySymbol(newSymbol);

    // Convert transactions amounts
    setExpenses(prev =>
      prev.map(item => ({
        ...item,
        amount: Math.round(item.amount * ratio * 100) / 100,
      }))
    );

    // Convert initial balances
    setInitialBalanceMap(prev => {
      const nextMap: Record<string, number> = {};
      for (const [k, v] of Object.entries(prev)) {
        nextMap[k] = Math.round(v * ratio * 100) / 100;
      }
      return nextMap;
    });

    // Convert budgets
    setBudgetMap(prev => {
      const nextMap: Record<string, number> = {};
      for (const [k, v] of Object.entries(prev)) {
        nextMap[k] = Math.round(v * ratio * 100) / 100;
      }
      return nextMap;
    });

    showToast(`Currency changed to ${newSymbol.trim()}. All amounts converted.`);
  };

  // Add / Edit transaction
  const handleSaveExpense = (data: {
    amount: number;
    category: string;
    dateMillis: number;
    note: string;
    type: TransactionType;
    title: string;
    profileId: string;
  }) => {
    if (editingExpense) {
      setExpenses(prev =>
        prev.map(e =>
          e.id === editingExpense.id
            ? {
                ...e,
                ...data,
                synced: true,
              }
            : e
        )
      );
      showToast('Activity updated');
    } else {
      const newExp: Expense = {
        id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        ...data,
        synced: true,
      };
      setExpenses(prev => [newExp, ...prev]);
      showToast(data.type === 'INCOME' ? 'Money added' : 'Expense recorded');
    }
    setIsAddModalOpen(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (expense: Expense) => {
    setExpenses(prev => prev.filter(e => e.id !== expense.id));
    setExpenseToDelete(null);
    setIsAddModalOpen(false);
    setEditingExpense(null);
    showToast(`Deleted "${expense.title || expense.category}"`);
  };

  // Profiles Management
  const handleAddProfile = (name: string, colorHex: string) => {
    const id = `profile_${Date.now()}`;
    const newProf: UserProfile = {
      id,
      name,
      iconName: 'Work',
      colorHex,
    };
    const updated = [...profiles, newProf];
    setProfiles(updated);
    setActiveProfileId(id);
    setIsAddProfileOpen(false);
    showToast(`Created & switched to "${name}" profile`);
  };

  const handleEditProfile = (name: string, colorHex: string) => {
    if (!profileToEdit) return;
    const targetId = profileToEdit.id;
    setProfiles(prev =>
      prev.map(p => (p.id === targetId ? { ...p, name, colorHex } : p))
    );
    setProfileToEdit(null);
    showToast('Profile updated');
  };

  const handleDeleteProfile = (profileId: string) => {
    if (profiles.length <= 1) return;
    const updated = profiles.filter(p => p.id !== profileId);
    setProfiles(updated);
    setExpenses(prev => prev.filter(e => e.profileId !== profileId));

    if (activeProfileId === profileId) {
      setActiveProfileId(updated[0].id);
    }
    setProfileToEdit(null);
    showToast('Profile deleted');
  };

  // Reset Operations
  const handleResetTransactions = () => {
    setExpenses(prev => prev.filter(e => e.profileId !== activeProfileId));
    setIsResetDialogOpen(false);
    showToast('All transactions in this profile have been deleted');
  };

  const handleResetBaselineOnly = () => {
    handleResetMainBalance();
    setIsResetDialogOpen(false);
  };

  const handleResetEverything = () => {
    setExpenses([]);
    setInitialBalanceMap({ personal: 0, professional: 0 });
    setBudgetMap({ personal: 0, professional: 0 });
    setIsResetDialogOpen(false);
    showToast('Pocket has been reset to clean slate');
  };

  // Backup & Restore
  const handleExportDownload = () => {
    const jsonString = exportBackupJson(expenses);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timeStamp = new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14);
    a.href = url;
    a.download = `pocket_backup_${timeStamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup file downloaded');
  };

  const handleCopyClipboard = async (): Promise<boolean> => {
    try {
      const jsonString = exportBackupJson(expenses);
      await navigator.clipboard.writeText(jsonString);
      showToast(`Copied ${expenses.length} transactions backup data to clipboard`);
      return true;
    } catch {
      showToast('Failed to copy to clipboard');
      return false;
    }
  };

  const handleRestoreJson = (rawJson: string, replaceAll: boolean) => {
    const parsed = parseExpensesFromJson(rawJson);
    if (parsed.error || !parsed.expenses.length) {
      showToast(parsed.error || 'Failed to restore backup');
      return;
    }

    if (replaceAll) {
      setExpenses(parsed.expenses);
      showToast(`Clean restore complete: ${parsed.expenses.length} transactions restored`);
    } else {
      const { updated, stats } = mergeExpenses(expenses, parsed.expenses);
      setExpenses(updated);
      showToast(
        stats.inserted > 0
          ? `Restored ${stats.inserted} new transactions (${stats.skippedDuplicates} duplicates skipped)`
          : `All ${stats.totalInBackup} transactions in backup are already in Pocket`
      );
    }
    setIsBackupModalOpen(false);
  };

  const handleShareSummary = async () => {
    const net = summary.selectedMonthNet;
    const netPrefix = net >= 0 ? '+' : '';
    const text = [
      `Pocket Monthly Summary • ${summary.yearMonth.year}-${summary.yearMonth.month + 1}`,
      `----------------------------------------`,
      `• Total Expenses: ${formatCurrency(summary.selectedMonthExpenses, currencySymbol)} (${summary.expenseCount} entries)`,
      `• Total Income: ${formatCurrency(summary.selectedMonthIncome, currencySymbol)} (${summary.incomeCount} entries)`,
      `• Net Cash Flow: ${netPrefix}${formatCurrency(net, currencySymbol)}`,
      `• Main Balance: ${formatCurrency(summary.mainBalance, currencySymbol)}`,
      `----------------------------------------`,
      `Tracked offline with Pocket`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      showToast('Summary copied to clipboard to share!');
    } catch {
      showToast('Failed to copy summary');
    }
  };

  const monthDate = new Date(selectedMonth.year, selectedMonth.month, 1);
  const periodLabel = viewAllMonths ? 'all time' : monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        themeMode === 'DARK'
          ? 'bg-[#0F1117] text-[#F0F6FC]'
          : 'bg-[#FAFAFA] text-[#1E293B]'
      }`}
    >
      <div className="max-w-xl mx-auto px-4 sm:px-6 min-h-screen flex flex-col">
        {/* Top Header with "=" Menu and Theme Switcher */}
        <TopHeader
          themeMode={themeMode}
          isMenuOpen={isMenuOpen}
          onToggleTheme={handleToggleTheme}
          onToggleMenu={() => setIsMenuOpen(prev => !prev)}
        />

        {/* Profile Switcher Chips */}
        <div className="mb-2">
          <ProfileSelector
            profiles={profiles}
            activeProfileId={activeProfileId}
            onSelectProfile={id => setActiveProfileId(id)}
            onEditProfile={p => setProfileToEdit(p)}
            onAddNewProfile={() => setIsAddProfileOpen(true)}
          />
        </div>

        {/* Month Navigator Header (< Month Year >) */}
        <div className="mb-2">
          <MonthNavigator
            yearMonth={selectedMonth}
            viewAllMonths={viewAllMonths}
            onPrev={handlePreviousMonth}
            onNext={handleNextMonth}
            onResetCurrent={handleResetCurrentMonth}
            onToggleAll={handleToggleViewAllMonths}
          />
        </div>

        {/* Main Overview Highlight Card (Current Month Expenses, Main Balance & Money Added) */}
        <div className="mb-3.5">
          <MainOverviewCard
            summary={summary}
            viewAllMonths={viewAllMonths}
            currencySymbol={currencySymbol}
            isPrivacyMode={isPrivacyMode}
            onEditBalance={() => setIsEditBalanceOpen(true)}
          />
        </div>

        {/* Transaction Type Filters (All, Deducted / Expenses, Added / Income) */}
        <div className="mb-3">
          <TransactionFilters
            selectedType={selectedTypeFilter}
            onSelectType={type => setSelectedTypeFilter(type)}
            selectedCategory={selectedCategory}
            onSelectCategory={cat => setSelectedCategory(cat)}
          />
        </div>

        {/* Transactions List / Empty State */}
        <main className="flex-1">
          <TransactionList
            expenses={displayedExpenses}
            currencySymbol={currencySymbol}
            isPrivacyMode={isPrivacyMode}
            onEditExpense={exp => {
              setEditingExpense(exp);
              setIsAddModalOpen(true);
            }}
            onDeleteExpense={exp => setExpenseToDelete(exp)}
            onAddExpense={() => {
              setEditingExpense(null);
              setIsAddModalOpen(true);
            }}
            hasFilter={selectedCategory !== null || selectedTypeFilter !== 'ALL'}
            periodLabel={periodLabel}
            onClearFilter={() => {
              setSelectedCategory(null);
              setSelectedTypeFilter('ALL');
            }}
          />
        </main>

        {/* Floating Action Button (+) */}
        <button
          onClick={() => {
            setEditingExpense(null);
            setIsAddModalOpen(true);
          }}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 rounded-full bg-[#FF6D00] hover:bg-[#E65100] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer z-30"
          aria-label="Add Expense"
          title="Add Expense or Income"
        >
          <Plus size={28} className="stroke-[2.5]" />
        </button>

        {/* Side Slide Menu Drawer */}
        <SlideMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          currencySymbol={currencySymbol}
          summary={summary}
          monthlyBudget={activeMonthlyBudget}
          isPrivacyMode={isPrivacyMode}
          profiles={profiles}
          activeProfileId={activeProfileId}
          onTogglePrivacyMode={() => setIsPrivacyMode(prev => !prev)}
          onOpenCategoryBreakdown={() => {
            setIsMenuOpen(false);
            setIsCategoryBreakdownOpen(true);
          }}
          onShareSummary={() => {
            setIsMenuOpen(false);
            handleShareSummary();
          }}
          onOpenBackup={() => {
            setIsMenuOpen(false);
            setIsBackupModalOpen(true);
          }}
          onOpenReset={() => {
            setIsMenuOpen(false);
            setIsResetDialogOpen(true);
          }}
          onSelectCurrency={handleSelectCurrency}
          onOpenBudgetDialog={() => {
            setIsMenuOpen(false);
            setIsBudgetDialogOpen(true);
          }}
          onEditMainBalance={() => {
            setIsMenuOpen(false);
            setIsEditBalanceOpen(true);
          }}
          onSelectProfile={id => {
            setActiveProfileId(id);
            setIsMenuOpen(false);
          }}
          onOpenAddProfile={() => {
            setIsMenuOpen(false);
            setIsAddProfileOpen(true);
          }}
          onEditProfile={p => {
            setIsMenuOpen(false);
            setProfileToEdit(p);
          }}
        />

        {/* Add / Edit Transaction Modal */}
        {isAddModalOpen && (
          <TransactionModal
            initialExpense={editingExpense}
            profiles={profiles}
            activeProfileId={activeProfileId}
            currencySymbol={currencySymbol}
            onDismiss={() => {
              setIsAddModalOpen(false);
              setEditingExpense(null);
            }}
            onSave={handleSaveExpense}
            onDelete={exp => setExpenseToDelete(exp)}
          />
        )}

        {/* Edit Main Balance Dialog */}
        {isEditBalanceOpen && (
          <EditMainBalanceDialog
            currentBalance={summary.mainBalance}
            initialBalance={summary.initialBalance}
            currencySymbol={currencySymbol}
            onDismiss={() => setIsEditBalanceOpen(false)}
            onConfirm={handleSetMainBalance}
            onResetBaseline={handleResetMainBalance}
          />
        )}

        {/* Set Budget Dialog */}
        {isBudgetDialogOpen && (
          <SetBudgetDialog
            currentBudget={activeMonthlyBudget}
            currencySymbol={currencySymbol}
            onDismiss={() => setIsBudgetDialogOpen(false)}
            onSaveBudget={handleSaveBudget}
          />
        )}

        {/* Spending by Category Breakdown Dialog */}
        {isCategoryBreakdownOpen && (
          <CategoryBreakdownDialog
            expenses={displayedExpenses}
            currencySymbol={currencySymbol}
            monthTitle={viewAllMonths ? 'All Time' : periodLabel}
            onDismiss={() => setIsCategoryBreakdownOpen(false)}
          />
        )}

        {/* Add Profile Dialog */}
        {isAddProfileOpen && (
          <ProfileDialog
            onDismiss={() => setIsAddProfileOpen(false)}
            onSave={handleAddProfile}
          />
        )}

        {/* Edit Profile Dialog */}
        {profileToEdit && (
          <ProfileDialog
            initialProfile={profileToEdit}
            canDelete={profiles.length > 1}
            onDismiss={() => setProfileToEdit(null)}
            onSave={handleEditProfile}
            onDelete={() => handleDeleteProfile(profileToEdit.id)}
          />
        )}

        {/* Reset Data Dialog */}
        {isResetDialogOpen && (
          <ResetDataDialog
            currencySymbol={currencySymbol}
            onDismiss={() => setIsResetDialogOpen(false)}
            onResetTransactions={handleResetTransactions}
            onResetBaseline={handleResetBaselineOnly}
            onResetEverything={handleResetEverything}
          />
        )}

        {/* Backup & Restore Modal */}
        {isBackupModalOpen && (
          <BackupModal
            onDismiss={() => setIsBackupModalOpen(false)}
            onExportDownload={handleExportDownload}
            onCopyClipboard={handleCopyClipboard}
            onRestoreJson={handleRestoreJson}
            onPreviewJson={raw => parseExpensesFromJson(raw).expenses.length || null}
          />
        )}

        {/* Delete Transaction Confirmation Dialog */}
        {expenseToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete Expense
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Are you sure you want to delete &ldquo;{expenseToDelete.title || expenseToDelete.category}&rdquo; (
                {formatCurrency(expenseToDelete.amount, currencySymbol)})?
              </p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setExpenseToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteExpense(expenseToDelete)}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-22 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none">
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
