import { useState } from 'react';
import { CreateDocumentDto, Document, UpdateDocumentDto } from '@shared/types';
import './DocumentEditor.css';

interface DocumentEditorProps {
  document?: Document;
  onSave: (dto: CreateDocumentDto | UpdateDocumentDto) => Promise<void>;
  onCancel: () => void;
}

function buildValidationErrors(title: string, changeNote: string, isEditing: boolean) {
  const errors: string[] = [];
  if (!title.trim()) errors.push('Поле "Название" обязательно.');
  if (title.length > 255) errors.push('Название должно содержать не более 255 символов.');
  if (isEditing && !changeNote.trim()) errors.push('При редактировании нужно указать комментарий к изменению.');
  return errors;
}

export function DocumentEditor({ document, onSave, onCancel }: DocumentEditorProps) {
  const [title, setTitle] = useState(document?.title ?? '');
  const [content, setContent] = useState(document?.content ?? '');
  const [changeNote, setChangeNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const isEditing = Boolean(document);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = buildValidationErrors(title, changeNote, isEditing);
    setValidationErrors(errors);
    if (errors.length > 0) return;

    setSaving(true);
    setError(null);

    try {
      if (isEditing) {
        await onSave({ title, content, changeNote });
      } else {
        await onSave({
          title,
          content,
          authorId: 'current-user',
          authorName: 'Текущий пользователь',
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить документ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="document-editor">
      <div className="document-editor__header">
        <div>
          <p className="document-editor__eyebrow">
            {isEditing ? 'Редактирование черновика' : 'Создание черновика'}
          </p>
          <h2>{isEditing ? 'Изменение документа' : 'Новый документ'}</h2>
          <p className="document-editor__subtitle">
            {isEditing
              ? 'Обновите содержимое документа и опишите изменение для истории версий.'
              : 'Создайте новый черновик, не покидая текущую рабочую область.'}
          </p>
        </div>
        <button className="ghost-button" type="button" onClick={onCancel} disabled={saving}>
          Закрыть
        </button>
      </div>

      <form className="document-editor__form" onSubmit={handleSubmit}>
        {validationErrors.length > 0 && (
          <div className="editor-alert editor-alert--error">
            {validationErrors.map((validationError) => (
              <div key={validationError}>{validationError}</div>
            ))}
          </div>
        )}

        {error && <div className="editor-alert editor-alert--error">{error}</div>}

        <div className="editor-field">
          <label htmlFor="title">Название</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={255}
            placeholder="Введите название документа"
            required
          />
        </div>

        <div className="editor-field">
          <label htmlFor="content">Содержание</label>
          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={14}
            placeholder="Введите текст документа"
          />
        </div>

        {isEditing && (
          <div className="editor-field">
            <label htmlFor="changeNote">Комментарий к изменению</label>
            <input
              id="changeNote"
              type="text"
              value={changeNote}
              onChange={(event) => setChangeNote(event.target.value)}
              placeholder="Опишите, что изменилось"
              required
            />
          </div>
        )}

        <div className="document-editor__actions">
          <button className="secondary-button" type="button" onClick={onCancel} disabled={saving}>
            Отмена
          </button>
          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? 'Сохранение...' : isEditing ? 'Сохранить изменения' : 'Создать документ'}
          </button>
        </div>
      </form>
    </section>
  );
}
