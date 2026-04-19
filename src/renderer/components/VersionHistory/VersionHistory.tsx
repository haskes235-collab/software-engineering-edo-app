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
    return <div className="version-history-empty">No versions yet</div>;
  }

  return (
    <div className="version-history">
      <div className="version-history-header">
        <h3>Version History</h3>
        <button
          className="sort-btn"
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
        >
          Sort: {sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Version</th>
            <th>Author</th>
            <th>Date</th>
            <th>Change Note</th>
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

      <div className="version-viewer">
        <h4>Select a version to view its content</h4>
      </div>
    </div>
  );
}