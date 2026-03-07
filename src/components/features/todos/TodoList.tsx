'use client';

import { TodoItem } from './TodoItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { TodoListSkeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import type { Todo } from '@/types/todo';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  onToggle: (todo: Todo) => Promise<void>;
  onDelete: (id: number, isLocal?: boolean) => Promise<boolean>;
  onRetry: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TodoList({
  todos,
  isLoading,
  error,
  onToggle,
  onDelete,
  onRetry,
}: TodoListProps) {
  if (isLoading) return <TodoListSkeleton />;

  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;

  if (todos.length === 0) {
    return (
      <EmptyState
        title="No hay tareas aquí"
        description="Agrega una nueva tarea o cambia el filtro activo."
      />
    );
  }

  return (
    <ul className="space-y-3" aria-label="Lista de tareas">
      {todos.map((todo) => (
        <li key={todo.id}>
          <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}