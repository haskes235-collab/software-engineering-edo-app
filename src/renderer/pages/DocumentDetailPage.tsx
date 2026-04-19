import { useState, useEffect } from 'react';
import { Document, DocumentVersion, CreateDocumentDto, UpdateDocumentDto } from '@shared/types';
import { StatusBadge } from '../components/StatusBadge/StatusBadge';
import { DocumentEditor } from '../components/DocumentEditor/DocumentEditor';
import { VersionHistory } from '../components/VersionHistory/VersionHistory';
import { formatDateTime } from '@shared/utils';

type ViewMode = 'view' | 'edit' | 'versionContent';

interface DocumentDetailPageProps {
  documentId: string;
}

export function DocumentDetailPage({ documentId }: DocumentDetailPageProps) {
  const [document, setDocument] = useState<Document | null>(null);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('view');
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);

  useEffect(() => {
    loadDocument();
  }, [documentId]);

  const loadDocument = async () => {
    setLoading(true);
    setError(null);
    try {
      const doc = await window.electronAPI.documents.getById(documentId);
      if (!doc) {
        setError('Document not found');
        return;
      }
      setDocument(doc);

      const vers = await window.electronAPI.documents.getVersions(documentId);
      setVersions(vers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setViewMode('edit');
  };

  const handleDelete = async () => {
    if (!document) return;
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      await window.electronAPI.documents.delete(documentId);
      window.location.hash = '#/';
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleSaveDocument = async (dto: UpdateDocumentDto | CreateDocumentDto) => {
    if ('changeNote' in dto) {
      await window.electronAPI.documents.update(documentId, dto);
    }
    await loadDocument();
    setViewMode('view');
  };

  const handleCancel = () => {
    setViewMode('view');
  };

  const handleVersionClick = (version: DocumentVersion) => {
    setSelectedVersion(version);
    setViewMode('versionContent');
  };

  if (loading) {
    return <div className="loading">Loading document...</div>;
  }

  if (error || !document) {
    return <div className="error">Error: {error || 'Document not found'}</div>;
  }

  const isDraft = document.status === 'DRAFT';

  return (
    <div className="document-detail-page">
      {viewMode === 'edit' ? (
        <DocumentEditor
          document={document}
          onSave={handleSaveDocument}
          onCancel={handleCancel}
        />
      ) : viewMode === 'versionContent' && selectedVersion ? (
        <div className="version-content-viewer">
          <div className="version-content-header">
            <button onClick={() => setViewMode('view')}>Back to Document</button>
            <h2>Version {selectedVersion.versionNumber}</h2>
            <p className="version-meta">
              By {selectedVersion.authorName} on {formatDateTime(selectedVersion.createdAt)}
            </p>
            {selectedVersion.changeNote && (
              <p className="version-note">Change note: {selectedVersion.changeNote}</p>
            )}
          </div>
          <div className="version-content-body">
            <pre>{selectedVersion.content}</pre>
          </div>
        </div>
      ) : (
        <>
          <div className="document-header">
            <div>
              <h1>{document.title}</h1>
              <div className="document-meta">
                <StatusBadge status={document.status} />
                <span>By {document.authorName}</span>
                <span>Created: {formatDateTime(document.createdAt)}</span>
                <span>Updated: {formatDateTime(document.updatedAt)}</span>
              </div>
            </div>
            {isDraft && (
              <div className="document-actions">
                <button className="edit-btn" onClick={handleEdit}>
                  Edit
                </button>
                <button className="delete-btn" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="document-content">
            <h2>Content</h2>
            <pre>{document.content}</pre>
          </div>

          <VersionHistory versions={versions} onVersionClick={handleVersionClick} />
        </>
      )}
    </div>
  );
}