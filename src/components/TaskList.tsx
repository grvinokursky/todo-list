import { useMemo, useState, useCallback } from 'react';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { TaskItem } from './TaskItem';
import TaskForm from './TaskForm';
import type { Task, TaskStatus } from '../types';

const STATUS_LABELS: Record<TaskStatus, string> = {
  NEW: 'Новая',
  IN_PROGRESS: 'В процессе',
  DONE: 'Выполнено'
};

export default function TaskList() {
  const { data: tasks, isLoading, isError } = useTasks();
  const create = useCreateTask();
  const update = useUpdateTask();
  const remove = useDeleteTask();

  const [filter, setFilter] = useState<'ALL' | TaskStatus>('ALL');

  const onCreate = useCallback(async (title: string, description?: string) => {
    await create.mutateAsync({ title, description, status: 'NEW' });
  }, [create]);

  const onToggleStatus = useCallback((task: Task) => {
    const nextStatus: TaskStatus = task.status === 'DONE' ? 'NEW' : 'DONE';
    update.mutate({ id: task.id, patch: { status: nextStatus } });
  }, [update]);

  const onDelete = useCallback((id: number) => {
    if (confirm('Удалить задачу?')) remove.mutate(id);
  }, [remove]);

  const filtered:Task[] = useMemo(() => {
    if (!tasks) return [];
    if (filter === 'ALL') return tasks.slice();
    return tasks.filter(t => t.status === filter).slice();
  }, [tasks, filter]);

  if (isLoading) return <div className="text-center">Загрузка...</div>;

  if (isError) return <div className="text-center">Ошибка загрузки задач.</div>;

  return (
    <div className="task-area">
      <div className="task-controls">
        <div className="filters">
          <button className={filter === 'ALL' ? 'active' : ''} onClick={() => setFilter('ALL')}>Все</button>
          {(['NEW', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map(s => (
            <button key={s} className={filter === s ? 'active' : ''} onClick={() => setFilter(s)}>{STATUS_LABELS[s]}</button>
          ))}
        </div>
        <TaskForm onCreate={onCreate} creating={create.isPending} />
      </div>

      <div className="task-list">
        {filtered.length === 0 ? (
          <div className="empty">Нет задач</div>
        ) : (
          filtered.map(task => (
            <TaskItem key={task.id} task={task} onToggle={onToggleStatus} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
}
