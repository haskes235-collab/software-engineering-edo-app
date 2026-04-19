import { Document } from '@shared/types';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import { formatDate } from '@shared/utils';
import './DocumentList.css';

interface DocumentListItemProps {
  document: Document;
  onClick: () => void;
}

export function DocumentListItem({ document, onClick }: DocumentListItemProps) {
  return (
    <tr className="document-list-item" onClick={onClick}>
      <td>{document.title}</td>
      <td>
        <StatusBadge status={document.status} />
      </td>
      <td>{document.authorName}</td>
      <td>{formatDate(document.createdAt)}</td>
    </tr>
  );
}