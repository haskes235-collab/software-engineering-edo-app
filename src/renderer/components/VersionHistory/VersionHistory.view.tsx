import { observer } from 'mobx-react-lite';
import { DocumentVersion } from '@shared/types';
import { formatDateTime } from '@shared/utils';
import { VersionHistoryController } from './VersionHistory.controller';
import './VersionHistory.css';

interface VersionHistoryViewProps {
  controller: VersionHistoryController;
  onVersionClick: (version: DocumentVersion) => void;
}

export const VersionHistoryView = observer(function VersionHistoryView({
  controller,
  onVersionClick,
}: VersionHistoryViewProps) {
  if (controller.sortedVersions.length === 0) {
    return <div className="version-history-empty">Версий пока нет</div>;
  }

  return (
    <div className="version-history">
      <div className="version-history-header">
        <h3>История версий</h3>
        <button
          className="sort-btn"
          onClick={() => controller.toggleSortOrder()}
        >
          Сортировка: {controller.sortOrder === 'desc' ? 'Сначала новые' : 'Сначала старые'}
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
            {controller.sortedVersions.map((version) => (
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
});
