import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { runMigrations } from './migrations';

let db: SqlJsDatabase | null = null;
let dbPath: string = '';
let initPromise: Promise<SqlJsDatabase> | null = null;

export async function initDatabase(): Promise<SqlJsDatabase> {
  if (db) return db;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    dbPath = path.join(app.getPath('userData'), 'sed_documents.db');
    const SQL = await initSqlJs();

    let data: Uint8Array | undefined;
    try {
      if (fs.existsSync(dbPath)) {
        data = fs.readFileSync(dbPath);
      }
    } catch {
      // File doesn't exist or can't be read, start fresh
    }

    db = new SQL.Database(data);
    db.run('PRAGMA foreign_keys = ON');
    runMigrations(db, saveDatabase);
    return db;
  })();

  return initPromise;
}

export function getDatabase(): SqlJsDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export function saveDatabase(): void {
  if (db && dbPath) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

export function closeDatabase(): void {
  if (db) {
    saveDatabase();
    db.close();
    db = null;
    initPromise = null;
  }
}