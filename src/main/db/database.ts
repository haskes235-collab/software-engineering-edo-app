import BetterSqlite3 from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import { runMigrations } from './migrations';
import { SqliteDatabase } from './types';

let db: SqliteDatabase | null = null;

export async function initDatabase(): Promise<SqliteDatabase> {
  if (db) return db;

  const dbPath = path.join(app.getPath('userData'), 'sed_documents.db');
  db = new BetterSqlite3(dbPath);
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');
  runMigrations(db);
  return db;
}

export function getDatabase(): SqliteDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export function saveDatabase(): void {
  // better-sqlite3 persists changes immediately.
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
