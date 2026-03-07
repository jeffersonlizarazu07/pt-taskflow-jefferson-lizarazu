'use client';

import { useState, useCallback, useMemo } from 'react';
import type { Todo, TodoStatus } from '@/types/todo';

// ─── Hook ─────────────────────────────────────────────────────────────────────
// Filters allTodos before pagination so that page counts and slices
// always reflect only the items matching the active filter.

export function useTodosFilter(allTodos: Todo[]) {
  const [activeFilter, setActiveFilter] = useState<TodoStatus>('all');

  const filteredTodos = useMemo(() => {
    if (activeFilter === 'all') return allTodos;
    if (activeFilter === 'completed') return allTodos.filter((t) => t.completed);
    return allTodos.filter((t) => !t.completed);
  }, [allTodos, activeFilter]);

  const setFilter = useCallback((filter: TodoStatus) => {
    setActiveFilter(filter);
  }, []);

  return { filteredTodos, activeFilter, setFilter };
}