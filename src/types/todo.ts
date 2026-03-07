// ─── Domain Types ────────────────────────────────────────────────────────────

export type TodoStatus = 'all' | 'completed' | 'pending';

export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
  // Marks todos created locally that have not been persisted by the API.
  // When true, delete/toggle skip the API call and operate only on local state.
  isLocal?: boolean;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface TodosResponse {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateTodoPayload {
  todo: string;
  completed: boolean;
  userId: number;
}

export interface UpdateTodoPayload {
  completed: boolean;
}

// ─── UI State Types ───────────────────────────────────────────────────────────

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  total: number;
}
