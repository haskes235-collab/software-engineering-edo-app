import { makeAutoObservable } from 'mobx';
import { DocumentVersion } from '@shared/types';

export class VersionHistoryController {
  sortOrder: 'desc' | 'asc' = 'desc';
  allVersions: readonly DocumentVersion[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setVersions(versions: readonly DocumentVersion[]): void {
    this.allVersions = versions;
  }

  get sortedVersions(): readonly DocumentVersion[] {
    return [...this.allVersions].sort((a, b) => {
      return this.sortOrder === 'desc'
        ? b.versionNumber - a.versionNumber
        : a.versionNumber - b.versionNumber;
    });
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
  }
}
