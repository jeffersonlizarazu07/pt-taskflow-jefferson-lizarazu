'use client';

import { useTodosFetch, getPageSlice, buildPagination } from './useTodosFetch';
import { useTodosMutations } from './useTodosMutations';
import { useTodosFilter } from './useTodosFilter';

// ─── Hook ─────────────────────────────────────────────────────────────────────
// Single public API for the todos feature.
//
// Data flow (order matters):
//   allTodos → filteredTodos → pageTodos
//               ↑ filter         ↑ getPageSlice(currentPage)
//
// Pagination always runs on filteredTodos so the 10-per-page rule holds
// regardless of the active filter.
// This ensures UI reflects user actions instantly (optimistic update).

export function useTodos() {
    const { allTodos, currentPage, isLoading, error, goToPage, setAllTodos } =
        useTodosFetch();

    const { addTodo, toggleTodo, removeTodo } = useTodosMutations({ setAllTodos });

    // When a filter is active, paginate over filteredTodos instead of allTodos.
    const { filteredTodos, activeFilter, setFilter } = useTodosFilter(allTodos);

    // Always paginate over filteredTodos — when filter is 'all', filteredTodos
    // equals allTodos, so is identical to before.
    const todos = getPageSlice(filteredTodos, currentPage);
    const pagination = buildPagination(filteredTodos.length, currentPage);

    return {
        todos,
        pagination,
        activeFilter,
        isLoading,
        error,
        loadPage: goToPage,
        addTodo,
        toggleTodo,
        removeTodo,
        setFilter,
    };
}