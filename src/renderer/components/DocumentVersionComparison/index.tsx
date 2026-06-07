import { useLocalObservable } from 'mobx-react-lite';
import { Document, DocumentVersion } from '@shared/types';
import { DocumentVersionComparisonController } from './DocumentVersionComparison.controller';
import { DocumentVersionComparisonView } from './DocumentVersionComparison.view';

interface DocumentVersionComparisonProps {
  currentDocument: Document | null;
  selectedVersion: DocumentVersion | null;
}

export function DocumentVersionComparison({
  currentDocument,
  selectedVersion,
}: DocumentVersionComparisonProps) {
  const controller = useLocalObservable(() => new DocumentVersionComparisonController());
  controller.setContext(currentDocument, selectedVersion);

  return <DocumentVersionComparisonView controller={controller} />;
}
