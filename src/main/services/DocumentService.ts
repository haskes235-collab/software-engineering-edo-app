import { IDocumentRepository } from '@main/repositories/documentRepository/IDocumentRepository';
import {
  Document,
  DocumentVersion,
  CreateDocumentDto,
  UpdateDocumentDto,
} from '../../shared/types';

export class DocumentService {
  constructor(private readonly repository: IDocumentRepository) {}

  getAllDocuments(): Document[] {
    return this.repository.findAll();
  }

  getDocumentById(id: string): Document {
    const doc = this.repository.findById(id);
    if (!doc) throw new Error(`Document not found: ${id}`);
    return doc;
  }

  createDocument(dto: CreateDocumentDto): Document {
    this.validateTitle(dto.title);
    return this.repository.create(dto);
  }

  updateDocument(id: string, dto: UpdateDocumentDto): Document {
    const existing = this.getDocumentById(id);
    if (existing.status !== 'DRAFT') {
      throw new Error('Only DRAFT documents can be edited');
    }
    if (dto.title !== undefined) this.validateTitle(dto.title);
    if (!dto.changeNote.trim()) {
      throw new Error('A change note is required when editing a document');
    }
    return this.repository.update(id, dto);
  }

  deleteDocument(id: string): void {
    const existing = this.getDocumentById(id);
    if (existing.status !== 'DRAFT') {
      throw new Error('Only DRAFT documents can be deleted');
    }
    this.repository.delete(id);
  }

  getDocumentVersions(id: string): DocumentVersion[] {
    this.getDocumentById(id);
    return this.repository.findVersions(id);
  }

  private validateTitle(title: string): void {
    if (!title.trim()) throw new Error('Title cannot be empty');
    if (title.length > 255) throw new Error('Title must be 255 characters or fewer');
  }
}