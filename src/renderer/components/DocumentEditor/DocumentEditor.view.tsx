import { observer } from 'mobx-react-lite';
import { DocumentEditorController } from './DocumentEditor.controller';
import { CreateDocumentDto, UpdateDocumentDto } from '@shared/types';
import './DocumentEditor.css';

interface DocumentEditorViewProps {
  controller: DocumentEditorController;
  onSave: (dto: CreateDocumentDto | UpdateDocumentDto) => Promise<void>;
  onCancel: () => void;
}

export const DocumentEditorView = observer(function DocumentEditorView({
  controller,
  onSave,
  onCancel,
}: DocumentEditorViewProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void controller.submit(onSave);
  };

  return (
    <section className="document-editor">
      <div className="document-editor__header">
        <div>
          <p className="document-editor__eyebrow">
            {controller.isEditing ? 'Редактирование черновика' : 'Создание черновика'}
          </p>
          <h2>{controller.isEditing ? 'Изменение документа' : 'Новый документ'}</h2>
          <p className="document-editor__subtitle">
            {controller.isEditing
              ? 'Обновите содержимое документа и опишите изменение для истории версий.'
              : 'Создайте новый черновик, не покидая текущую рабочую область.'}
          </p>
        </div>
        <button className="ghost-button" type="button" onClick={onCancel} disabled={controller.saving}>
          Закрыть
        </button>
      </div>

      <form className="document-editor__form" onSubmit={handleSubmit}>
        {controller.validationErrors.length > 0 && (
          <div className="editor-alert editor-alert--error">
            {controller.validationErrors.map((validationError) => (
              <div key={validationError}>{validationError}</div>
            ))}
          </div>
        )}

        {controller.error && <div className="editor-alert editor-alert--error">{controller.error}</div>}

        <div className="editor-field">
          <label htmlFor="title">Название</label>
          <input
            id="title"
            type="text"
            value={controller.title}
            onChange={(event) => controller.setTitle(event.target.value)}
            maxLength={255}
            placeholder="Введите название документа"
            required
          />
        </div>

        <div className="editor-field">
          <label htmlFor="content">Содержание</label>
          <textarea
            id="content"
            value={controller.content}
            onChange={(event) => controller.setContent(event.target.value)}
            rows={14}
            placeholder="Введите текст документа"
          />
        </div>

        {controller.isEditing && (
          <div className="editor-field">
            <label htmlFor="changeNote">Комментарий к изменению</label>
            <input
              id="changeNote"
              type="text"
              value={controller.changeNote}
              onChange={(event) => controller.setChangeNote(event.target.value)}
              placeholder="Опишите, что изменилось"
              required
            />
          </div>
        )}

        <div className="document-editor__actions">
          <button className="secondary-button" type="button" onClick={onCancel} disabled={controller.saving}>
            Отмена
          </button>
          <button className="primary-button" type="submit" disabled={controller.saving}>
            {controller.saving ? 'Сохранение...' : controller.isEditing ? 'Сохранить изменения' : 'Создать документ'}
          </button>
        </div>
      </form>
    </section>
  );
});
