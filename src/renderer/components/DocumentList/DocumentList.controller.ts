import { makeAutoObservable } from 'mobx';
import { Document, DocStatus } from '@shared/types';

export class DocumentListController {
  statusFilter: DocStatus | 'ALL' = 'ALL';
  allDocuments: readonly Document[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setDocuments(documents: readonly Document[]): void {
    this.allDocuments = documents;
  }

  get filteredDocuments(): readonly Document[] {
    if (this.statusFilter === 'ALL') return this.allDocuments;
    return this.allDocuments.filter((doc) => doc.status === this.statusFilter);
  }

  setStatusFilter(value: DocStatus | 'ALL'): void {
    this.statusFilter = value;
  }
}
