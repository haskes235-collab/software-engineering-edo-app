import { useState } from 'react';
import { Document, CreateDocumentDto, UpdateDocumentDto } from '@shared/types';
import './DocumentEditor.css';

interface DocumentEditorProps {
  document?: Document;
  onSave: (dto: CreateDocumentDto | UpdateDocumentDto) => Promise<void>;
  onCancel: () => void;
}

export function DocumentEditor({ document, onSave, onCancel }: DocumentEditorProps) {
  const [title, setTitle] = useState(document?.title ?? '');
  const [content, setContent] = useState(document?.content ?? '');
  const [changeNote, setChangeNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const isEditing = !!document;

  const validate = (): boolean => {
    const errors: string[] = [];
    if (!title.trim()) {
      errors.push('Title is required');
    }
    if (title.length > 255) {
      errors.push('Title must be 255 characters or fewer');
    }
    if (isEditing && !changeNote.trim()) {
      errors.push('Change note is required when editing');
    }
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setError(null);

    try {
      if (isEditing) {
        const dto: UpdateDocumentDto = { title, content, changeNote };
        await onSave(dto);
      } else {
        const dto: CreateDocumentDto = {
          title,
          content,
          authorId: 'current-user',
          authorName: 'Current User',
        };
        await onSave(dto);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="document-editor">
      <h2>{isEditing ? 'Edit Document' : 'New Document'}</h2>

      <form onSubmit={handleSubmit}>
        {validationErrors.length > 0 && (
          <div className="validation-errors">
            {validationErrors.map((err) => (
              <div key={err} className="error-message">{err}</div>
            ))}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={255}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
          />
        </div>

        {isEditing && (
          <div className="form-group">
            <label htmlFor="changeNote">Change Note</label>
            <input
              id="changeNote"
              type="text"
              value={changeNote}
              onChange={(e) => setChangeNote(e.target.value)}
              placeholder="Describe what changed..."
              required
            />
          </div>
        )}

        <div className="form-actions">
          <button type="button" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}