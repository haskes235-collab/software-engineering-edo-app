import { Document, DocumentVersion, CreateDocumentDto, UpdateDocumentDto } from '../shared/types';

declare global {
  interface Window {
    electronAPI: {
      documents: {
        getAll(): Promise<Document[]>;
        getById(id: string): Promise<Document | undefined>;
        create(dto: CreateDocumentDto): Promise<Document>;
        update(id: string, dto: UpdateDocumentDto): Promise<Document>;
        delete(id: string): Promise<void>;
        getVersions(id: string): Promise<DocumentVersion[]>;
      };
    };
  }
}