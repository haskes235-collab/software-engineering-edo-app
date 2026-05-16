import { useState } from 'react';
import { DocumentVersion } from '@shared/types';
import { formatDateTime } from '@shared/utils';
import './VersionHistory.css';

interface VersionHistoryProps {
  versions: DocumentVersion[];
  onVersionClick: (version: DocumentVersion) => void;
}

export function VersionHistory({ versions, onVersionClick }: VersionHistoryProps) {
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const sortedVersions = [...versions].sort((a, b) => {
    return sortOrder === 'desc'
      ? b.versionNumber - a.versionNumber
      : a.versionNumber - b.versionNumber;
  });

  if (versions.length === 0) {
    return <div className="version-history-empty">Версий пока нет</div>;
  }

  return (
    <div className="version-history">
      <div className="version-history-header">
        <h3>История версий</h3>
        <button
          className="sort-btn"
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
        >
          Сортировка: {sortOrder === 'desc' ? 'Сначала новые' : 'Сначала старые'}
        </button>
      </div>

      <div className="version-table-shell">
        <table className="version-table">
          <thead>
            <tr>
              <th>Версия</th>
              <th>Автор</th>
              <th>Дата</th>
              <th>Комментарий</th>
            </tr>
          </thead>
          <tbody>
            {sortedVersions.map((version) => (
              <tr
                key={version.id}
                className="version-row"
                onClick={() => onVersionClick(version)}
              >
                <td>v{version.versionNumber}</td>
                <td>{version.authorName}</td>
                <td>{formatDateTime(version.createdAt)}</td>
                <td>{version.changeNote || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
