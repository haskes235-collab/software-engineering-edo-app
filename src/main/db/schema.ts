import { sqliteTable, text, integer, blob, index, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { InferSelectModel, relations, sql } from 'drizzle-orm'

export type DbDocument = InferSelectModel<typeof documents>;
export type DbDocumentVersion = InferSelectModel<typeof documentVersions>;

export const documents = sqliteTable('documents', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull().default(''),
  status: text('status', {
    enum: ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED']
  }).notNull().default('DRAFT'),
  authorId: text('author_id').notNull(),
  authorName: text('author_name').notNull(),
  currentVersionId: text('current_version_id'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
  deletedAt: text('deleted_at'),
}, (table) => [
  index('idx_documents_status').on(table.status),
  index('idx_doc_deleted').on(table.deletedAt),
])

export const documentVersions = sqliteTable('document_versions', {
  id: text('id').primaryKey(),
  documentId: text('document_id').notNull().references(() => documents.id),
  versionNumber: integer('version_number').notNull(),
  content: text('content').notNull(),
  authorId: text('author_id').notNull(),
  authorName: text('author_name').notNull(),
  changeNote: text('change_note').notNull().default(''),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
}, (table) => [
  index('idx_versions_document_id').on(table.documentId),
  uniqueIndex('idx_versions_doc_vnum').on(table.documentId, table.versionNumber),
])

export const documentsRelations = relations(documents, ({ many, one }) => ({
  versions: many(documentVersions),
  currentVersion: one(documentVersions, {
    fields: [documents.currentVersionId],
    references: [documentVersions.id],
  }),
}))

export const documentVersionsRelations = relations(documentVersions, ({ one }) => ({
  document: one(documents, {
    fields: [documentVersions.documentId],
    references: [documents.id],
  }),
}))
