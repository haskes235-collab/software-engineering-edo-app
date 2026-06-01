import { makeAutoObservable } from 'mobx';
import { Document, CreateDocumentDto, UpdateDocumentDto } from '@shared/types';
import { documentRepository } from '../../repositories/DocumentRepository';
import { routerController } from '../../controllers/RouterController';

export class DocumentsPageController {
  loading = false;
  error: string | null = null;

  documents: readonly Document[] = [];
  isCreateDialogOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  get draftCount(): number {
    return this.documents.filter((doc) => doc.status === 'DRAFT').length;
  }

  async loadDocuments(): Promise<void> {
    this.setLoading(true);
    this.setError(null);
    try {
      this.documents = await documentRepository.getAll();
    } catch (err) {
      this.setError(this.extractErrorMessage(err));
    } finally {
      this.setLoading(false);
    }
  }

  openCreateDialog(): void {
    this.isCreateDialogOpen = true;
  }

  closeCreateDialog(): void {
    this.isCreateDialogOpen = false;
  }

  async createDocument(dto: CreateDocumentDto | UpdateDocumentDto): Promise<void> {
    if (!('authorId' in dto)) return;
    await documentRepository.create(dto as CreateDocumentDto);
    this.closeCreateDialog();
    await this.loadDocuments();
  }

  navigateToDetail(id: string): void {
    routerController.navigateToDetail(id);
  }

  private setLoading(value: boolean): void {
    this.loading = value;
  }

  private setError(error: string | null): void {
    this.error = error;
  }

  private extractErrorMessage(err: unknown): string {
    return err instanceof Error ? err.message : 'Неизвестная ошибка';
  }
}