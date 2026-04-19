import { useState } from 'react';
import { Document } from '@shared/types';
import { DocumentList } from '../components/DocumentList/DocumentList';
import { DocumentEditor } from '../components/DocumentEditor/DocumentEditor';
import { CreateDocumentDto, UpdateDocumentDto } from '@shared/types';

type View = 'list' | 'create';

export function DocumentsPage() {
  const [view, setView] = useState<View>('list');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const docs = await window.electronAPI.documents.getAll();
      setDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentClick = (id: string) => {
    window.location.hash = `#/document/${id}`;
  };

  const handleNewDocument = () => {
    setView('create');
  };

  const handleSaveDocument = async (dto: CreateDocumentDto | UpdateDocumentDto) => {
    await window.electronAPI.documents.create(dto as CreateDocumentDto);
    await loadDocuments();
    setView('list');
  };

  const handleCancel = () => {
    setView('list');
  };

  return (
    <div className="documents-page">
      <h1>Documents</h1>
      {view === 'list' ? (
        <DocumentList
          documents={documents}
          loading={loading}
          error={error}
          onDocumentClick={handleDocumentClick}
          onNewDocument={handleNewDocument}
        />
      ) : (
        <DocumentEditor onSave={handleSaveDocument} onCancel={handleCancel} />
      )}
    </div>
  );
}