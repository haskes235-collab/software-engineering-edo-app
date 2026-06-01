import {
  Document,
  DocumentVersion,
  CreateDocumentDto,
  UpdateDocumentDto,
} from '../../shared/types';

export interface IDocumentRepository {
  findAll(): Document[];
  findById(id: string): Document | undefined;
  create(dto: CreateDocumentDto): Document;
  update(id: string, dto: UpdateDocumentDto): Document;
  updateStatus(id: string, status: Document['status'], changeNote: string): Document;
  delete(id: string): void;
  findVersions(documentId: string): DocumentVersion[];
  getVersionByNumber(
    documentId: string,
    version: number,
  ): DocumentVersion | undefined;
}
