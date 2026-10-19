import { Expense, RestoreStats } from '../types';

export function exportBackupJson(expenses: Expense[]): string {
  const root = {
    app: 'Pocket',
    version: 2,
    exportedAt: Date.now(),
    totalCount: expenses.length,
    expenses: expenses.map(exp => ({
      id: exp.id,
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      dateMillis: exp.dateMillis,
      dateString: new Date(exp.dateMillis).toISOString().replace('T', ' ').substring(0, 19),
      note: exp.note,
      type: exp.type,
      isIncome: exp.type === 'INCOME',
      profileId: exp.profileId || 'personal',
    })),
  };
  return JSON.stringify(root, null, 2);
}

export function parseExpensesFromJson(rawJson: string): { expenses: Expense[]; error?: string } {
  try {
    let clean = rawJson
      .replace(/^\uFEFF/, '')
      .replace(/^\u00EF\u00BB\u00BF/, '')
      .trim();

    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```/, '').replace(/```$/, '').trim();
    }

    if (!clean) {
      return { expenses: [], error: 'Backup content is empty' };
    }

    let parsed: any;
    try {
      parsed = JSON.parse(clean);
    } catch {
      return { expenses: [], error: 'Invalid JSON format' };
    }

    let array: any[] = [];
    if (Array.isArray(parsed)) {
      array = parsed;
    } else if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed.expenses)) {
        array = parsed.expenses;
      } else if (Array.isArray(parsed.transactions)) {
        array = parsed.transactions;
      } else if (Array.isArray(parsed.items)) {
        array = parsed.items;
      } else if (Array.isArray(parsed.data)) {
        array = parsed.data;
      } else if (parsed.data && typeof parsed.data === 'object') {
        array = parsed.data.expenses || parsed.data.transactions || [];
      }
    }

    if (!Array.isArray(array) || array.length === 0) {
      return { expenses: [], error: 'No transactions found in backup data' };
    }

    const list: Expense[] = [];
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      if (!item || typeof item !== 'object') continue;

      const title = (item.title || item.name || item.description || '').trim();

      // Amount resilience
      let amount = 0;
      const rawAmt = item.amount ?? item.cost ?? item.value ?? item.price ?? item.total;
      if (typeof rawAmt === 'number') {
        amount = rawAmt;
      } else if (typeof rawAmt === 'string') {
        const cleaned = rawAmt.replace(/[$€£৳₹¥₱₩,]/g, '').trim();
        amount = parseFloat(cleaned) || 0;
      }

      // Category resilience
      const category = (item.category || item.cat || item.tag || 'Other').trim();

      // Date resilience
      let dateMillis = Date.now();
      const rawDate = item.dateMillis ?? item.timestamp ?? item.time ?? item.date;
      if (typeof rawDate === 'number') {
        dateMillis = rawDate;
      } else if (typeof rawDate === 'string') {
        const parsedTimestamp = Date.parse(rawDate);
        if (!isNaN(parsedTimestamp)) {
          dateMillis = parsedTimestamp;
        }
      }

      // Type resilience
      let type: 'EXPENSE' | 'INCOME' = 'EXPENSE';
      if (item.isIncome === true) {
        type = 'INCOME';
      } else if (typeof item.type === 'string') {
        const t = item.type.toUpperCase();
        if (t.includes('INC') || t.includes('CREDIT') || t.includes('ADD')) {
          type = 'INCOME';
        }
      } else if (typeof item.kind === 'string') {
        const k = item.kind.toUpperCase();
        if (k.includes('INC') || k.includes('CREDIT') || k.includes('ADD')) {
          type = 'INCOME';
        }
      }

      const note = (item.note || item.notes || item.remark || '').trim();
      const profileId = (item.profileId || 'personal').trim() || 'personal';

      list.push({
        id: item.id ? String(item.id) : `restored_${Date.now()}_${i}`,
        title,
        amount: Math.abs(amount),
        category: category.charAt(0).toUpperCase() + category.slice(1),
        dateMillis,
        note,
        type,
        profileId,
        synced: true,
      });
    }

    if (list.length === 0) {
      return { expenses: [], error: 'Found 0 valid transactions after parsing' };
    }

    return { expenses: list };
  } catch (e: any) {
    return { expenses: [], error: e.message || 'Failed to parse backup' };
  }
}

export function mergeExpenses(existing: Expense[], incoming: Expense[]): { updated: Expense[]; stats: RestoreStats } {
  const toInsert: Expense[] = [];
  let skippedDuplicates = 0;

  for (const item of incoming) {
    const isDuplicate = existing.some(ex => {
      const matchAmt = Math.abs(ex.amount - item.amount) < 0.001;
      const matchCat = ex.category.toLowerCase() === item.category.toLowerCase();
      const matchType = ex.type === item.type;
      const matchDate = Math.abs(ex.dateMillis - item.dateMillis) < 3000;
      const matchTitle = (ex.title || '').trim().toLowerCase() === (item.title || '').trim().toLowerCase();
      return matchAmt && matchCat && matchType && matchDate && matchTitle;
    });

    if (!isDuplicate) {
      toInsert.push({ ...item, id: `imp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` });
    } else {
      skippedDuplicates++;
    }
  }

  const updated = [...toInsert, ...existing].sort((a, b) => b.dateMillis - a.dateMillis);

  return {
    updated,
    stats: {
      totalInBackup: incoming.length,
      inserted: toInsert.length,
      skippedDuplicates,
      isReplace: false,
    },
  };
}
