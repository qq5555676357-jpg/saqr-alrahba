import { getDatabase } from '../database.js';

export async function getTrialBalance() {
  const db = getDatabase();
  return db.all(`
    SELECT 
      id, code, name, name_ar, type,
      SUM(balance_debit) as debit,
      SUM(balance_credit) as credit,
      (SUM(balance_debit) - SUM(balance_credit)) as balance
    FROM chart_of_accounts
    WHERE is_header = 0
    GROUP BY id
    ORDER BY code
  `);
}

export async function getLedger(accountId) {
  const db = getDatabase();
  const entries = await db.all(`
    SELECT 
      je.entry_date,
      je.reference,
      je.description,
      jel.debit,
      jel.credit,
      (SELECT SUM(COALESCE(debit, 0)) - SUM(COALESCE(credit, 0)) FROM journal_entry_lines 
       WHERE account_id = ? AND journal_entry_id <= je.id) as running_balance
    FROM journal_entry_lines jel
    JOIN journal_entries je ON jel.journal_entry_id = je.id
    WHERE jel.account_id = ? AND je.status = 'posted'
    ORDER BY je.entry_date, je.id
  `, [accountId, accountId]);
  return entries;
}

export async function getBalanceSheet() {
  const db = getDatabase();
  const assets = await db.all(`
    SELECT code, name, name_ar, 
    (balance_debit - balance_credit) as balance
    FROM chart_of_accounts
    WHERE type = 'asset' AND is_header = 0
  `);
  
  const liabilities = await db.all(`
    SELECT code, name, name_ar,
    (balance_credit - balance_debit) as balance
    FROM chart_of_accounts
    WHERE type = 'liability' AND is_header = 0
  `);
  
  const equity = await db.all(`
    SELECT code, name, name_ar,
    (balance_credit - balance_debit) as balance
    FROM chart_of_accounts
    WHERE type = 'equity' AND is_header = 0
  `);

  return { assets, liabilities, equity };
}

export async function getIncomeStatement() {
  const db = getDatabase();
  const revenues = await db.all(`
    SELECT code, name, name_ar,
    (balance_credit - balance_debit) as amount
    FROM chart_of_accounts
    WHERE type = 'revenue' AND is_header = 0
  `);
  
  const expenses = await db.all(`
    SELECT code, name, name_ar,
    (balance_debit - balance_credit) as amount
    FROM chart_of_accounts
    WHERE type = 'expense' AND is_header = 0
  `);

  return { revenues, expenses };
}
