import { useState } from 'react';
import { Document, DocStatus } from '@shared/types';
import { DocumentListItem } from './DocumentListItem';
import './DocumentList.css';

interface DocumentListProps {
  documents: Document[];
  loading: boolean;
  error: string | null;
  onDocumentClick: (id: string) => void;
}

const ALL_STATUSES: DocStatus[] = ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED'];

export function DocumentList({
  documents,
  loading,
  error,
  onDocumentClick,
}: DocumentListProps) {
  const [statusFilter, setStatusFilter] = useState<DocStatus | 'ALL'>('ALL');

  const filteredDocuments = statusFilter === 'ALL'
    ? documents
    : documents.filter((document) => document.status === statusFilter);

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
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as DocStatus | 'ALL')}
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
}
