import { v4 as uuidv4 } from 'uuid';
import { IDocumentRepository } from './IDocumentRepository';
import {
  Document,
  DocumentVersion,
  CreateDocumentDto,
  UpdateDocumentDto,
} from '../../shared/types';
import { SqliteDatabase } from '../db/types';

type Statement<BindParameters extends unknown[], Result = unknown> =
  import('better-sqlite3').Statement<BindParameters, Result>;

type DocumentRow = {
  id: string;
  title: string;
  content: string;
  status: Document['status'];
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
};

type VersionRow = {
  id: string;
  document_id: string;
  version_number: number;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
  change_note: string;
};

type UpdateTransaction = (
  id: string,
  existing: Document,
  dto: UpdateDocumentDto,
  nextVersion: number,
  now: string,
) => void;

function rowToDocument(row: DocumentRow): Document {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    status: row.status,
    authorId: row.author_id,
    authorName: row.author_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToVersion(row: VersionRow): DocumentVersion {
  return {
    id: row.id,
    documentId: row.document_id,
    versionNumber: row.version_number,
    content: row.content,
    authorId: row.author_id,
    authorName: row.author_name,
    createdAt: row.created_at,
    changeNote: row.change_note,
  };
}

export class DocumentRepository implements IDocumentRepository {
  private readonly findAllStatement: Statement<[], DocumentRow>;
  private readonly findByIdStatement: Statement<[string], DocumentRow>;
  private readonly insertDocumentStatement: Statement<
    [string, string, string, Document['status'], string, string, string, string]
  >;
  private readonly insertVersionStatement: Statement<
    [string, string, number, string, string, string, string, string]
  >;
  private readonly updateTitleStatement: Statement<[string, string, string]>;
  private readonly updateContentStatement: Statement<[string, string, string]>;
  private readonly touchDocumentStatement: Statement<[string, string]>;
  private readonly deleteStatement: Statement<[string]>;
  private readonly findVersionsStatement: Statement<[string], VersionRow>;
  private readonly getVersionByNumberStatement: Statement<
    [string, number],
    VersionRow
  >;
  private readonly getNextVersionStatement: Statement<[string], { next: number }>;
  private readonly performUpdate: UpdateTransaction;

  constructor(private readonly db: SqliteDatabase) {
    this.findAllStatement = this.db.prepare<[], DocumentRow>(
      'SELECT * FROM documents ORDER BY updated_at DESC',
    );
    this.findByIdStatement = this.db.prepare<[string], DocumentRow>(
      'SELECT * FROM documents WHERE id = ?',
    );
    this.insertDocumentStatement = this.db.prepare<
      [string, string, string, Document['status'], string, string, string, string]
    >(`
      INSERT INTO documents (id, title, content, status, author_id, author_name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    this.insertVersionStatement = this.db.prepare<
      [string, string, number, string, string, string, string, string]
    >(`
      INSERT INTO document_versions (id, document_id, version_number, content, author_id, author_name, change_note, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    this.updateTitleStatement = this.db.prepare<[string, string, string]>(
      'UPDATE documents SET title = ?, updated_at = ? WHERE id = ?',
    );
    this.updateContentStatement = this.db.prepare<[string, string, string]>(
      'UPDATE documents SET content = ?, updated_at = ? WHERE id = ?',
    );
    this.touchDocumentStatement = this.db.prepare<[string, string]>(
      'UPDATE documents SET updated_at = ? WHERE id = ?',
    );
    this.deleteStatement = this.db.prepare<[string]>(
      'DELETE FROM documents WHERE id = ?',
    );
    this.findVersionsStatement = this.db.prepare<[string], VersionRow>(
      'SELECT * FROM document_versions WHERE document_id = ? ORDER BY version_number DESC',
    );
    this.getVersionByNumberStatement = this.db.prepare<
      [string, number],
      VersionRow
    >(
      'SELECT * FROM document_versions WHERE document_id = ? AND version_number = ?',
    );
    this.getNextVersionStatement = this.db.prepare<[string], { next: number }>(
      'SELECT COALESCE(MAX(version_number), 0) + 1 AS next FROM document_versions WHERE document_id = ?',
    );
    this.performUpdate = this.db.transaction(
      (
        id: string,
        existing: Document,
        dto: UpdateDocumentDto,
        nextVersion: number,
        now: string,
      ) => {
        this.insertVersionStatement.run(
          uuidv4(),
          id,
          nextVersion,
          existing.content,
          existing.authorId,
          existing.authorName,
          dto.changeNote,
          now,
        );

        if (dto.title !== undefined) {
          this.updateTitleStatement.run(dto.title, now, id);
        }
        if (dto.content !== undefined) {
          this.updateContentStatement.run(dto.content, now, id);
        }
        if (dto.title === undefined && dto.content === undefined) {
          this.touchDocumentStatement.run(now, id);
        }
      },
    );
  }

  findAll(): Document[] {
    const rows = this.findAllStatement.all();
    return rows.map(rowToDocument);
  }

  findById(id: string): Document | undefined {
    const row = this.findByIdStatement.get(id);
    return row ? rowToDocument(row) : undefined;
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

    this.insertDocumentStatement.run(
      doc.id,
      doc.title,
      doc.content,
      doc.status,
      doc.authorId,
      doc.authorName,
      doc.createdAt,
      doc.updatedAt,
    );
    return doc;
  }

  update(id: string, dto: UpdateDocumentDto): Document {
    const existing = this.findById(id);
    if (!existing) throw new Error(`Document not found: ${id}`);

    const now = new Date().toISOString();
    const nextVersion = this.getNextVersionNumber(id);

    this.performUpdate(id, existing, dto, nextVersion, now);

    return this.findById(id)!;
  }

  delete(id: string): void {
    this.deleteStatement.run(id);
  }

  findVersions(documentId: string): DocumentVersion[] {
    const rows = this.findVersionsStatement.all(documentId);
    return rows.map(rowToVersion);
  }

  getVersionByNumber(
    documentId: string,
    version: number,
  ): DocumentVersion | undefined {
    const row = this.getVersionByNumberStatement.get(documentId, version);
    return row ? rowToVersion(row) : undefined;
  }

  private getNextVersionNumber(documentId: string): number {
    const row = this.getNextVersionStatement.get(documentId);
    return row?.next ?? 1;
  }
}
