export type DocStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
export type UserRole = 'EMPLOYEE' | 'MANAGER' | 'ADMINISTRATOR';
export type ApprovalAction = 'SUBMIT' | 'APPROVE' | 'REJECT';

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

export interface ApprovalActor {
  id: string;
  name: string;
  role: UserRole;
}

export interface ApprovalComment {
  text: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface ApprovalResult {
  document: Document;
  action: ApprovalAction;
  previousStatus: DocStatus;
  nextStatus: DocStatus;
  comment?: ApprovalComment;
}
