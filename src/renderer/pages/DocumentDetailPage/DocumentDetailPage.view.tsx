import { observer } from 'mobx-react-lite';
import { formatDateTime } from '@shared/utils';
import { DocumentDetailPageController } from './DocumentDetailPage.controller';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import { VersionHistory } from '../../components/VersionHistory';
import { DocumentEditor } from '../../components/DocumentEditor';
import { DocumentVersionComparison } from '../../components/DocumentVersionComparison';

interface DocumentDetailPageViewProps {
  controller: DocumentDetailPageController;
}

export const DocumentDetailPageView = observer(function DocumentDetailPageView({
  controller,
}: DocumentDetailPageViewProps) {
  if (controller.loading) {
    return <div className="page-state">Загрузка документа...</div>;
  }

  if (controller.error || !controller.document) {
    return (
      <div className="page-state page-state--error">
        Ошибка: {controller.error ?? 'Документ не найден'}
      </div>
    );
  }

  const document = controller.document;

  return (
    <div className="page-shell">
      <section className="page-hero">
        <div>
          <p className="page-hero__eyebrow">Карточка документа</p>
          <h1>{document.title}</h1>
          <p className="page-hero__subtitle">
            Полный просмотр документа с метаданными, историей версий, действиями для черновика и
            сравнением выбранной версии с текущим содержимым.
          </p>
        </div>

        <div className="hero-metrics">
          <div className="hero-metric">
            <div className="hero-metric__label">Статус</div>
            <div className="hero-metric__value">{document.status}</div>
          </div>
          <div className="hero-metric">
            <div className="hero-metric__label">Версии</div>
            <div className="hero-metric__value">{controller.versions.length}</div>
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
            onClick={() => controller.navigateToList()}
          >
            Назад к списку
          </button>

          {controller.isDraft && (
            <div className="document-actions flex gap-4">
              <button
                className="secondary-button"
                type="button"
                onClick={() => controller.openEditDialog()}
              >
                Редактировать
              </button>
              <button className="danger-button" type="button" onClick={() => controller.deleteDocument()}>
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
                versions={controller.versions}
                onVersionClick={(version) => controller.selectVersion(version)}
              />
            </div>
          </section>
        </div>

        <DocumentVersionComparison
          currentDocument={controller.document}
          selectedVersion={controller.selectedVersion}
        />
      </div>

      {controller.isEditDialogOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => controller.closeEditDialog()}
        >
          <div
            className="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Редактирование документа"
            onClick={(event) => event.stopPropagation()}
          >
            <DocumentEditor
              document={controller.document}
              onSave={(dto) => controller.saveDocument(dto)}
              onCancel={() => controller.closeEditDialog()}
            />
          </div>
        </div>
      )}
    </div>
  );
});
