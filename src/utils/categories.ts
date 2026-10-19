import React from 'react';
import {
  Utensils,
  Car,
  Receipt,
  ShoppingBag,
  HeartPulse,
  Film,
  MoreHorizontal,
  Banknote,
  Laptop,
  Landmark,
  Gift,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';

export interface CategoryVisual {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  bgColor: string;
  textColor: string;
}

export function getCategoryStyle(category: string, isIncome: boolean = false): CategoryVisual {
  const cat = (category || '').toLowerCase().trim();

  if (isIncome) {
    switch (cat) {
      case 'salary':
        return {
          icon: Banknote,
          color: '#059669',
          bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
          textColor: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'freelance':
        return {
          icon: Laptop,
          color: '#0284C7',
          bgColor: 'bg-sky-50 dark:bg-sky-950/40',
          textColor: 'text-sky-600 dark:text-sky-400',
        };
      case 'deposit':
        return {
          icon: Landmark,
          color: '#4F46E5',
          bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
          textColor: 'text-indigo-600 dark:text-indigo-400',
        };
      case 'gift':
        return {
          icon: Gift,
          color: '#D97706',
          bgColor: 'bg-amber-50 dark:bg-amber-950/40',
          textColor: 'text-amber-600 dark:text-amber-400',
        };
      default:
        return {
          icon: ArrowDownLeft,
          color: '#059669',
          bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
          textColor: 'text-emerald-600 dark:text-emerald-400',
        };
    }
  }

  switch (cat) {
    case 'food':
      return {
        icon: Utensils,
        color: '#10B981',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
        textColor: 'text-emerald-600 dark:text-emerald-400',
      };
    case 'transport':
      return {
        icon: Car,
        color: '#0EA5E9',
        bgColor: 'bg-sky-50 dark:bg-sky-950/40',
        textColor: 'text-sky-600 dark:text-sky-400',
      };
    case 'bills':
      return {
        icon: Receipt,
        color: '#E11D48',
        bgColor: 'bg-rose-50 dark:bg-rose-950/40',
        textColor: 'text-rose-600 dark:text-rose-400',
      };
    case 'shopping':
      return {
        icon: ShoppingBag,
        color: '#6366F1',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
        textColor: 'text-indigo-600 dark:text-indigo-400',
      };
    case 'health':
      return {
        icon: HeartPulse,
        color: '#F59E0B',
        bgColor: 'bg-amber-50 dark:bg-amber-950/40',
        textColor: 'text-amber-600 dark:text-amber-400',
      };
    case 'entertainment':
      return {
        icon: Film,
        color: '#8B5CF6',
        bgColor: 'bg-violet-50 dark:bg-violet-950/40',
        textColor: 'text-violet-600 dark:text-violet-400',
      };
    default:
      return {
        icon: MoreHorizontal,
        color: '#64748B',
        bgColor: 'bg-slate-100 dark:bg-slate-800',
        textColor: 'text-slate-600 dark:text-slate-400',
      };
  }
}
