import type { Task, TaskStatus } from '../types';

const API_BASE = '/api/tasks';

export type CreateTaskInput = {
  title: string;
  description?: string;
  status?: TaskStatus;
};

export type UpdateTaskInput = Partial<Pick<Task, 'title' | 'description' | 'status'>>;

async function handleRes<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return (res.status === 204 ? (undefined as unknown as T) : await res.json());
}

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(API_BASE);
  return handleRes<Task[]>(res);
}

export async function fetchTaskById(id: number): Promise<Task> {
  const res = await fetch(`${API_BASE}/${id}`);
  return handleRes<Task>(res);
}

export async function createTask(payload: CreateTaskInput): Promise<Task> {
  const now = new Date().toISOString();
  const body = {
    title: payload.title,
    description: payload.description ?? '',
    status: payload.status ?? 'NEW',
    createdAt: now,
    updatedAt: now,
  };
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleRes<Task>(res);
}

export async function updateTask(id: number, patch: UpdateTaskInput): Promise<Task> {
  const body = { ...patch, updatedAt: new Date().toISOString() };
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleRes<Task>(res);
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  return handleRes<void>(res);
}
