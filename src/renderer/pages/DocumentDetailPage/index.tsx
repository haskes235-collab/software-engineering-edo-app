import { useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { DocumentDetailPageController } from './DocumentDetailPage.controller';
import { DocumentDetailPageView } from './DocumentDetailPage.view';

interface DocumentDetailPageProps {
  documentId: string;
}

export function DocumentDetailPage({ documentId }: DocumentDetailPageProps) {
  const controller = useLocalObservable(() => new DocumentDetailPageController(documentId));

  useEffect(() => {
    void controller.loadDocumentData();
  }, [controller, documentId]);

  return <DocumentDetailPageView controller={controller} />;
}
