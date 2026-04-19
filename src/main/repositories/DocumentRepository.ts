import { Database as SqlJsDatabase } from 'sql.js';
import { v4 as uuidv4 } from 'uuid';
import { IDocumentRepository } from './IDocumentRepository';
import {
  Document,
  DocumentVersion,
  CreateDocumentDto,
  UpdateDocumentDto,
} from '../../shared/types';
import { saveDatabase } from '../db/database';

function rowToDocument(columns: string[], values: unknown[]): Document {
  const row: Record<string, unknown> = {};
  columns.forEach((col, i) => {
    row[col] = values[i];
  });
  return {
    id: row['id'] as string,
    title: row['title'] as string,
    content: row['content'] as string,
    status: row['status'] as Document['status'],
    authorId: row['author_id'] as string,
    authorName: row['author_name'] as string,
    createdAt: row['created_at'] as string,
    updatedAt: row['updated_at'] as string,
  };
}

function rowToVersion(columns: string[], values: unknown[]): DocumentVersion {
  const row: Record<string, unknown> = {};
  columns.forEach((col, i) => {
    row[col] = values[i];
  });
  return {
    id: row['id'] as string,
    documentId: row['document_id'] as string,
    versionNumber: row['version_number'] as number,
    content: row['content'] as string,
    authorId: row['author_id'] as string,
    authorName: row['author_name'] as string,
    createdAt: row['created_at'] as string,
    changeNote: row['change_note'] as string,
  };
}

export class DocumentRepository implements IDocumentRepository {
  constructor(private readonly db: SqlJsDatabase) {}

  findAll(): Document[] {
    const result = this.db.exec(
      'SELECT * FROM documents ORDER BY updated_at DESC',
    );
    if (!result.length) return [];
    const { columns, values } = result[0];
    return values.map((row: unknown[]) => rowToDocument(columns, row));
  }

  findById(id: string): Document | undefined {
    const stmt = this.db.prepare('SELECT * FROM documents WHERE id = ?');
    stmt.bind([id]);
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return rowToDocument(
        Object.keys(row),
        Object.values(row),
      );
    }
    stmt.free();
    return undefined;
  }

  create(dto: CreateDocumentDto): Document {
    const now = new Date().toISOString();
    const doc: Document = {
      id: uuidv4(),
      title: dto.title,
      content: dto.content,
      status: 'DRAFT',
      authorId: dto.authorId,
      authorName: dto.authorName,
      createdAt: now,
      updatedAt: now,
    };

    this.db.run(
      `INSERT INTO documents (id, title, content, status, author_id, author_name, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [doc.id, doc.title, doc.content, doc.status, doc.authorId, doc.authorName, doc.createdAt, doc.updatedAt],
    );
    saveDatabase();
    return doc;
  }

  update(id: string, dto: UpdateDocumentDto): Document {
    const existing = this.findById(id);
    if (!existing) throw new Error(`Document not found: ${id}`);

    const now = new Date().toISOString();
    const nextVersion = this.getNextVersionNumber(id);

    try {
      this.db.run('BEGIN EXCLUSIVE');

      this.db.run(
        `INSERT INTO document_versions (id, document_id, version_number, content, author_id, author_name, change_note, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [uuidv4(), id, nextVersion, existing.content, existing.authorId, existing.authorName, dto.changeNote, now],
      );

      if (dto.title !== undefined) {
        this.db.run('UPDATE documents SET title = ?, updated_at = ? WHERE id = ?', [dto.title, now, id]);
      }
      if (dto.content !== undefined) {
        this.db.run('UPDATE documents SET content = ?, updated_at = ? WHERE id = ?', [dto.content, now, id]);
      }
      if (dto.title === undefined && dto.content === undefined) {
        this.db.run('UPDATE documents SET updated_at = ? WHERE id = ?', [now, id]);
      }

      this.db.run('COMMIT');
      saveDatabase();
    } catch (e) {
      this.db.run('ROLLBACK');
      throw e;
    }

    return this.findById(id)!;
  }

  delete(id: string): void {
    this.db.run('DELETE FROM documents WHERE id = ?', [id]);
    saveDatabase();
  }

  findVersions(documentId: string): DocumentVersion[] {
    const stmt = this.db.prepare(
      `SELECT * FROM document_versions WHERE document_id = ? ORDER BY version_number DESC`,
    );
    stmt.bind([documentId]);
    const versions: DocumentVersion[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      versions.push(rowToVersion(Object.keys(row), Object.values(row)));
    }
    stmt.free();
    return versions;
  }

  getVersionByNumber(
    documentId: string,
    version: number,
  ): DocumentVersion | undefined {
    const stmt = this.db.prepare(
      'SELECT * FROM document_versions WHERE document_id = ? AND version_number = ?',
    );
    stmt.bind([documentId, version]);
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return rowToVersion(
        Object.keys(row),
        Object.values(row),
      );
    }
    stmt.free();
    return undefined;
  }

  private getNextVersionNumber(documentId: string): number {
    const stmt = this.db.prepare(
      `SELECT COALESCE(MAX(version_number), 0) + 1 AS next FROM document_versions WHERE document_id = ?`,
    );
    stmt.bind([documentId]);
    stmt.step();
    const row = stmt.getAsObject() as { next: number };
    stmt.free();
    return row.next;
  }
}