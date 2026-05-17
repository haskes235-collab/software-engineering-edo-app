import { BaseRepository } from '../bases/BaseRepository';
import { Document, DocumentVersion, CreateDocumentDto, UpdateDocumentDto } from '@shared/types';

export class DocumentRepository extends BaseRepository<Document> {
  async getAll(): Promise<readonly Document[]> {
    return window.electronAPI.documents.getAll();
  }

  async getById(id: string): Promise<Document | undefined> {
    return window.electronAPI.documents.getById(id);
  }

  async create(dto: CreateDocumentDto): Promise<Document> {
    return window.electronAPI.documents.create(dto);
  }

  async update(id: string, dto: UpdateDocumentDto): Promise<Document> {
    return window.electronAPI.documents.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    return window.electronAPI.documents.delete(id);
  }

  async getVersions(documentId: string): Promise<readonly DocumentVersion[]> {
    return window.electronAPI.documents.getVersions(documentId);
  }
}

export const documentRepository = new DocumentRepository();
