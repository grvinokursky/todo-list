import React, { useState } from 'react';
import type { Task, TaskStatus } from '../types';
import { STATUS_LABELS } from '../constants/status';

type Props = {
  task: Task;
  onCancel?: () => void;
  onSave: (patch: Partial<Pick<Task, 'title' | 'description' | 'status'>>) => Promise<void> | void;
  saving?: boolean;
};

const STATUS_OPTIONS: TaskStatus[] = ['NEW', 'IN_PROGRESS', 'DONE'];

export function EditTaskForm({ task, onCancel, onSave, saving = false }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError('Название обязательно');
      return;
    }
    try {
      await onSave({ title: title.trim(), description: description.trim(), status });
    } catch (err: any) {
      setError(err?.message ?? 'Ошибка при сохранении');
    }
  };

  return (
    <form onSubmit={submit} className="edit-task-form">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Название"
        disabled={saving}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Описание"
        disabled={saving}
        rows={3}
      />

      <label>Статус задачи</label>
      <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} disabled={saving}>
        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
      </select>

      {error && <div className="form-error">{error}</div>}

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>Сохранить</button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={saving}>Отмена</button>
        )}
      </div>
    </form>
  );
}