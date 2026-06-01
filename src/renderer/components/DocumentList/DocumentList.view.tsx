import { observer } from 'mobx-react-lite';
import { DocStatus } from '@shared/types';
import { DocumentListController } from './DocumentList.controller';
import { DocumentListItem } from './DocumentListItem';
import './DocumentList.css';

const ALL_STATUSES: DocStatus[] = ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED'];

interface DocumentListViewProps {
  controller: DocumentListController;
  loading: boolean;
  error: string | null;
  onDocumentClick: (id: string) => void;
}

export const DocumentListView = observer(function DocumentListView({
  controller,
  loading,
  error,
  onDocumentClick,
}: DocumentListViewProps) {
  const filteredDocuments = controller.filteredDocuments;

  if (loading) {
    return <div className="loading">Загрузка документов...</div>;
  }

  if (error) {
    return <div className="error">Ошибка: {error}</div>;
  }

  return (
    <div className="document-list">
      <div className="document-list-controls">
        <div className="document-list-summary">
          Найдено документов: {filteredDocuments.length}
        </div>
        <select
          className="filter-select"
          value={controller.statusFilter}
          onChange={(event) => controller.setStatusFilter(event.target.value as DocStatus | 'ALL')}
        >
          <option value="ALL">Все статусы</option>
          {ALL_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="empty">Документы не найдены</div>
      ) : (
        <div className="list-table-shell">
          <table className="document-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Статус</th>
                <th>Автор</th>
                <th>Создан</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((document) => (
                <DocumentListItem
                  key={document.id}
                  document={document}
                  onClick={() => onDocumentClick(document.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});
