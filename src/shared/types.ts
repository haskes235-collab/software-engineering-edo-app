export type DocStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';

export interface Document {
  id: string;
  title: string;
  content: string;
  status: DocStatus;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
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
  changeNote: string;
}