import { useLocalObservable } from 'mobx-react-lite';
import { Document, CreateDocumentDto, UpdateDocumentDto } from '@shared/types';
import { DocumentEditorController } from './DocumentEditor.controller';
import { DocumentEditorView } from './DocumentEditor.view';

interface DocumentEditorProps {
  document?: Document;
  onSave: (dto: CreateDocumentDto | UpdateDocumentDto) => Promise<void>;
  onCancel: () => void;
}

export function DocumentEditor({ document, onSave, onCancel }: DocumentEditorProps) {
  const controller = useLocalObservable(() => new DocumentEditorController(document));

  return <DocumentEditorView controller={controller} onSave={onSave} onCancel={onCancel} />;
}
