import { makeAutoObservable } from 'mobx';
import { Document, DocumentVersion } from '@shared/types';
import { buildSideBySideRows, summarizeRows, type ComparisonRow, type ComparisonSummary } from './comparison';

export class DocumentVersionComparisonController {
  currentDocument: Document | null = null;
  selectedVersion: DocumentVersion | null = null;
  isDetailsOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  setContext(currentDocument: Document | null, selectedVersion: DocumentVersion | null): void {
    this.currentDocument = currentDocument;
    this.selectedVersion = selectedVersion;
  }

  openDetails(): void {
    this.isDetailsOpen = true;
  }

  closeDetails(): void {
    this.isDetailsOpen = false;
  }

  get canCompare(): boolean {
    return Boolean(this.currentDocument && this.selectedVersion);
  }

  get rows(): readonly ComparisonRow[] {
    if (!this.canCompare) return [];

    return buildSideBySideRows(
      this.selectedVersion!.content,
      this.currentDocument!.content,
    );
  }

  get summary(): ComparisonSummary {
    return summarizeRows(this.rows);
  }

  get hasDifferences(): boolean {
    return this.summary.addedLines + this.summary.removedLines + this.summary.modifiedLines > 0;
  }
}
