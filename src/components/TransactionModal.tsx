import React, { useState } from 'react';
import { X, ArrowUpRight, ArrowDownLeft, Trash2, Calendar, StickyNote } from 'lucide-react';
import { Expense, TransactionType, UserProfile } from '../types';
import { getCategoryStyle } from '../utils/categories';

interface TransactionModalProps {
  initialExpense: Expense | null;
  profiles: UserProfile[];
  activeProfileId: string;
  currencySymbol: string;
  onDismiss: () => void;
  onSave: (data: {
    amount: number;
    category: string;
    dateMillis: number;
    note: string;
    type: TransactionType;
    title: string;
    profileId: string;
  }) => void;
  onDelete: (expense: Expense) => void;
}

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Entertainment', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Deposit', 'Gift', 'Other'];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  initialExpense,
  profiles,
  activeProfileId,
  currencySymbol,
  onDismiss,
  onSave,
  onDelete,
}) => {
  const isEditing = initialExpense !== null;

  const [transactionType, setTransactionType] = useState<TransactionType>(
    initialExpense ? initialExpense.type : 'EXPENSE'
  );

  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    initialExpense?.profileId || activeProfileId || 'personal'
  );

  const [amountInput, setAmountInput] = useState<string>(
    initialExpense ? initialExpense.amount.toString() : ''
  );

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialExpense
      ? initialExpense.category
      : transactionType === 'INCOME'
      ? 'Salary'
      : 'Food'
  );

  const [customTitle, setCustomTitle] = useState<string>(
    initialExpense?.title && initialExpense.title !== initialExpense.category
      ? initialExpense.title
      : ''
  );

  const [noteInput, setNoteInput] = useState<string>(initialExpense?.note || '');

  // Format date input as YYYY-MM-DD
  const [dateString, setDateString] = useState<string>(() => {
    const d = initialExpense ? new Date(initialExpense.dateMillis) : new Date();
    return d.toISOString().split('T')[0];
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const quickAmounts = [10, 25, 50, 100, 500];

  const handleTypeChange = (newType: TransactionType) => {
    setTransactionType(newType);
    if (newType === 'INCOME') {
      setSelectedCategory('Salary');
    } else {
      setSelectedCategory('Food');
    }
  };

  const handleQuickAdd = (value: number) => {
    const current = parseFloat(amountInput) || 0;
    const nextVal = current + value;
    setAmountInput(nextVal % 1 === 0 ? nextVal.toString() : nextVal.toFixed(2));
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amountInput);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage(`Please enter an amount greater than ${currencySymbol} 0.00`);
      return;
    }

    const dateParts = dateString.split('-');
    const pickedDate = new Date(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[2]),
      12,
      0,
      0
    );

    onSave({
      amount: parsedAmount,
      category: selectedCategory,
      dateMillis: pickedDate.getTime(),
      note: noteInput.trim(),
      type: transactionType,
      title: customTitle.trim() || selectedCategory,
      profileId: selectedProfileId,
    });
  };

  const currentCategories = transactionType === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-md bg-white dark:bg-slate-900 sm:rounded-3xl rounded-t-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
            {isEditing ? 'Edit Activity' : 'New Activity'}
          </h2>
          <button
            onClick={onDismiss}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Income vs Expense Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange('EXPENSE')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                transactionType === 'EXPENSE'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ArrowUpRight size={16} />
              <span>Deduct Expense</span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('INCOME')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                transactionType === 'INCOME'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ArrowDownLeft size={16} />
              <span>Add Money</span>
            </button>
          </div>

          {/* Profile Selector if more than 1 profile */}
          {profiles.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Profile:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {profiles.map(p => {
                  const isSel = p.id === selectedProfileId;
                  const color = p.colorHex || '#F97316';
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProfileId(p.id)}
                      style={{
                        backgroundColor: isSel ? `${color}20` : undefined,
                        borderColor: isSel ? color : undefined,
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        isSel
                          ? 'text-slate-900 dark:text-white font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      <span>{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              {transactionType === 'INCOME' ? 'Amount to Add' : 'Amount to Deduct'}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-2xl font-bold text-slate-800 dark:text-slate-200">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="any"
                min="0"
                placeholder="0.00"
                value={amountInput}
                onChange={(e) => {
                  setAmountInput(e.target.value);
                  setErrorMessage(null);
                }}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-2xl font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-hidden focus:ring-2 focus:ring-[#FF6D00] focus:border-transparent tabular-nums"
                autoFocus={!isEditing}
              />
            </div>

            {/* Quick Add Buttons */}
            <div className="grid grid-cols-5 gap-1.5 mt-2">
              {quickAmounts.map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAdd(val)}
                  className="py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  +{currencySymbol}{val}
                </button>
              ))}
            </div>
          </div>

          {/* Category Selection (No title required!) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Category
              </label>
              <span className="text-[11px] text-slate-400">1-tap selection</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentCategories.map(cat => {
                const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                const visual = getCategoryStyle(cat, transactionType === 'INCOME');
                const IconComp = visual.icon;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      if (!customTitle) {
                        // Title defaults to category as designed
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#FF6D00] text-white border-[#FF6D00] font-bold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 font-medium'
                    }`}
                  >
                    <IconComp size={14} className={isSelected ? 'text-white' : visual.textColor} />
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Date
            </label>
            <div className="relative flex items-center">
              <Calendar size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="date"
                value={dateString}
                onChange={(e) => setDateString(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#FF6D00]"
              />
            </div>
          </div>

          {/* Optional Title / Merchant */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Title or Merchant (Optional)
            </label>
            <input
              type="text"
              placeholder={`e.g. ${selectedCategory}`}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF6D00]"
            />
          </div>

          {/* Note Input (Prominently displayed) */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Note (Optional)
            </label>
            <div className="relative">
              <StickyNote size={16} className="absolute left-3.5 top-3 text-[#FF6D00] pointer-events-none opacity-80" />
              <textarea
                rows={2}
                placeholder="e.g. coffee with friends, salary bonus, project invoice"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF6D00]"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl">
              {errorMessage}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            {isEditing && (
              <button
                type="button"
                onClick={() => onDelete(initialExpense)}
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold text-sm transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            )}

            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-2xl bg-[#FF6D00] hover:bg-[#E65100] text-white font-bold text-sm shadow-sm transition-colors cursor-pointer text-center"
            >
              {transactionType === 'INCOME' ? 'Add Money' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
