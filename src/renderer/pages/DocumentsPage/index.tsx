import { useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { DocumentsPageController } from './DocumentsPage.controller';
import { DocumentsPageView } from './DocumentsPage.view';

export function DocumentsPage() {
  const controller = useLocalObservable(() => new DocumentsPageController());

  useEffect(() => {
    void controller.loadDocuments();
  }, [controller]);

  return <DocumentsPageView controller={controller} />;
}
