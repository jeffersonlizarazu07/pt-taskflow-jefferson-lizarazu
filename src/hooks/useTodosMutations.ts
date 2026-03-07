'use client';

import { useCallback } from 'react';
import { createTodo, updateTodo, deleteTodo } from '@/services/todoService';
import { DEFAULT_USER_ID } from '@/constants/todos';
import type { Todo } from '@/types/todo';

// ─── Types ────────────────────────────────────────────────────────────────────

type SetAllTodos = React.Dispatch<React.SetStateAction<Todo[]>>;

interface UseTodosMutationsParams {
  setAllTodos: SetAllTodos;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Generates a temporary negative id for locally-created todos.
// Negative ids never collide with the API's positive integer ids.
const generateLocalId = () => -Date.now();

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTodosMutations({ setAllTodos }: UseTodosMutationsParams) {
  // ── Create todo ─────────────────────────────────────────────────────────────
  // Calls the API for the confirm response, then prepends the todo to local
  // state with isLocal: true and a guaranteed-unique negative id.
  // This prevents collisions with real API ids when deleting or toggling later.

  const addTodo = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        await createTodo({
          todo: text,
          completed: false,
          userId: DEFAULT_USER_ID,
        });

        const localTodo: Todo = {
          id: generateLocalId(),
          todo: text,
          completed: false,
          userId: DEFAULT_USER_ID,
          isLocal: true,
        };

        setAllTodos((prev) => [localTodo, ...prev]);
        return true;
      } catch {
        return false;
      }
    },
    [setAllTodos]
  );

  // ── Toggle todo completed ───────────────────────────────────────────────────
  // DECISION: Optimistic update — UI reflects change immediately for snappy UX.
  // Local todos skip the API call since their id does not exist on the server.
  // If the API call fails for real todos, the previous state is restored.

  const toggleTodo = useCallback(
    async (todo: Todo): Promise<void> => {
      const optimisticCompleted = !todo.completed;

      // 1. Optimistically update the UI
      setAllTodos((prev) =>
        prev.map((t) =>
          t.id === todo.id ? { ...t, completed: optimisticCompleted } : t
        )
      );

      // Local todos have no real id — skip the API call entirely.
      if (todo.isLocal) return;

      try {
        await updateTodo(todo.id, { completed: optimisticCompleted });
      } catch {
        // 2. Roll back on API failure
        setAllTodos((prev) =>
          prev.map((t) =>
            t.id === todo.id ? { ...t, completed: todo.completed } : t
          )
        );
      }
    },
    [setAllTodos]
  );

  // ── Delete todo ─────────────────────────────────────────────────────────────
  // Local todos are removed directly from state without calling the API,
  // since their temporary id does not exist on the server.

  const removeTodo = useCallback(
    async (id: number, isLocal = false): Promise<boolean> => {
      try {
        if (!isLocal) {
          await deleteTodo(id);
        }

        setAllTodos((prev) => prev.filter((t) => t.id !== id));
        return true;
      } catch {
        return false;
      }
    },
    [setAllTodos]
  );

  return { addTodo, toggleTodo, removeTodo };
}