import { observer } from 'mobx-react-lite';
import { formatDateTime } from '@shared/utils';
import { DocumentVersionComparisonController } from './DocumentVersionComparison.controller';
import './DocumentVersionComparison.css';

interface DocumentVersionComparisonViewProps {
  controller: DocumentVersionComparisonController;
  onRestoreVersion: (versionNumber: number) => Promise<void> | void;
}

function renderLineText(text: string): string {
  return text.length > 0 ? text : '\u00A0';
}

function renderPane(
  title: string,
  side: 'left' | 'right',
  rows: readonly {
    kind: string;
    leftLineNumber: number | null;
    rightLineNumber: number | null;
    leftText: string;
    rightText: string;
  }[],
) {
  return (
    <section className="version-comparison__pane">
      <div className="version-comparison__pane-header">{title}</div>
      <div className="version-comparison__pane-body">
        {rows.map((row, index) => {
          const lineNumber = side === 'left' ? row.leftLineNumber : row.rightLineNumber;
          const text = side === 'left' ? row.leftText : row.rightText;

          return (
            <div
              key={`${side}-${row.kind}-${index}`}
              className={[
                'version-comparison__line',
                `version-comparison__line--${row.kind}`,
                lineNumber === null ? 'version-comparison__line--empty' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="version-comparison__line-number">{lineNumber ?? ' '}</span>
              <span className="version-comparison__line-text">{renderLineText(text)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export const DocumentVersionComparisonView = observer(
  function DocumentVersionComparisonView({
    controller,
    onRestoreVersion,
  }: DocumentVersionComparisonViewProps) {
    if (!controller.currentDocument || !controller.selectedVersion) {
      return (
        <div className="version-comparison__empty">
          Выберите версию, чтобы сравнить её с текущим документом.
        </div>
      );
    }

    const { currentDocument, selectedVersion, rows, summary, hasDifferences } = controller;
    const canRestore = currentDocument.status === 'DRAFT';

    return (
      <>
        <section className="surface-panel detail-card version-comparison version-comparison--compact">
          <div className="detail-card__header">
            <div className="detail-card__title">
              <h2>Сравнение версий</h2>
            </div>

            <div className="version-comparison__summary">
              <span className="version-comparison__badge version-comparison__badge--neutral">
                Совпало: {summary.equalLines}
              </span>
              <span className="version-comparison__badge version-comparison__badge--added">
                Добавлено: {summary.addedLines}
              </span>
              <span className="version-comparison__badge version-comparison__badge--removed">
                Удалено: {summary.removedLines}
              </span>
              <span className="version-comparison__badge version-comparison__badge--modified">
                Изменено: {summary.modifiedLines}
              </span>
            </div>

            <div className="version-comparison__actions">
              <button
                type="button"
                className="secondary-button version-comparison__details-button"
                onClick={() => controller.openDetails()}
              >
                Просмотр деталей
              </button>
            </div>

            {!hasDifferences && (
              <div className="version-comparison__notice">
                Содержимое версии и текущего документа совпадает.
              </div>
            )}
          </div>
        </section>

        {controller.isDetailsOpen && (
          <div
            className="modal-backdrop"
            role="presentation"
            onClick={() => controller.closeDetails()}
          >
            <div
              className="modal-panel modal-panel--comparison"
              role="dialog"
              aria-modal="true"
              aria-label="Подробное сравнение версий"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="version-comparison__dialog">
                <div className="version-comparison__dialog-header">
                  <div>
                    <h2>Side-by-side просмотр</h2>
                    <p>
                      {selectedVersion.authorName} · {formatDateTime(selectedVersion.createdAt)}
                    </p>
                  </div>

                  <div className="version-comparison__dialog-actions">
                    {canRestore && (
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() => void onRestoreVersion(selectedVersion.versionNumber)}
                      >
                        Восстановить версию
                      </button>
                    )}
                    <button
                      type="button"
                      className="ghost-button version-comparison__close-button"
                      onClick={() => controller.closeDetails()}
                    >
                      Закрыть
                    </button>
                  </div>
                </div>

                <div className="version-comparison__note">
                  {selectedVersion.changeNote || 'Комментарий к изменениям отсутствует.'}
                </div>

                {!canRestore && (
                  <div className="version-comparison__notice">
                    Восстановление доступно только для черновика.
                  </div>
                )}

                <div className="version-comparison__split">
                  {renderPane('Выбранная версия', 'left', rows)}
                  {renderPane('Текущий документ', 'right', rows)}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  },
);
