'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { cn } from '@/lib/utils';
import type { Todo } from '@/types/todo';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => Promise<void>;
  onDelete: (id: number, isLocal?: boolean) => Promise<boolean>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    await onToggle(todo);
    setIsToggling(false);
  };

  const handleDeleteConfirmed = async () => {
    setShowConfirm(false);
    setIsDeleting(true);
    const success = await onDelete(todo.id, todo.isLocal);
    if (!success) setIsDeleting(false);
  };

  return (
    <>
      <div
        className={cn(
          'group border-surface-100 bg-surface-0 hover:border-brand-100 animate-slide-up flex items-center gap-4 rounded-xl border p-4 shadow-sm transition-all duration-200 hover:shadow-md',
          isDeleting && 'pointer-events-none opacity-50'
        )}
      >
        {/* Toggle switch */}
        <button
          type="button"
          role="switch"
          aria-checked={todo.completed}
          aria-label={`Marcar "${todo.todo}" como ${todo.completed ? 'pendiente' : 'completada'}`}
          onClick={handleToggle}
          disabled={isToggling}
          className={cn(
            'focus-visible:ring-brand-500 relative h-6 w-11 shrink-0 rounded-full border-2 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-60',
            todo.completed
              ? 'border-brand-500 bg-brand-500'
              : 'border-surface-200 bg-surface-100 hover:border-brand-500'
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300',
              todo.completed && 'translate-x-5'
            )}
          />
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'text-surface-800 text-sm leading-snug font-medium transition-all duration-200',
              todo.completed && 'text-gray-400 line-through'
            )}
          >
            {todo.todo}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            {todo.isLocal && (
              <span className="bg-brand-50 text-brand-600 ml-2 rounded-full px-2 py-0.5">Tu</span>
            )}
          </p>
        </div>

        {/* Status badge */}
        <span
          className={cn(
            'hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200 sm:block',
            todo.completed ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
          )}
        >
          {todo.completed ? 'Completada' : 'Pendiente'}
        </span>

        {/* Delete button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowConfirm(true)}
          aria-label="Eliminar tarea"
          disabled={isDeleting}
          className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4 text-red-400" />
        </Button>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Eliminar tarea"
        description={`"${todo.todo}" será eliminada permanentemente.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
