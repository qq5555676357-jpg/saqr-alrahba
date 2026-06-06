import { getDatabase } from '../database.js';

export async function createSupplier(data) {
  const db = getDatabase();
  const result = await db.run(
    `INSERT INTO suppliers (code, name, name_ar, email, phone, city, address, account_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.code, data.name, data.name_ar, data.email, data.phone, data.city, data.address, data.account_id]
  );
  return result.lastID;
}

export async function getSuppliers() {
  const db = getDatabase();
  return db.all('SELECT * FROM suppliers ORDER BY code');
}

export async function getSupplier(id) {
  const db = getDatabase();
  return db.get('SELECT * FROM suppliers WHERE id = ?', [id]);
}

export async function updateSupplier(id, data) {
  const db = getDatabase();
  await db.run(
    `UPDATE suppliers SET name = ?, name_ar = ?, email = ?, phone = ?, city = ?, address = ?, status = ? WHERE id = ?`,
    [data.name, data.name_ar, data.email, data.phone, data.city, data.address, data.status, id]
  );
}

export async function deleteSupplier(id) {
  const db = getDatabase();
  await db.run('DELETE FROM suppliers WHERE id = ?', [id]);
}
