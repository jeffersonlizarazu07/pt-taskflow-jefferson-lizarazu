'use client';

import { TODO_STATUS_LABELS } from '@/constants/todos';
import { cn } from '@/lib/utils';
import type { TodoStatus } from '@/types/todo';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TodoFiltersProps {
  activeFilter: TodoStatus;
  onFilterChange: (filter: TodoStatus) => void;
}

const FILTER_OPTIONS: TodoStatus[] = ['all', 'completed', 'pending'];

// ─── Component ────────────────────────────────────────────────────────────────

export function TodoFilters({ activeFilter, onFilterChange }: TodoFiltersProps) {
  return (
    <div
      role="tablist"
      aria-label="Filtrar tareas"
      className="border-surface-100 bg-surface-50 flex gap-1 rounded-lg border p-1"
    >
      {FILTER_OPTIONS.map((filter) => (
        <button
          key={filter}
          role="tab"
          aria-selected={activeFilter === filter}
          onClick={() => onFilterChange(filter)}
          className={cn(
            'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150',
            activeFilter === filter
              ? 'bg-surface-0 text-brand-600 shadow-sm'
              : 'hover:text-surface-800 text-gray-400'
          )}
        >
          {TODO_STATUS_LABELS[filter]}
        </button>
      ))}
    </div>
  );
}
