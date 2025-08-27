import { useState } from 'react';
import type { Task, TaskStatus } from '../types';
import { useUpdateTask } from '../hooks/useTasks';
import { EditTaskForm } from './EditTaskForm';
import { STATUS_LABELS } from '../constants/status';

type Props = {
  task: Task;
  onToggle?: (task: Task) => void;
  onDelete?: (id: number) => void;
};

export function TaskItem({ task, onToggle, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const update = useUpdateTask();

  const startEdit = () => {
    setEditing(true);
  };

  const cancel = () => {
    setEditing(false);
  };

  const handleToggle = () => {
    if (onToggle) onToggle(task);
    else {
      const nextStatus: TaskStatus = task.status === 'DONE' ? 'NEW' : 'DONE';
      update.mutate({ id: task.id, patch: { status: nextStatus } });
    }
  };

  const handleDelete = () => {
    if (onDelete) onDelete(task.id);
  };

  return (
    <div className="task-item">
      {!editing ? (
        <div>
          <div>
            <text className="task-item-title">{task.title}</text>
            {task.description && <div className="task-meta">{task.description}</div>}
            <div className="task-meta">Статус: <em>{STATUS_LABELS[task.status]}</em></div>
          </div>

          <div className="task-actions">
            <button onClick={handleToggle}>
              {task.status === 'DONE' ? 'Восстановить' : 'Завершить'}
            </button>
            <button onClick={startEdit}>Редактировать</button>
            <button className="danger" onClick={handleDelete}>Удалить</button>
          </div>
        </div>
      ) : (
        <div>
          <EditTaskForm
            task={task}
            onCancel={cancel}
            onSave={async (patch) => {
              await update.mutateAsync({ id: task.id, patch });
              setEditing(false);
            }}
            saving={update.isPending}
          />
          {update.isPending && <div>Сохраняется...</div>}
        </div>
      )}
    </div>
  );
}