import { useState } from 'react';
import { Document, DocStatus } from '@shared/types';
import { DocumentListItem } from './DocumentListItem';
import './DocumentList.css';

interface DocumentListProps {
  documents: Document[];
  loading: boolean;
  error: string | null;
  onDocumentClick: (id: string) => void;
  onNewDocument: () => void;
}

const ALL_STATUSES: DocStatus[] = ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED'];

export function DocumentList({
  documents,
  loading,
  error,
  onDocumentClick,
  onNewDocument,
}: DocumentListProps) {
  const [statusFilter, setStatusFilter] = useState<DocStatus | 'ALL'>('ALL');

  const filteredDocuments = statusFilter === 'ALL'
    ? documents
    : documents.filter((doc) => doc.status === statusFilter);

  if (loading) {
    return <div className="loading">Loading documents...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div>
      <div className="document-list-actions">
        <button className="new-document-btn" onClick={onNewDocument}>
          New Document
        </button>
      </div>

      <div className="filter-container">
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as DocStatus | 'ALL')}
        >
          <option value="ALL">All statuses</option>
          {ALL_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="empty">No documents found</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Author</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc) => (
              <DocumentListItem
                key={doc.id}
                document={doc}
                onClick={() => onDocumentClick(doc.id)}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}