import { useState } from 'react';
import { CreateDocumentDto } from '@shared/types';
import { DocumentEditor } from '../components/DocumentEditor/DocumentEditor';
import { DocumentList } from '../components/DocumentList/DocumentList';
import { useDocuments } from '../hooks/useDocuments';

function countDrafts(total: ReturnType<typeof useDocuments>['documents']) {
  return total.filter((document) => document.status === 'DRAFT').length;
}

export function DocumentsPage() {
  const { documents, loading, error, reload } = useDocuments();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleDocumentClick = (id: string) => {
    window.location.hash = `/document/${id}`;
  };

  const handleCreateDocument = async (dto: CreateDocumentDto) => {
    await window.electronAPI.documents.create(dto);
    await reload();
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="page-shell">
      <section className="page-hero">
        <div>
          <p className="page-hero__eyebrow">Рабочая область СЭД</p>
          <h1>Реестр документов</h1>
          <p className="page-hero__subtitle">
            Просматривайте документы, фильтруйте их по статусу и открывайте карточку
            документа, не теряя контекст основной страницы.
          </p>
        </div>

        <div className="hero-metrics">
          <div className="hero-metric">
            <div className="hero-metric__label">Всего</div>
            <div className="hero-metric__value">{documents.length}</div>
          </div>
          <div className="hero-metric">
            <div className="hero-metric__label">Черновики</div>
            <div className="hero-metric__value">{countDrafts(documents)}</div>
          </div>
          <div className="hero-metric">
            <div className="hero-metric__label">Состояние</div>
            <div className="hero-metric__value">{loading ? '...' : 'Актуально'}</div>
          </div>
        </div>
      </section>

      <section className="surface-panel">
        <div className="toolbar-row">
          <div className="toolbar-row__meta">
            Список документов, фильтр по статусу и создание нового документа через диалоговое окно.
          </div>
        </div>

        <DocumentList
          documents={documents}
          loading={loading}
          error={error}
          onDocumentClick={handleDocumentClick}
        />
      </section>

      {isCreateDialogOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setIsCreateDialogOpen(false)}
        >
          <div
            className="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Создание документа"
            onClick={(event) => event.stopPropagation()}
          >
            <DocumentEditor
              onSave={handleCreateDocument}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
