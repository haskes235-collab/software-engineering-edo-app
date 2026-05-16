import { useCallback, useEffect, useState } from 'react';
import { CreateDocumentDto, Document, DocumentVersion, UpdateDocumentDto } from '@shared/types';
import { formatDateTime } from '@shared/utils';
import { DocumentEditor } from '../components/DocumentEditor/DocumentEditor';
import { StatusBadge } from '../components/StatusBadge/StatusBadge';
import { VersionHistory } from '../components/VersionHistory/VersionHistory';

interface DocumentDetailPageProps {
  documentId: string;
}

export function DocumentDetailPage({ documentId }: DocumentDetailPageProps) {
  const [document, setDocument] = useState<Document | null>(null);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);

  const loadDocumentData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const loadedDocument = await window.electronAPI.documents.getById(documentId);
      if (!loadedDocument) {
        throw new Error('Документ не найден');
      }
      const loadedVersions = await window.electronAPI.documents.getVersions(documentId);
      setDocument(loadedDocument);
      setVersions(loadedVersions);
      setSelectedVersion((currentVersion) => {
        if (!currentVersion) return loadedVersions[0] ?? null;
        return loadedVersions.find((version) => version.id === currentVersion.id) ?? loadedVersions[0] ?? null;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    void loadDocumentData();
  }, [loadDocumentData]);

  const handleDelete = async () => {
    if (!document) return;
    if (!window.confirm(`Удалить документ "${document.title}"?`)) return;

    try {
      await window.electronAPI.documents.delete(documentId);
      window.location.hash = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить документ');
    }
  };

  const handleSaveDocument = async (dto: CreateDocumentDto | UpdateDocumentDto) => {
    if (!('changeNote' in dto)) return;
    await window.electronAPI.documents.update(documentId, dto);
    await loadDocumentData();
    setIsEditDialogOpen(false);
  };

  if (loading) {
    return <div className="page-state">Загрузка документа...</div>;
  }

  if (error || !document) {
    return <div className="page-state page-state--error">Ошибка: {error ?? 'Документ не найден'}</div>;
  }

  const isDraft = document.status === 'DRAFT';

  return (
    <div className="page-shell">
      <section className="page-hero">
        <div>
          <p className="page-hero__eyebrow">Карточка документа</p>
          <h1>{document.title}</h1>
          <p className="page-hero__subtitle">
            Полный просмотр документа с метаданными, историей версий и действиями для черновика.
          </p>
        </div>

        <div className="hero-metrics">
          <div className="hero-metric">
            <div className="hero-metric__label">Статус</div>
            <div className="hero-metric__value">{document.status}</div>
          </div>
          <div className="hero-metric">
            <div className="hero-metric__label">Версии</div>
            <div className="hero-metric__value">{versions.length}</div>
          </div>
          <div className="hero-metric">
            <div className="hero-metric__label">Автор</div>
            <div className="hero-metric__value">{document.authorName}</div>
          </div>
        </div>
      </section>

      <section className="surface-panel">
        <div className="toolbar-row">
          <button
            className="ghost-button"
            type="button"
            onClick={() => {
              window.location.hash = '/';
            }}
          >
            Назад к списку
          </button>

          {isDraft && (
            <div className="document-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setIsEditDialogOpen(true)}
              >
                Редактировать
              </button>
              <button className="danger-button" type="button" onClick={handleDelete}>
                Удалить
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="detail-grid">
        <div className="detail-stack">
          <section className="surface-panel detail-card">
            <div className="detail-card__header">
              <div className="detail-card__title">
                <h2>Общие сведения</h2>
                <StatusBadge status={document.status} />
              </div>
              <div className="detail-meta-grid">
                <div>
                  <span className="detail-meta-grid__label">Автор</span>
                  <strong>{document.authorName}</strong>
                </div>
                <div>
                  <span className="detail-meta-grid__label">Создан</span>
                  <strong>{formatDateTime(document.createdAt)}</strong>
                </div>
                <div>
                  <span className="detail-meta-grid__label">Обновлён</span>
                  <strong>{formatDateTime(document.updatedAt)}</strong>
                </div>
              </div>
            </div>

            <div className="detail-card__body">
              <h3>Содержание</h3>
              <div className="document-content-block">
                <pre>{document.content || 'Содержимое пока отсутствует.'}</pre>
              </div>
            </div>
          </section>

          <section className="surface-panel detail-card">
            <div className="detail-card__header">
              <div className="detail-card__title">
                <h2>История версий</h2>
              </div>
            </div>

            <div className="detail-card__body">
              <VersionHistory
                versions={versions}
                onVersionClick={(version) => setSelectedVersion(version)}
              />
            </div>
          </section>
        </div>

        <aside className="surface-panel detail-card version-preview">
          <div className="detail-card__header">
            <div className="detail-card__title">
              <h2>Просмотр версии</h2>
            </div>
          </div>

          <div className="detail-card__body">
            {selectedVersion ? (
              <>
                <div className="version-preview__meta">
                  <strong>v{selectedVersion.versionNumber}</strong>
                  <span>{selectedVersion.authorName}</span>
                  <span>{formatDateTime(selectedVersion.createdAt)}</span>
                </div>
                <div className="version-preview__note">
                  {selectedVersion.changeNote || 'Комментарий к изменениям отсутствует.'}
                </div>
                <div className="document-content-block">
                  <pre>{selectedVersion.content}</pre>
                </div>
              </>
            ) : (
              <div className="page-state">Выберите строку версии, чтобы посмотреть её содержимое.</div>
            )}
          </div>
        </aside>
      </div>

      {isEditDialogOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setIsEditDialogOpen(false)}
        >
          <div
            className="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Редактирование документа"
            onClick={(event) => event.stopPropagation()}
          >
            <DocumentEditor
              document={document}
              onSave={handleSaveDocument}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
