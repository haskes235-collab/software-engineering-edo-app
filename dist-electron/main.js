var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path$1 from "node:path";
import BetterSqlite3 from "better-sqlite3";
import path from "path";
import crypto from "crypto";
const IPC = {
  DOCUMENTS: {
    GET_ALL: "documents:getAll",
    GET_BY_ID: "documents:getById",
    CREATE: "documents:create",
    UPDATE: "documents:update",
    DELETE: "documents:delete",
    GET_VERSIONS: "documents:getVersions"
  }
};
const rnds8Pool = new Uint8Array(256);
let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}
const native = {
  randomUUID: crypto.randomUUID
};
function v4(options, buf, offset) {
  if (native.randomUUID && true && !options) {
    return native.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  return unsafeStringify(rnds);
}
const SEED_DOCUMENTS = [
  {
    title: "Information Security Policy",
    content: "This policy establishes requirements for ensuring information security across the organization...",
    status: "APPROVED",
    authorName: "Alice Johnson",
    authorId: "seed-user-1"
  },
  {
    title: "Contract Approval Procedure",
    content: "This procedure defines the workflow for reviewing and approving contracts...",
    status: "PENDING",
    authorName: "Bob Smith",
    authorId: "seed-user-2"
  },
  {
    title: "Organizational Structure Order",
    content: "In order to improve the organizational structure of the company...",
    status: "DRAFT",
    authorName: "Carol Davis",
    authorId: "seed-user-3"
  }
];
function runMigrations(db2) {
  db2.exec(`
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
  db2.exec(`
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
  db2.exec("CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status)");
  db2.exec(
    "CREATE INDEX IF NOT EXISTS idx_versions_document_id ON document_versions(document_id)"
  );
  const result = db2.prepare("SELECT COUNT(*) as count FROM documents").get();
  const count = (result == null ? void 0 : result.count) ?? 0;
  if (count === 0) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const insertDocument = db2.prepare(`
      INSERT INTO documents (id, title, content, status, author_id, author_name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const doc of SEED_DOCUMENTS) {
      insertDocument.run(
        v4(),
        doc.title,
        doc.content,
        doc.status,
        doc.authorId,
        doc.authorName,
        now,
        now
      );
    }
  }
}
let db = null;
async function initDatabase() {
  if (db) return db;
  const dbPath = path.join(app.getPath("userData"), "sed_documents.db");
  db = new BetterSqlite3(dbPath);
  db.pragma("foreign_keys = ON");
  db.pragma("journal_mode = WAL");
  runMigrations(db);
  return db;
}
function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
function rowToDocument(row) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    status: row.status,
    authorId: row.author_id,
    authorName: row.author_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
function rowToVersion(row) {
  return {
    id: row.id,
    documentId: row.document_id,
    versionNumber: row.version_number,
    content: row.content,
    authorId: row.author_id,
    authorName: row.author_name,
    createdAt: row.created_at,
    changeNote: row.change_note
  };
}
class DocumentRepository {
  constructor(db2) {
    __publicField(this, "findAllStatement");
    __publicField(this, "findByIdStatement");
    __publicField(this, "insertDocumentStatement");
    __publicField(this, "insertVersionStatement");
    __publicField(this, "updateTitleStatement");
    __publicField(this, "updateContentStatement");
    __publicField(this, "updateStatusStatement");
    __publicField(this, "touchDocumentStatement");
    __publicField(this, "deleteStatement");
    __publicField(this, "findVersionsStatement");
    __publicField(this, "getVersionByNumberStatement");
    __publicField(this, "getNextVersionStatement");
    __publicField(this, "performUpdate");
    this.db = db2;
    this.findAllStatement = this.db.prepare(
      "SELECT * FROM documents ORDER BY updated_at DESC"
    );
    this.findByIdStatement = this.db.prepare(
      "SELECT * FROM documents WHERE id = ?"
    );
    this.insertDocumentStatement = this.db.prepare(`
      INSERT INTO documents (id, title, content, status, author_id, author_name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    this.insertVersionStatement = this.db.prepare(`
      INSERT INTO document_versions (id, document_id, version_number, content, author_id, author_name, change_note, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    this.updateTitleStatement = this.db.prepare(
      "UPDATE documents SET title = ?, updated_at = ? WHERE id = ?"
    );
    this.updateContentStatement = this.db.prepare(
      "UPDATE documents SET content = ?, updated_at = ? WHERE id = ?"
    );
    this.updateStatusStatement = this.db.prepare("UPDATE documents SET status = ?, updated_at = ? WHERE id = ?");
    this.touchDocumentStatement = this.db.prepare(
      "UPDATE documents SET updated_at = ? WHERE id = ?"
    );
    this.deleteStatement = this.db.prepare(
      "DELETE FROM documents WHERE id = ?"
    );
    this.findVersionsStatement = this.db.prepare(
      "SELECT * FROM document_versions WHERE document_id = ? ORDER BY version_number DESC"
    );
    this.getVersionByNumberStatement = this.db.prepare(
      "SELECT * FROM document_versions WHERE document_id = ? AND version_number = ?"
    );
    this.getNextVersionStatement = this.db.prepare(
      "SELECT COALESCE(MAX(version_number), 0) + 1 AS next FROM document_versions WHERE document_id = ?"
    );
    this.performUpdate = this.db.transaction(
      (id, existing, dto, nextVersion, now) => {
        this.insertVersionStatement.run(
          v4(),
          id,
          nextVersion,
          existing.content,
          existing.authorId,
          existing.authorName,
          dto.changeNote,
          now
        );
        if (dto.title !== void 0) {
          this.updateTitleStatement.run(dto.title, now, id);
        }
        if (dto.content !== void 0) {
          this.updateContentStatement.run(dto.content, now, id);
        }
        if (dto.title === void 0 && dto.content === void 0) {
          this.touchDocumentStatement.run(now, id);
        }
      }
    );
  }
  findAll() {
    const rows = this.findAllStatement.all();
    return rows.map(rowToDocument);
  }
  findById(id) {
    const row = this.findByIdStatement.get(id);
    return row ? rowToDocument(row) : void 0;
  }
  create(dto) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const doc = {
      id: v4(),
      title: dto.title,
      content: dto.content,
      status: "DRAFT",
      authorId: dto.authorId,
      authorName: dto.authorName,
      createdAt: now,
      updatedAt: now
    };
    this.insertDocumentStatement.run(
      doc.id,
      doc.title,
      doc.content,
      doc.status,
      doc.authorId,
      doc.authorName,
      doc.createdAt,
      doc.updatedAt
    );
    return doc;
  }
  update(id, dto) {
    const existing = this.findById(id);
    if (!existing) throw new Error(`Document not found: ${id}`);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const nextVersion = this.getNextVersionNumber(id);
    this.performUpdate(id, existing, dto, nextVersion, now);
    return this.findById(id);
  }
  updateStatus(id, status, changeNote) {
    const existing = this.findById(id);
    if (!existing) throw new Error(`Document not found: ${id}`);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const nextVersion = this.getNextVersionNumber(id);
    this.insertVersionStatement.run(
      v4(),
      id,
      nextVersion,
      existing.content,
      existing.authorId,
      existing.authorName,
      changeNote,
      now
    );
    this.updateStatusStatement.run(status, now, id);
    return this.findById(id);
  }
  delete(id) {
    this.deleteStatement.run(id);
  }
  findVersions(documentId) {
    const rows = this.findVersionsStatement.all(documentId);
    return rows.map(rowToVersion);
  }
  getVersionByNumber(documentId, version) {
    const row = this.getVersionByNumberStatement.get(documentId, version);
    return row ? rowToVersion(row) : void 0;
  }
  getNextVersionNumber(documentId) {
    const row = this.getNextVersionStatement.get(documentId);
    return (row == null ? void 0 : row.next) ?? 1;
  }
}
class DocumentService {
  constructor(repository) {
    this.repository = repository;
  }
  getAllDocuments() {
    return this.repository.findAll();
  }
  getDocumentById(id) {
    const doc = this.repository.findById(id);
    if (!doc) throw new Error(`Document not found: ${id}`);
    return doc;
  }
  createDocument(dto) {
    this.validateTitle(dto.title);
    return this.repository.create(dto);
  }
  updateDocument(id, dto) {
    const existing = this.getDocumentById(id);
    if (existing.status !== "DRAFT") {
      throw new Error("Only DRAFT documents can be edited");
    }
    if (dto.title !== void 0) this.validateTitle(dto.title);
    if (!dto.changeNote.trim()) {
      throw new Error("A change note is required when editing a document");
    }
    return this.repository.update(id, dto);
  }
  deleteDocument(id) {
    const existing = this.getDocumentById(id);
    if (existing.status !== "DRAFT") {
      throw new Error("Only DRAFT documents can be deleted");
    }
    this.repository.delete(id);
  }
  getDocumentVersions(id) {
    this.getDocumentById(id);
    return this.repository.findVersions(id);
  }
  validateTitle(title) {
    if (!title.trim()) throw new Error("Title cannot be empty");
    if (title.length > 255) throw new Error("Title must be 255 characters or fewer");
  }
}
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path$1.dirname(__filename$1);
process.env.APP_ROOT = path$1.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path$1.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path$1.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path$1.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path$1.join(__dirname$1, "preload.mjs")
    },
    autoHideMenuBar: true
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path$1.join(RENDERER_DIST, "index.html"));
  }
}
async function registerIpcHandlers() {
  const db2 = await initDatabase();
  const repository = new DocumentRepository(db2);
  const service = new DocumentService(repository);
  ipcMain.handle(IPC.DOCUMENTS.GET_ALL, () => service.getAllDocuments());
  ipcMain.handle(
    IPC.DOCUMENTS.GET_BY_ID,
    (_, id) => service.getDocumentById(id)
  );
  ipcMain.handle(
    IPC.DOCUMENTS.CREATE,
    (_, dto) => service.createDocument(dto)
  );
  ipcMain.handle(
    IPC.DOCUMENTS.UPDATE,
    (_, id, dto) => service.updateDocument(id, dto)
  );
  ipcMain.handle(
    IPC.DOCUMENTS.DELETE,
    (_, id) => service.deleteDocument(id)
  );
  ipcMain.handle(
    IPC.DOCUMENTS.GET_VERSIONS,
    (_, id) => service.getDocumentVersions(id)
  );
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(async () => {
  await registerIpcHandlers();
  createWindow();
});
app.on("will-quit", () => closeDatabase());
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
