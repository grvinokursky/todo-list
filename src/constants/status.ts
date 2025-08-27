import type { TaskStatus } from '../types';

export const STATUS_LABELS: Record<TaskStatus, string> = {
  NEW: 'Новая',
  IN_PROGRESS: 'В процессе',
  DONE: 'Выполнено',
};
