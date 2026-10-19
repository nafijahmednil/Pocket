export type TransactionType = 'EXPENSE' | 'INCOME';

export type ExpenseCategory = 
  | 'Food'
  | 'Transport'
  | 'Bills'
  | 'Shopping'
  | 'Health'
  | 'Entertainment'
  | 'Other';

export type IncomeCategory = 
  | 'Salary'
  | 'Freelance'
  | 'Deposit'
  | 'Gift'
  | 'Other';

export interface UserProfile {
  id: string;
  name: string;
  iconName: string;
  colorHex: string; // e.g. '#F97316'
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  dateMillis: number;
  note: string;
  type: TransactionType;
  profileId: string;
  synced?: boolean;
}

export interface YearMonth {
  year: number;
  month: number; // 0-indexed (0 = Jan, 11 = Dec)
}

export interface MonthlySummary {
  selectedMonthExpenses: number;
  selectedMonthIncome: number;
  selectedMonthNet: number;
  previousMonthExpenses: number;
  previousMonthIncome: number;
  allTimeIncome: number;
  allTimeExpenses: number;
  mainBalance: number;
  initialBalance: number;
  expenseCount: number;
  incomeCount: number;
  topExpenseCategory: string | null;
  yearMonth: YearMonth;
  isCurrentMonth: boolean;
}

export interface CurrencyConfig {
  symbol: string;
  label: string;
  rate: number; // relative to USD (1.0)
}

export type AppThemeMode = 'WHITE_ORANGE' | 'DARK';

export interface RestoreStats {
  totalInBackup: number;
  inserted: number;
  skippedDuplicates: number;
  isReplace: boolean;
}
