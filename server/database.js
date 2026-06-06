import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;

export async function initDatabase() {
  if (db) return db;

  const dbPath = process.env.DATABASE_PATH || './data/accounting.db';
  
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec('PRAGMA foreign_keys = ON');

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT CHECK(role IN ('admin', 'accountant', 'viewer')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS chart_of_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      type TEXT CHECK(type IN ('asset', 'liability', 'equity', 'revenue', 'expense', 'header')) NOT NULL,
      parent_id INTEGER,
      is_header BOOLEAN DEFAULT 0,
      balance_debit REAL DEFAULT 0,
      balance_credit REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(parent_id) REFERENCES chart_of_accounts(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      city TEXT,
      address TEXT,
      account_id INTEGER NOT NULL,
      balance REAL DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(account_id) REFERENCES chart_of_accounts(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      city TEXT,
      address TEXT,
      account_id INTEGER NOT NULL,
      balance REAL DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(account_id) REFERENCES chart_of_accounts(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference TEXT UNIQUE NOT NULL,
      entry_date DATETIME NOT NULL,
      description TEXT,
      description_ar TEXT,
      total_debit REAL DEFAULT 0,
      total_credit REAL DEFAULT 0,
      status TEXT DEFAULT 'draft',
      created_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(created_by) REFERENCES users(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS journal_entry_lines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      journal_entry_id INTEGER NOT NULL,
      account_id INTEGER NOT NULL,
      debit REAL DEFAULT 0,
      credit REAL DEFAULT 0,
      description TEXT,
      line_no INTEGER,
      FOREIGN KEY(journal_entry_id) REFERENCES journal_entries(id),
      FOREIGN KEY(account_id) REFERENCES chart_of_accounts(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_number TEXT UNIQUE NOT NULL,
      invoice_date DATETIME NOT NULL,
      customer_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      tax REAL DEFAULT 0,
      total REAL NOT NULL,
      status TEXT DEFAULT 'draft',
      journal_entry_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(customer_id) REFERENCES customers(id),
      FOREIGN KEY(journal_entry_id) REFERENCES journal_entries(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS purchase_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      po_number TEXT UNIQUE NOT NULL,
      po_date DATETIME NOT NULL,
      supplier_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      tax REAL DEFAULT 0,
      total REAL NOT NULL,
      status TEXT DEFAULT 'draft',
      journal_entry_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(supplier_id) REFERENCES suppliers(id),
      FOREIGN KEY(journal_entry_id) REFERENCES journal_entries(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS receipt_vouchers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      voucher_number TEXT UNIQUE NOT NULL,
      voucher_date DATETIME NOT NULL,
      customer_id INTEGER,
      amount REAL NOT NULL,
      payment_method TEXT,
      description TEXT,
      journal_entry_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(customer_id) REFERENCES customers(id),
      FOREIGN KEY(journal_entry_id) REFERENCES journal_entries(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS disbursement_vouchers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      voucher_number TEXT UNIQUE NOT NULL,
      voucher_date DATETIME NOT NULL,
      supplier_id INTEGER,
      amount REAL NOT NULL,
      payment_method TEXT,
      description TEXT,
      journal_entry_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(supplier_id) REFERENCES suppliers(id),
      FOREIGN KEY(journal_entry_id) REFERENCES journal_entries(id)
    );
  `);

  console.log('Database initialized');
  return db;
}

export function getDatabase() {
  if (!db) throw new Error('Database not initialized');
  return db;
}
