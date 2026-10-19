import { Expense, UserProfile } from '../types';

export const INITIAL_PROFILES: UserProfile[] = [
  { id: 'personal', name: 'Personal', iconName: 'Person', colorHex: '#F97316' },
  { id: 'professional', name: 'Professional', iconName: 'Work', colorHex: '#3B82F6' },
];

export function getInitialExpenses(): Expense[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Helper to generate timestamps
  const makeDate = (year: number, month: number, day: number, hour: number, minute: number) => {
    return new Date(year, month, day, hour, minute).getTime();
  };

  const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const prevYear = prevMonthDate.getFullYear();
  const prevMonth = prevMonthDate.getMonth();

  return [
    // Current Month - Income
    {
      id: 'seed-inc-1',
      title: 'Salary',
      amount: 4500,
      category: 'Salary',
      dateMillis: makeDate(currentYear, currentMonth, 1, 9, 30),
      note: 'Monthly salary deposit',
      type: 'INCOME',
      profileId: 'personal',
      synced: true,
    },
    {
      id: 'seed-inc-2',
      title: 'Freelance Design',
      amount: 850,
      category: 'Freelance',
      dateMillis: makeDate(currentYear, currentMonth, 7, 14, 15),
      note: 'Landing page client project',
      type: 'INCOME',
      profileId: 'personal',
      synced: true,
    },
    // Current Month - Expenses
    {
      id: 'seed-exp-1',
      title: 'Whole Foods Market',
      amount: 142.50,
      category: 'Food',
      dateMillis: makeDate(currentYear, currentMonth, 2, 18, 45),
      note: 'Weekly fresh groceries & pantry staples',
      type: 'EXPENSE',
      profileId: 'personal',
      synced: true,
    },
    {
      id: 'seed-exp-2',
      title: 'Apartment Rent',
      amount: 1450,
      category: 'Bills',
      dateMillis: makeDate(currentYear, currentMonth, 3, 10, 0),
      note: 'Monthly housing & maintenance',
      type: 'EXPENSE',
      profileId: 'personal',
      synced: true,
    },
    {
      id: 'seed-exp-3',
      title: 'Metro Pass & Transit',
      amount: 75.00,
      category: 'Transport',
      dateMillis: makeDate(currentYear, currentMonth, 5, 8, 20),
      note: 'Monthly city metro card refill',
      type: 'EXPENSE',
      profileId: 'personal',
      synced: true,
    },
    {
      id: 'seed-exp-4',
      title: 'Blue Bottle Cafe',
      amount: 18.25,
      category: 'Food',
      dateMillis: makeDate(currentYear, currentMonth, 6, 11, 10),
      note: 'Coffee and breakfast with Alex',
      type: 'EXPENSE',
      profileId: 'personal',
      synced: true,
    },
    {
      id: 'seed-exp-5',
      title: 'Internet & Fiber',
      amount: 65.00,
      category: 'Bills',
      dateMillis: makeDate(currentYear, currentMonth, 8, 12, 0),
      note: 'High-speed gigabit fiber connection',
      type: 'EXPENSE',
      profileId: 'personal',
      synced: true,
    },
    {
      id: 'seed-exp-6',
      title: 'Running Shoes & Apparel',
      amount: 129.99,
      category: 'Shopping',
      dateMillis: makeDate(currentYear, currentMonth, 10, 16, 40),
      note: 'Nike trail running shoes replacement',
      type: 'EXPENSE',
      profileId: 'personal',
      synced: true,
    },
    {
      id: 'seed-exp-7',
      title: 'Pharmacy & Vitamins',
      amount: 42.10,
      category: 'Health',
      dateMillis: makeDate(currentYear, currentMonth, 12, 15, 20),
      note: 'Monthly multivitamins & supplements',
      type: 'EXPENSE',
      profileId: 'personal',
      synced: true,
    },
    {
      id: 'seed-exp-8',
      title: 'Cinema & Concessions',
      amount: 36.50,
      category: 'Entertainment',
      dateMillis: makeDate(currentYear, currentMonth, 14, 20, 15),
      note: 'IMAX weekend movie night',
      type: 'EXPENSE',
      profileId: 'personal',
      synced: true,
    },
    {
      id: 'seed-exp-9',
      title: 'Farmers Market Produce',
      amount: 58.40,
      category: 'Food',
      dateMillis: makeDate(currentYear, currentMonth, 15, 10, 30),
      note: 'Organic vegetables, berries, and sourdough',
      type: 'EXPENSE',
      profileId: 'personal',
      synced: true,
    },
    // Previous Month items (for comparison calculation)
    {
      id: 'seed-prev-inc',
      title: 'Salary',
      amount: 4500,
      category: 'Salary',
      dateMillis: makeDate(prevYear, prevMonth, 1, 9, 30),
      note: 'Monthly salary',
      type: 'INCOME',
      profileId: 'personal',
      synced: true,
    },
    {
      id: 'seed-prev-exp-1',
      title: 'Rent',
      amount: 1450,
      category: 'Bills',
      dateMillis: makeDate(prevYear, prevMonth, 3, 10, 0),
      note: 'Housing',
      type: 'EXPENSE',
      profileId: 'personal',
      synced: true,
    },
    {
      id: 'seed-prev-exp-2',
      title: 'Groceries & Dining',
      amount: 420,
      category: 'Food',
      dateMillis: makeDate(prevYear, prevMonth, 15, 14, 0),
      note: 'Monthly food total',
      type: 'EXPENSE',
      profileId: 'personal',
      synced: true,
    },
    // Professional Profile Seeds
    {
      id: 'seed-pro-inc-1',
      title: 'Software Consulting Retainer',
      amount: 3200,
      category: 'Freelance',
      dateMillis: makeDate(currentYear, currentMonth, 2, 10, 0),
      note: 'Q4 engineering contract',
      type: 'INCOME',
      profileId: 'professional',
      synced: true,
    },
    {
      id: 'seed-pro-exp-1',
      title: 'Cloud Infrastructure & Hosting',
      amount: 185.00,
      category: 'Bills',
      dateMillis: makeDate(currentYear, currentMonth, 4, 11, 0),
      note: 'AWS & database cluster instances',
      type: 'EXPENSE',
      profileId: 'professional',
      synced: true,
    },
    {
      id: 'seed-pro-exp-2',
      title: 'Developer Tooling & SaaS',
      amount: 89.00,
      category: 'Bills',
      dateMillis: makeDate(currentYear, currentMonth, 9, 14, 0),
      note: 'GitHub Copilot and Figma team subscription',
      type: 'EXPENSE',
      profileId: 'professional',
      synced: true,
    },
  ];
}
