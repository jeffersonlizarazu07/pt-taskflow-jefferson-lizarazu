'use client';

import { CheckSquare } from 'lucide-react';
import { useTodos } from '@/hooks/useTodos';
import { TodoForm } from '@/components/features/todos/TodoForm';
import { TodoFilters } from '@/components/features/todos/TodoFilters';
import { TodoList } from '@/components/features/todos/TodoList';
import { TodoPagination } from '@/components/features/todos/TodoPagination';

// ─── Page ─────────────────────────────────────────────────────────────────────
// This page is intentionally thin — it only composes feature components.
// All business logic lives in the useTodos hook.

export default function HomePage() {
  const {
    todos,
    pagination,
    activeFilter,
    isLoading,
    error,
    loadPage,
    addTodo,
    toggleTodo,
    removeTodo,
    setFilter,
  } = useTodos();

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-12">
      <div className="bg-surface-50/90 ring-surface-200 rounded-3xl p-8 shadow-2xl ring-1 backdrop-blur-md">
        {/* Header */}
        <header className="mb-8 flex items-center gap-3">
          <div className="bg-brand-500 flex h-10 w-10 items-center justify-center rounded-xl shadow-sm">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-surface-800 text-xl leading-tight font-bold">TaskFlow</h1>
            <p className="text-xs text-black">Gestión de tareas</p>
          </div>
        </header>

        {/* Add todo */}
        <section aria-label="Agregar tarea" className="mb-6">
          <TodoForm onAdd={addTodo} />
        </section>

        {/* Filters */}
        <section aria-label="Filtros" className="mb-6">
          <TodoFilters activeFilter={activeFilter} onFilterChange={setFilter} />
        </section>

        {/* Task list */}
        <section aria-label="Tareas" className="mb-8">
          <TodoList
            todos={todos}
            isLoading={isLoading}
            error={error} 
            onToggle={toggleTodo}
            onDelete={removeTodo}
            onRetry={() => loadPage(pagination.currentPage)}
          />
        </section>

        {/* Pagination */}
        <TodoPagination pagination={pagination} onPageChange={loadPage} isDisabled={isLoading} />
      </div>
    </main>
  );
}
