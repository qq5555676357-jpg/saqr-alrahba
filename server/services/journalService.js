import { getDatabase } from '../database.js';

export async function createJournalEntry(data) {
  const db = getDatabase();
  
  const totalDebit = data.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
  const totalCredit = data.lines.reduce((sum, line) => sum + (line.credit || 0), 0);
  
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    throw new Error('Entry out of balance');
  }

  const result = await db.run(
    `INSERT INTO journal_entries (reference, entry_date, description, description_ar, total_debit, total_credit, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.reference, data.entry_date, data.description, data.description_ar, totalDebit, totalCredit, data.created_by]
  );

  const journalId = result.lastID;

  for (let i = 0; i < data.lines.length; i++) {
    const line = data.lines[i];
    await db.run(
      `INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description, line_no)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [journalId, line.account_id, line.debit || 0, line.credit || 0, line.description, i + 1]
    );

    await db.run(
      `UPDATE chart_of_accounts SET balance_debit = balance_debit + ?, balance_credit = balance_credit + ? WHERE id = ?`,
      [line.debit || 0, line.credit || 0, line.account_id]
    );
  }

  return journalId;
}

export async function getJournalEntries(filters = {}) {
  const db = getDatabase();
  let query = `SELECT je.*, u.username FROM journal_entries je LEFT JOIN users u ON je.created_by = u.id`;
  const params = [];
  if (filters.status) {
    query += ` WHERE je.status = ?`;
    params.push(filters.status);
  }
  return db.all(query + ` ORDER BY je.entry_date DESC`, params);
}

export async function getJournalEntry(id) {
  const db = getDatabase();
  const entry = await db.get('SELECT * FROM journal_entries WHERE id = ?', [id]);
  if (entry) {
    entry.lines = await db.all(
      `SELECT jel.*, coa.code, coa.name FROM journal_entry_lines jel
       LEFT JOIN chart_of_accounts coa ON jel.account_id = coa.id
       WHERE journal_entry_id = ?`,
      [id]
    );
  }
  return entry;
}

export async function postJournalEntry(id) {
  const db = getDatabase();
  await db.run('UPDATE journal_entries SET status = ? WHERE id = ?', ['posted', id]);
}
