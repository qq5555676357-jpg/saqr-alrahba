import { getDatabase } from '../database.js';

export async function createAccount(data) {
  const db = getDatabase();
  const result = await db.run(
    `INSERT INTO chart_of_accounts (code, name, name_ar, type, parent_id, is_header)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.code, data.name, data.name_ar, data.type, data.parent_id, data.is_header || 0]
  );
  return result.lastID;
}

export async function getAccounts() {
  const db = getDatabase();
  return db.all('SELECT * FROM chart_of_accounts ORDER BY code');
}

export async function getAccount(id) {
  const db = getDatabase();
  return db.get('SELECT * FROM chart_of_accounts WHERE id = ?', [id]);
}

export async function updateAccount(id, data) {
  const db = getDatabase();
  await db.run(
    `UPDATE chart_of_accounts SET name = ?, name_ar = ?, type = ? WHERE id = ?`,
    [data.name, data.name_ar, data.type, id]
  );
}

export async function deleteAccount(id) {
  const db = getDatabase();
  await db.run('DELETE FROM chart_of_accounts WHERE id = ?', [id]);
}

export async function getAccountHierarchy() {
  const db = getDatabase();
  const accounts = await db.all('SELECT * FROM chart_of_accounts ORDER BY parent_id, code');
  const map = {};
  const hierarchy = [];
  
  for (const acc of accounts) {
    map[acc.id] = { ...acc, children: [] };
  }
  
  for (const acc of accounts) {
    if (acc.parent_id) {
      map[acc.parent_id].children.push(map[acc.id]);
    } else {
      hierarchy.push(map[acc.id]);
    }
  }
  return hierarchy;
}
