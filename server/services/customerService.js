import { getDatabase } from '../database.js';

export async function createCustomer(data) {
  const db = getDatabase();
  const result = await db.run(
    `INSERT INTO customers (code, name, name_ar, email, phone, city, address, account_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.code, data.name, data.name_ar, data.email, data.phone, data.city, data.address, data.account_id]
  );
  return result.lastID;
}

export async function getCustomers() {
  const db = getDatabase();
  return db.all('SELECT * FROM customers ORDER BY code');
}

export async function getCustomer(id) {
  const db = getDatabase();
  return db.get('SELECT * FROM customers WHERE id = ?', [id]);
}

export async function updateCustomer(id, data) {
  const db = getDatabase();
  await db.run(
    `UPDATE customers SET name = ?, name_ar = ?, email = ?, phone = ?, city = ?, address = ?, status = ? WHERE id = ?`,
    [data.name, data.name_ar, data.email, data.phone, data.city, data.address, data.status, id]
  );
}

export async function deleteCustomer(id) {
  const db = getDatabase();
  await db.run('DELETE FROM customers WHERE id = ?', [id]);
}
