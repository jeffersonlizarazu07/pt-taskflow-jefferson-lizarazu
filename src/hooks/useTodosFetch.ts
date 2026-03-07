'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchAllTodos } from '@/services/todoService';
import { TODOS_PER_PAGE } from '@/constants/todos';
import type { PaginationState, Todo } from '@/types/todo';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TodosFetchState {
    // Full list of todos in local state — source of truth for all operations.
    allTodos: Todo[];
    isLoading: boolean;
    error: string | null;
}

export interface TodosFetchActions {
    currentPage: number;
    goToPage: (page: number) => void;
    setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function buildPagination(total: number, currentPage: number): PaginationState {
    return {
        currentPage,
        totalPages: Math.max(1, Math.ceil(total / TODOS_PER_PAGE)),
        total,
    };
}

export function getPageSlice(todos: Todo[], page: number): Todo[] {
    const start = (page - 1) * TODOS_PER_PAGE;
    return todos.slice(start, start + TODOS_PER_PAGE);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
// Fetches all todos once on mount. Exposes allTodos and currentPage so the
// orchestrator (useTodos) can apply filters before computing the page slice.

export function useTodosFetch(): TodosFetchState & TodosFetchActions {
    const [allTodos, setAllTodos] = useState<Todo[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // ── Initial fetch ───────────────────────────────────────────────────────────

    useEffect(() => {
        let cancelled = false;

        async function loadAllTodos() {
            setIsLoading(true);
            setError(null);

            try {
                const todos = await fetchAllTodos();
                if (cancelled) return;
                setAllTodos(todos);
            } catch {
                if (cancelled) return;
                setError('No se pudieron cargar las tareas. Intenta de nuevo.');
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        loadAllTodos();

        return () => {
            cancelled = true;
        };
    }, []);

    // ── Go to page ──────────────────────────────────────────────────────────────

    const goToPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    return {
        allTodos,
        currentPage,
        isLoading,
        error,
        goToPage,
        setAllTodos,
    };
}