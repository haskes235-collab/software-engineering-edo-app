import { observer } from 'mobx-react-lite';
import type { FormEvent } from 'react';
import { DocumentEditorController } from './DocumentEditor.controller';
import { CreateDocumentDto, UpdateDocumentDto } from '@shared/types';

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
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void controller.submit(onSave);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white/95 to-slate-50/95 p-6 shadow-xl backdrop-blur-sm sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
            {controller.isEditing ? 'Редактирование черновика' : 'Создание черновика'}
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            {controller.isEditing ? 'Изменение документа' : 'Новый документ'}
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            {controller.isEditing
              ? 'Обновите содержимое документа и опишите изменение для истории версий.'
              : 'Создайте новый черновик, не покидая текущую рабочую область.'}
          </p>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={onCancel}
          disabled={controller.saving}
        >
          Закрыть
        </button>
      </div>

      <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
        {controller.validationErrors.length > 0 && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {controller.validationErrors.map((validationError) => (
              <div key={validationError}>{validationError}</div>
            ))}
          </div>
        )}

        {controller.error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {controller.error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-semibold text-slate-700">
            Название
          </label>
          <input
            id="title"
            type="text"
            value={controller.title}
            onChange={(event) => controller.setTitle(event.target.value)}
            maxLength={255}
            placeholder="Введите название документа"
            required
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="content" className="text-sm font-semibold text-slate-700">
            Содержание
          </label>
          <textarea
            id="content"
            value={controller.content}
            onChange={(event) => controller.setContent(event.target.value)}
            rows={14}
            placeholder="Введите текст документа"
            className="min-h-64 w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
          />
        </div>

        {controller.isEditing && (
          <div className="flex flex-col gap-2">
            <label htmlFor="changeNote" className="text-sm font-semibold text-slate-700">
              Комментарий к изменению
            </label>
            <input
              id="changeNote"
              type="text"
              value={controller.changeNote}
              onChange={(event) => controller.setChangeNote(event.target.value)}
              placeholder="Опишите, что изменилось"
              required
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
            />
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            className="inline-flex items-center justify-center rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={onCancel}
            disabled={controller.saving}
          >
            Отмена
          </button>
          <button
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-teal-700 to-sky-800 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={controller.saving}
          >
            {controller.saving
              ? 'Сохранение...'
              : controller.isEditing
                ? 'Сохранить изменения'
                : 'Создать документ'}
          </button>
        </div>
      </form>
    </section>
  );
});
