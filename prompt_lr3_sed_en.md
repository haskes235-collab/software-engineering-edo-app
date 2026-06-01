# Prompt: EDMS — Document Management Module (Electron + React + TypeScript + SQLite)

## Context

Implement a **document management module** for an Electronic Document Management System (EDMS). This is a desktop application built with **Electron + React + TypeScript** and **SQLite (better-sqlite3)** as the data store.

The project is an academic lab assignment and must demonstrate:
- Clean Code principles
- At least one design pattern (with justification)
- Proper Git usage (meaningful commits, README)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop shell | Electron 28+ |
| UI framework | React 18 + TypeScript |
| Bundler | Vite + electron-vite |
| Database | SQLite via `better-sqlite3` |
| Styling | CSS Modules or Tailwind CSS |
| Linting | ESLint + Prettier |

---

## Domain Model

Use exactly the following types, defined in a dedicated file `src/shared/types.ts`:

```typescript
export type DocStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';

export interface Document {
  id: string;           // UUID v4
  title: string;
  content: string;
  status: DocStatus;
  authorId: string;
  authorName: string;
  createdAt: string;    // ISO 8601
  updatedAt: string;    // ISO 8601
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  changeNote: string;
}

export interface CreateDocumentDto {
  title: string;
  content: string;
  authorId: string;
  authorName: string;
}

export interface UpdateDocumentDto {
  title?: string;
  content?: string;
  changeNote: string;   // required — must describe what changed
}
```

---

## Project Structure

Strictly follow this directory layout:

```
sed-document-module/
├── electron/
│   ├── main.ts              # Electron main process, IPC handlers
│   └── preload.ts           # contextBridge API exposure
├── src/
│   ├── shared/
│   │   ├── types.ts         # Domain types (see above)
│   │   ├── ipcChannels.ts   # IPC channel name constants
│   │   └── utils.ts         # Shared helpers (UUID, date formatting)
│   ├── main/                # Main process logic
│   │   ├── db/
│   │   │   ├── database.ts      # SQLite initialization, singleton
│   │   │   └── migrations.ts    # SQL schema / migrations
│   │   ├── repositories/
│   │   │   ├── IDocumentRepository.ts    # Repository interface
│   │   │   └── DocumentRepository.ts     # SQLite implementation
│   │   └── services/
│   │       └── DocumentService.ts        # Business logic layer
│   └── renderer/            # React UI
│       ├── App.tsx
│       ├── electron.d.ts    # Window.electronAPI type declarations
│       ├── components/
│       │   ├── DocumentList/
│       │   │   ├── DocumentList.tsx
│       │   │   └── DocumentListItem.tsx
│       │   ├── DocumentEditor/
│       │   │   ├── DocumentEditor.tsx
│       │   │   └── DocumentEditor.module.css
│       │   ├── VersionHistory/
│       │   │   └── VersionHistory.tsx
│       │   └── StatusBadge/
│       │       └── StatusBadge.tsx
│       ├── hooks/
│       │   └── useDocuments.ts  # IPC data-fetching hook
│       └── pages/
│           ├── DocumentsPage.tsx
│           └── DocumentDetailPage.tsx
├── package.json
├── tsconfig.json
├── electron-vite.config.ts
└── README.md
```

---

## Design Pattern

**You must** implement the **Repository** pattern (a Data Access Object variant):

### Why Repository:
- Encapsulates all SQLite interaction behind an interface
- Makes it trivial to swap the storage engine without touching business logic
- Enables easy unit testing via mock implementations
- Creates a clear boundary between the data layer and the service layer

### Interface (`src/main/repositories/IDocumentRepository.ts`):

```typescript
import { Document, DocumentVersion, CreateDocumentDto, UpdateDocumentDto } from '../../shared/types';

export interface IDocumentRepository {
  findAll(): Document[];
  findById(id: string): Document | undefined;
  create(dto: CreateDocumentDto): Document;
  update(id: string, dto: UpdateDocumentDto): Document;
  delete(id: string): void;
  findVersions(documentId: string): DocumentVersion[];
  getVersionByNumber(documentId: string, version: number): DocumentVersion | undefined;
}
```

### Implementation scaffold (`src/main/repositories/DocumentRepository.ts`):

```typescript
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { IDocumentRepository } from './IDocumentRepository';
import { Document, DocumentVersion, CreateDocumentDto, UpdateDocumentDto } from '../../shared/types';

export class DocumentRepository implements IDocumentRepository {
  constructor(private readonly db: Database.Database) {}

  findAll(): Document[] {
    const stmt = this.db.prepare('SELECT * FROM documents ORDER BY updated_at DESC');
    return stmt.all() as Document[];
  }

  findById(id: string): Document | undefined {
    const stmt = this.db.prepare('SELECT * FROM documents WHERE id = ?');
    return stmt.get(id) as Document | undefined;
  }

  create(dto: CreateDocumentDto): Document {
    const now = new Date().toISOString();
    const doc: Document = {
      id:         uuidv4(),
      title:      dto.title,
      content:    dto.content,
      status:     'DRAFT',
      authorId:   dto.authorId,
      authorName: dto.authorName,
      createdAt:  now,
      updatedAt:  now,
    };
    const stmt = this.db.prepare(`
      INSERT INTO documents (id, title, content, status, author_id, author_name, created_at, updated_at)
      VALUES (@id, @title, @content, @status, @authorId, @authorName, @createdAt, @updatedAt)
    `);
    stmt.run(doc);
    return doc;
  }

  update(id: string, dto: UpdateDocumentDto): Document {
    const existing = this.findById(id);
    if (!existing) throw new Error(`Document not found: ${id}`);

    const now = new Date().toISOString();
    const nextVersion = this.getNextVersionNumber(id);

    const performUpdate = this.db.transaction(() => {
      // Save current state as a new version before overwriting
      const insertVersion = this.db.prepare(`
        INSERT INTO document_versions
          (id, document_id, version_number, content, author_id, author_name, change_note, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertVersion.run(
        uuidv4(), id, nextVersion, existing.content,
        existing.authorId, existing.authorName, dto.changeNote, now
      );

      // Apply the update
      const updateDoc = this.db.prepare(`
        UPDATE documents
        SET title = COALESCE(?, title), content = COALESCE(?, content), updated_at = ?
        WHERE id = ?
      `);
      updateDoc.run(dto.title ?? null, dto.content ?? null, now, id);
    });

    performUpdate();
    return this.findById(id)!;
  }

  delete(id: string): void {
    const stmt = this.db.prepare('DELETE FROM documents WHERE id = ?');
    stmt.run(id);
  }

  findVersions(documentId: string): DocumentVersion[] {
    const stmt = this.db.prepare(`
      SELECT * FROM document_versions
      WHERE document_id = ?
      ORDER BY version_number DESC
    `);
    return stmt.all(documentId) as DocumentVersion[];
  }

  getVersionByNumber(documentId: string, version: number): DocumentVersion | undefined {
    const stmt = this.db.prepare(`
      SELECT * FROM document_versions
      WHERE document_id = ? AND version_number = ?
    `);
    return stmt.get(documentId, version) as DocumentVersion | undefined;
  }

  private getNextVersionNumber(documentId: string): number {
    const stmt = this.db.prepare(`
      SELECT COALESCE(MAX(version_number), 0) + 1 AS next
      FROM document_versions
      WHERE document_id = ?
    `);
    const row = stmt.get(documentId) as { next: number };
    return row.next;
  }
}
```

---

## Database

### SQLite Schema (`src/main/db/migrations.ts`):

```sql
CREATE TABLE IF NOT EXISTS documents (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'DRAFT'
                CHECK(status IN ('DRAFT','PENDING','APPROVED','REJECTED','ARCHIVED')),
  author_id   TEXT NOT NULL,
  author_name TEXT NOT NULL,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS document_versions (
  id              TEXT PRIMARY KEY,
  document_id     TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version_number  INTEGER NOT NULL,
  content         TEXT NOT NULL,
  author_id       TEXT NOT NULL,
  author_name     TEXT NOT NULL,
  change_note     TEXT NOT NULL DEFAULT '',
  created_at      TEXT NOT NULL,
  UNIQUE(document_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_versions_document_id ON document_versions(document_id);
```

### Database singleton (`src/main/db/database.ts`):

```typescript
import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import { runMigrations } from './migrations';

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = path.join(app.getPath('userData'), 'sed_documents.db');
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    runMigrations(db);
  }
  return db;
}

export function closeDatabase(): void {
  db?.close();
  db = null;
}
```

---

## IPC Channels (Electron main ↔ renderer)

Define all channel names as typed constants in `src/shared/ipcChannels.ts` — no magic strings anywhere else:

```typescript
export const IPC = {
  DOCUMENTS: {
    GET_ALL:      'documents:getAll',
    GET_BY_ID:    'documents:getById',
    CREATE:       'documents:create',
    UPDATE:       'documents:update',
    DELETE:       'documents:delete',
    GET_VERSIONS: 'documents:getVersions',
  },
} as const;
```

### Main process handlers (`electron/main.ts`):

```typescript
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { IPC } from '../src/shared/ipcChannels';
import { getDatabase, closeDatabase } from '../src/main/db/database';
import { DocumentRepository } from '../src/main/repositories/DocumentRepository';
import { DocumentService } from '../src/main/services/DocumentService';
import { CreateDocumentDto, UpdateDocumentDto } from '../src/shared/types';

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,       // MUST be false
      contextIsolation: true,       // MUST be true
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

function registerIpcHandlers(): void {
  const db         = getDatabase();
  const repository = new DocumentRepository(db);
  const service    = new DocumentService(repository);

  ipcMain.handle(IPC.DOCUMENTS.GET_ALL,      ()                              => service.getAllDocuments());
  ipcMain.handle(IPC.DOCUMENTS.GET_BY_ID,    (_, id: string)                 => service.getDocumentById(id));
  ipcMain.handle(IPC.DOCUMENTS.CREATE,       (_, dto: CreateDocumentDto)     => service.createDocument(dto));
  ipcMain.handle(IPC.DOCUMENTS.UPDATE,       (_, id: string, dto: UpdateDocumentDto) => service.updateDocument(id, dto));
  ipcMain.handle(IPC.DOCUMENTS.DELETE,       (_, id: string)                 => service.deleteDocument(id));
  ipcMain.handle(IPC.DOCUMENTS.GET_VERSIONS, (_, id: string)                 => service.getDocumentVersions(id));
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
});

app.on('will-quit', () => closeDatabase());
```

### Preload script (`electron/preload.ts`):

```typescript
import { contextBridge, ipcRenderer } from 'electron';
import { IPC } from '../src/shared/ipcChannels';
import { CreateDocumentDto, UpdateDocumentDto } from '../src/shared/types';

contextBridge.exposeInMainWorld('electronAPI', {
  documents: {
    getAll:      ()                                    => ipcRenderer.invoke(IPC.DOCUMENTS.GET_ALL),
    getById:     (id: string)                          => ipcRenderer.invoke(IPC.DOCUMENTS.GET_BY_ID, id),
    create:      (dto: CreateDocumentDto)              => ipcRenderer.invoke(IPC.DOCUMENTS.CREATE, dto),
    update:      (id: string, dto: UpdateDocumentDto)  => ipcRenderer.invoke(IPC.DOCUMENTS.UPDATE, id, dto),
    delete:      (id: string)                          => ipcRenderer.invoke(IPC.DOCUMENTS.DELETE, id),
    getVersions: (id: string)                          => ipcRenderer.invoke(IPC.DOCUMENTS.GET_VERSIONS, id),
  },
});
```

### Window type declaration (`src/renderer/electron.d.ts`):

```typescript
import { Document, DocumentVersion, CreateDocumentDto, UpdateDocumentDto } from '../shared/types';

declare global {
  interface Window {
    electronAPI: {
      documents: {
        getAll():                                         Promise<Document[]>;
        getById(id: string):                              Promise<Document | undefined>;
        create(dto: CreateDocumentDto):                   Promise<Document>;
        update(id: string, dto: UpdateDocumentDto):       Promise<Document>;
        delete(id: string):                               Promise<void>;
        getVersions(id: string):                          Promise<DocumentVersion[]>;
      };
    };
  }
}
```

---

## DocumentService — Business Logic

```typescript
// src/main/services/DocumentService.ts
import { IDocumentRepository } from '../repositories/IDocumentRepository';
import { Document, DocumentVersion, CreateDocumentDto, UpdateDocumentDto } from '../../shared/types';

export class DocumentService {
  constructor(private readonly repository: IDocumentRepository) {}

  getAllDocuments(): Document[] {
    return this.repository.findAll();
  }

  getDocumentById(id: string): Document {
    const doc = this.repository.findById(id);
    if (!doc) throw new Error(`Document not found: ${id}`);
    return doc;
  }

  createDocument(dto: CreateDocumentDto): Document {
    this.validateTitle(dto.title);
    return this.repository.create(dto);
  }

  updateDocument(id: string, dto: UpdateDocumentDto): Document {
    const existing = this.getDocumentById(id);
    if (existing.status !== 'DRAFT') {
      throw new Error('Only DRAFT documents can be edited');
    }
    if (dto.title !== undefined) this.validateTitle(dto.title);
    if (!dto.changeNote.trim()) {
      throw new Error('A change note is required when editing a document');
    }
    return this.repository.update(id, dto);
  }

  deleteDocument(id: string): void {
    const existing = this.getDocumentById(id);
    if (existing.status !== 'DRAFT') {
      throw new Error('Only DRAFT documents can be deleted');
    }
    this.repository.delete(id);
  }

  getDocumentVersions(id: string): DocumentVersion[] {
    this.getDocumentById(id); // verify document exists
    return this.repository.findVersions(id);
  }

  private validateTitle(title: string): void {
    if (!title.trim()) throw new Error('Title cannot be empty');
    if (title.length > 255) throw new Error('Title must be 255 characters or fewer');
  }
}
```

---

## React UI Components

### `useDocuments` hook (`src/renderer/hooks/useDocuments.ts`):

```typescript
import { useState, useEffect, useCallback } from 'react';
import { Document } from '../../shared/types';

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const docs = await window.electronAPI.documents.getAll();
      setDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDocuments(); }, [loadDocuments]);

  return { documents, loading, error, reload: loadDocuments };
}
```

### Component requirements:

**`DocumentList`** — displays all documents:
- Shows: title, status badge (color-coded), author name, creation date
- "New Document" button opens the editor
- Clicking a row navigates to `DocumentDetailPage`
- Filter dropdown to narrow by status

**`DocumentEditor`** — create / edit form:
- `title` field — required, `maxLength=255`
- `content` textarea
- `changeNote` field — required only when editing an existing document
- Save / Cancel buttons
- Client-side validation before submitting

**`DocumentDetailPage`** — full document view:
- Displays all document fields
- Edit and Delete buttons — visible only when `status === 'DRAFT'`
- "Version History" tab with a sortable table of past versions

**`VersionHistory`** — version list:
- Columns: version №, author, date, change note
- Clicking a row shows a read-only view of that version's content

**`StatusBadge`** — color-coded status pill:
```typescript
const STATUS_COLORS: Record<DocStatus, string> = {
  DRAFT:    '#6B7280',  // gray
  PENDING:  '#F59E0B',  // amber
  APPROVED: '#10B981',  // green
  REJECTED: '#EF4444',  // red
  ARCHIVED: '#8B5CF6',  // purple
};
```

---

## Code Quality Requirements

### Clean Code — mandatory rules:
- **Names**: variables and functions use `camelCase`; types and interfaces use `PascalCase`. Names must express intent — `findDocumentById` not `getDoc`, `isValidTitle` not `check`.
- **Functions**: single responsibility, maximum ~20 lines. Extract helpers when a function grows longer.
- **No duplication**: date formatting, UUID generation, and any shared logic lives in `src/shared/utils.ts`.
- **Comments**: only where the code cannot speak for itself (e.g. non-obvious SQL logic). Never comment what the code obviously does.
- **Error handling**: every `window.electronAPI.*` call in the renderer is wrapped in `try/catch`. Errors must be surfaced to the user via UI state, not silently swallowed.

### TypeScript strictness — required `tsconfig.json` flags:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Always use prepared statements — never string interpolation:

```typescript
// CORRECT — prepared statement, safe from SQL injection
const stmt = this.db.prepare('SELECT * FROM documents WHERE id = ?');
return stmt.get(id) as Document | undefined;

// WRONG — never do this
const row = this.db.exec(`SELECT * FROM documents WHERE id = '${id}'`);
```

---

## Git Commit History

Make **at least 5** meaningful commits following the [Conventional Commits](https://www.conventionalcommits.org/) format. Suggested order:

```
feat: init electron-vite project with React and TypeScript

feat: add SQLite database initialization and schema migrations

feat: implement DocumentRepository with CRUD and atomic versioning

feat: add DocumentService with business rules and input validation

feat: implement IPC handlers and contextBridge preload

feat: add DocumentList and DocumentEditor React components

feat: add DocumentDetailPage with version history tab

docs: add README with setup instructions and architecture overview
```

---

## README.md — required content

```markdown
# EDMS — Document Management Module

A desktop application for managing documents in an Electronic Document
Management System. Lab Assignment #3.

## Stack
- Electron 28 + React 18 + TypeScript
- SQLite (better-sqlite3)
- Vite / electron-vite

## Features
- Create, edit, and delete documents
- Automatic versioning on every save — full history preserved
- Browse version history and view content of any past version
- Document status lifecycle: DRAFT → PENDING → APPROVED / REJECTED → ARCHIVED
- Filter document list by status

## Architecture
Three-layer architecture: Presentation (React) → Service → Repository (SQLite).
Design pattern: **Repository** — data access logic is hidden behind an interface,
keeping the service layer storage-agnostic.

## Getting started

### Install dependencies
npm install

### Development mode
npm run dev

### Production build
npm run build

## Project structure
[brief description of each top-level directory]
```

---

## package.json

```json
{
  "name": "sed-document-module",
  "version": "1.0.0",
  "scripts": {
    "dev":   "electron-vite dev",
    "build": "electron-vite build",
    "lint":  "eslint . --ext .ts,.tsx"
  },
  "dependencies": {
    "better-sqlite3": "^9.4.3",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.8",
    "@types/uuid": "^9.0.7",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "electron": "^28.0.0",
    "electron-vite": "^2.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

---

## Seed Data

On first launch, if the `documents` table is empty, automatically insert the following seed records so the UI is not blank:

```typescript
const SEED_DOCUMENTS = [
  {
    title:      'Information Security Policy',
    content:    'This policy establishes requirements for ensuring information security across the organization...',
    status:     'APPROVED' as const,
    authorName: 'Alice Johnson',
    authorId:   'seed-user-1',
  },
  {
    title:      'Contract Approval Procedure',
    content:    'This procedure defines the workflow for reviewing and approving contracts...',
    status:     'PENDING' as const,
    authorName: 'Bob Smith',
    authorId:   'seed-user-2',
  },
  {
    title:      'Organizational Structure Order',
    content:    'In order to improve the organizational structure of the company...',
    status:     'DRAFT' as const,
    authorName: 'Carol Davis',
    authorId:   'seed-user-3',
  },
];
```

---

## Definition of Done

- [ ] `npm run dev` starts the app without errors or TypeScript complaints
- [ ] All CRUD operations work correctly end-to-end
- [ ] Every document update creates a new row in `document_versions` atomically
- [ ] Version history is visible in the UI; selecting a version shows its content
- [ ] Delete is blocked (with a user-facing error) for non-DRAFT documents
- [ ] Edit is blocked (with a user-facing error) for non-DRAFT documents
- [ ] `changeNote` is enforced as required on every edit
- [ ] TypeScript compiles with zero errors under `strict: true`
- [ ] ESLint reports zero errors
- [ ] Git history has at least 5 meaningful Conventional Commits
- [ ] `README.md` covers purpose, stack, setup, and architecture
- [ ] Every SQL query uses a prepared statement — no string interpolation

---

## Critical Notes

1. **Electron security** — when creating `BrowserWindow`, these settings are non-negotiable:
   ```typescript
   webPreferences: {
     nodeIntegration: false,   // never enable this
     contextIsolation: true,   // always required
     preload: path.join(__dirname, 'preload.js'),
   }
   ```

2. **`better-sqlite3` is synchronous** — do not use `async/await` inside `DocumentRepository`. IPC handlers can return values directly; Electron wraps them in a Promise automatically.

3. **UUID generation belongs in the repository** — generate IDs only inside `DocumentRepository.create()`, never in the service layer or the UI.

4. **Always store dates as ISO 8601 strings**: `new Date().toISOString()`. Never store timestamps as Unix integers or locale-formatted strings.

5. **Version creation must be atomic** — use `db.transaction()` in `DocumentRepository.update()` so the document row update and the new version row insert either both succeed or both fail:
   ```typescript
   const performUpdate = this.db.transaction(() => {
     this.insertVersionRow(existingDoc, changeNote);
     this.updateDocumentRow(id, dto, now);
   });
   performUpdate();
   ```
