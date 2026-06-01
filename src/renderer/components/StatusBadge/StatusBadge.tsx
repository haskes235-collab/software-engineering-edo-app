import { DocStatus } from '@shared/types';
import './StatusBadge.css';

const STATUS_COLORS: Record<DocStatus, string> = {
  DRAFT: '#6B7280',
  PENDING: '#F59E0B',
  APPROVED: '#10B981',
  REJECTED: '#EF4444',
  ARCHIVED: '#8B5CF6',
};

interface StatusBadgeProps {
  status: DocStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className="status-badge"
      style={{ backgroundColor: STATUS_COLORS[status] }}
    >
      {status}
    </span>
  );
}