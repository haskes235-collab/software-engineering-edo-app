import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { describe, expect, it } from 'vitest';
import { DocStatus, Document, DocumentVersion } from '../../../shared/types';
import * as schema from '../../db/schema';
import { documentVersions, documents } from '../../db/schema';
import { DocumentRepository } from './DocumentRepository';

class FakeDrizzleDb {
  document: Document & { currentVersionId: string | null; deletedAt: string | null };
  versions: DocumentVersion[];

  constructor(status: DocStatus, versionNumbers: number[]) {
    this.document = {
      id: 'document-1',
      title: 'Approval document',
      content: 'Current content',
      status,
      authorId: 'author-1',
      authorName: 'Author',
      currentVersionId: null,
      createdAt: '2026-06-01T00:00:00.000Z',
      updatedAt: '2026-06-01T00:00:00.000Z',
      deletedAt: null,
    };
    this.versions = versionNumbers.map((versionNumber) => ({
      id: `version-${versionNumber}`,
      documentId: this.document.id,
      versionNumber,
      content: `Version ${versionNumber} content`,
      authorId: this.document.authorId,
      authorName: this.document.authorName,
      createdAt: this.document.createdAt,
      changeNote: `Version ${versionNumber}`,
    }));
  }

  select(selection?: Record<string, unknown>) {
    return new FakeSelectBuilder(this, selection);
  }

  transaction<T>(callback: (tx: FakeDrizzleDb) => T): T {
    return callback(this);
  }

  insert(table: unknown) {
    return {
      values: (value: DocumentVersion) => ({
        run: () => {
          if (table !== documentVersions) return;

          const alreadyExists = this.versions.some(
            (version) =>
              version.documentId === value.documentId &&
              version.versionNumber === value.versionNumber,
          );
          if (alreadyExists) {
            throw new Error(
              'UNIQUE constraint failed: document_versions.document_id, document_versions.version_number',
            );
          }

          this.versions.push(value);
        },
      }),
    };
  }

  update(table: unknown) {
    return {
      set: (updates: Partial<typeof this.document>) => ({
        where: () => ({
          run: () => {
            if (table === documents) {
              this.document = { ...this.document, ...updates };
            }
          },
        }),
      }),
    };
  }
}

class FakeSelectBuilder {
  private table: unknown;

  constructor(
    private readonly db: FakeDrizzleDb,
    private readonly selection?: Record<string, unknown>,
  ) {}

  from(table: unknown): this {
    this.table = table;
    return this;
  }

  where(): this {
    return this;
  }

  get() {
    if (this.table === documents) {
      return this.db.document;
    }

    if (this.table === documentVersions) {
      const maxVersion = Math.max(0, ...this.db.versions.map((version) => version.versionNumber));
      if (this.selection && 'next' in this.selection) {
        return { next: maxVersion + 1 };
      }

      return {
        max: this.db.versions[0]?.versionNumber ?? 0,
      };
    }

    return undefined;
  }
}

function createRepository(db: FakeDrizzleDb): DocumentRepository {
  return new DocumentRepository(
    db as unknown as BetterSQLite3Database<typeof schema>,
  );
}

describe('DocumentRepository version history', () => {
  it('uses max version number plus one when approving a document with existing history', () => {
    const db = new FakeDrizzleDb('PENDING', [1, 2]);
    const repository = createRepository(db);

    const result = repository.updateStatus('document-1', 'APPROVED', 'Approved in workflow');

    expect(result.status).toBe('APPROVED');
    expect(db.versions.map((version) => version.versionNumber)).toEqual([1, 2, 3]);
    expect(db.versions.at(-1)?.changeNote).toBe('Approved in workflow');
  });

  it('uses max version number plus one when rejecting a document with existing history', () => {
    const db = new FakeDrizzleDb('PENDING', [1, 2]);
    const repository = createRepository(db);

    const result = repository.updateStatus('document-1', 'REJECTED', 'Rejected in workflow');

    expect(result.status).toBe('REJECTED');
    expect(db.versions.map((version) => version.versionNumber)).toEqual([1, 2, 3]);
    expect(db.versions.at(-1)?.changeNote).toBe('Rejected in workflow');
  });
});
