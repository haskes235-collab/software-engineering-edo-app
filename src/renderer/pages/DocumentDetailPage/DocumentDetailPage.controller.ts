import { makeAutoObservable } from 'mobx';
import { Document, DocumentVersion, CreateDocumentDto, UpdateDocumentDto } from '@shared/types';
import { documentRepository } from '../../repositories/DocumentRepository';
import { routerController } from '../../controllers/RouterController';

export class DocumentDetailPageController {
  loading = false;
  error: string | null = null;

  document: Document | null = null;
  versions: readonly DocumentVersion[] = [];
  selectedVersion: DocumentVersion | null = null;
  isEditDialogOpen = false;

  private documentId: string;

  constructor(documentId: string) {
    this.documentId = documentId;
    makeAutoObservable(this);
  }

  get isDraft(): boolean {
    return this.document?.status === 'DRAFT';
  }

  async loadDocumentData(): Promise<void> {
    this.setLoading(true);
    this.setError(null);

    try {
      const loadedDocument = await documentRepository.getById(this.documentId);
      if (!loadedDocument) {
        throw new Error('Документ не найден');
      }
      const loadedVersions = await documentRepository.getVersions(this.documentId);
      this.document = loadedDocument;
      this.versions = loadedVersions;

      if (this.selectedVersion) {
        const stillExists = loadedVersions.find((v) => v.id === this.selectedVersion!.id);
        this.selectedVersion = stillExists ?? loadedVersions[0] ?? null;
      } else {
        this.selectedVersion = loadedVersions[0] ?? null;
      }
    } catch (err) {
      this.setError(this.extractErrorMessage(err));
    } finally {
      this.setLoading(false);
    }
  }

  async deleteDocument(): Promise<void> {
    if (!this.document) return;
    if (!window.confirm(`Удалить документ "${this.document.title}"?`)) return;

    try {
      await documentRepository.delete(this.documentId);
      routerController.navigateToList();
    } catch (err) {
      this.setError(this.extractErrorMessage(err));
    }
  }

  async saveDocument(dto: CreateDocumentDto | UpdateDocumentDto): Promise<void> {
    if (!('changeNote' in dto)) return;
    await documentRepository.update(this.documentId, dto);
    this.closeEditDialog();
    await this.loadDocumentData();
  }

  async restoreDocumentVersion(versionNumber: number): Promise<void> {
    if (!this.document) return;
    if (!window.confirm(`Восстановить версию v${versionNumber} для документа "${this.document.title}"?`)) {
      return;
    }

    try {
      await documentRepository.restoreVersion(this.documentId, versionNumber);
      await this.loadDocumentData();
    } catch (err) {
      this.setError(this.extractErrorMessage(err));
    }
  }

  openEditDialog(): void {
    this.isEditDialogOpen = true;
  }

  closeEditDialog(): void {
    this.isEditDialogOpen = false;
  }

  selectVersion(version: DocumentVersion): void {
    this.selectedVersion = version;
  }

  navigateToList(): void {
    routerController.navigateToList();
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
