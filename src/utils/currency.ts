import { CurrencyConfig } from '../types';

export const CURRENCY_CONFIGS: CurrencyConfig[] = [
  { symbol: '$', label: '$ USD / CAD', rate: 1.0 },
  { symbol: '€', label: '€ EUR', rate: 0.92 },
  { symbol: '£', label: '£ GBP', rate: 0.77 },
  { symbol: '৳', label: '৳ BDT', rate: 120.0 },
  { symbol: '₹', label: '₹ INR', rate: 84.0 },
  { symbol: '¥', label: '¥ JPY', rate: 152.0 },
  { symbol: '₱', label: '₱ PHP', rate: 58.5 },
  { symbol: '₩', label: '₩ KRW', rate: 1360.0 },
  { symbol: 'AED', label: 'AED', rate: 3.67 },
  { symbol: 'SAR', label: 'SAR', rate: 3.75 },
  { symbol: 'CHF', label: 'CHF', rate: 0.89 },
];

export function getCurrencyRate(symbol: string): number {
  const clean = symbol.trim();
  const config = CURRENCY_CONFIGS.find(c => c.symbol.trim() === clean);
  return config ? config.rate : 1.0;
}

export function formatCurrency(amount: number, symbol: string = '$', isPrivacyMode: boolean = false): string {
  if (isPrivacyMode) {
    const trimmedSymbol = symbol.trim();
    return `${trimmedSymbol} ••••`;
  }

  const absAmount = Math.abs(amount);
  const formattedNumber = absAmount % 1 === 0
    ? absAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })
    : absAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const trimmedSymbol = symbol.trimEnd() + (symbol.endsWith(' ') ? ' ' : '');
  const result = `${trimmedSymbol}${formattedNumber}`;
  return amount < 0 ? `-${result}` : result;
}
