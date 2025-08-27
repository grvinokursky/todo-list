import React, { useState } from 'react';

interface Props {
  onCreate: (title: string, description?: string) => void | Promise<void>;
  creating?: boolean;
}

export default function TaskForm({ onCreate, creating }: Props) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title.trim()) return alert('Введите заголовок');
    await onCreate(title.trim(), desc.trim() || undefined);
    setTitle('');
    setDesc('');
  };

  return (
    <form className="task-form" onSubmit={submit}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Новая задача" />
      <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Описание (опционально)" />
      <button type="submit" className="primary" disabled={creating}>{creating ? 'Добавление...' : 'Добавить'}</button>
    </form>
  );
}