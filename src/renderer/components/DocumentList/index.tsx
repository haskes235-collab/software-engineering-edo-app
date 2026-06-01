import { useLocalObservable } from 'mobx-react-lite';
import { Document } from '@shared/types';
import { DocumentListController } from './DocumentList.controller';
import { DocumentListView } from './DocumentList.view';

interface DocumentListProps {
  documents: readonly Document[];
  loading: boolean;
  error: string | null;
  onDocumentClick: (id: string) => void;
}

export function DocumentList({ documents, loading, error, onDocumentClick }: DocumentListProps) {
  const controller = useLocalObservable(() => new DocumentListController());
  controller.setDocuments(documents);

  return (
    <DocumentListView
      controller={controller}
      loading={loading}
      error={error}
      onDocumentClick={onDocumentClick}
    />
  );
}
