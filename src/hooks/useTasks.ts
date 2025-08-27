import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import type { Task } from '../types';

type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();

  return useMutation<Task, Error, CreateTaskInput>({
    mutationFn: (payload) => createTask(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();

  return useMutation<Task, Error, { id: number; patch: Partial<Task> }>({
    mutationFn: ({ id, patch }) => updateTask(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}