import { Database as SqlJsDatabase } from 'sql.js';
import { v4 as uuidv4 } from 'uuid';

const SEED_DOCUMENTS = [
  {
    title: 'Information Security Policy',
    content:
      'This policy establishes requirements for ensuring information security across the organization...',
    status: 'APPROVED' as const,
    authorName: 'Alice Johnson',
    authorId: 'seed-user-1',
  },
  {
    title: 'Contract Approval Procedure',
    content:
      'This procedure defines the workflow for reviewing and approving contracts...',
    status: 'PENDING' as const,
    authorName: 'Bob Smith',
    authorId: 'seed-user-2',
  },
  {
    title: 'Organizational Structure Order',
    content: 'In order to improve the organizational structure of the company...',
    status: 'DRAFT' as const,
    authorName: 'Carol Davis',
    authorId: 'seed-user-3',
  },
];

type SaveCallback = () => void;

export function runMigrations(db: SqlJsDatabase, save: SaveCallback): void {
  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'DRAFT' CHECK(status IN ('DRAFT','PENDING','APPROVED','REJECTED','ARCHIVED')),
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS document_versions (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
      version_number INTEGER NOT NULL,
      content TEXT NOT NULL,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      change_note TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      UNIQUE(document_id, version_number)
    )
  `);

  db.run('CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status)');
  db.run(
    'CREATE INDEX IF NOT EXISTS idx_versions_document_id ON document_versions(document_id)',
  );

  const result = db.exec('SELECT COUNT(*) as count FROM documents');
  const count = result[0]?.values[0]?.[0] as number;

  if (count === 0) {
    const now = new Date().toISOString();
    for (const doc of SEED_DOCUMENTS) {
      db.run(
        `INSERT INTO documents (id, title, content, status, author_id, author_name, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [uuidv4(), doc.title, doc.content, doc.status, doc.authorId, doc.authorName, now, now],
      );
    }
    save();
  }
}