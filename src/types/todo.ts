// ─── Domain Types ────────────────────────────────────────────────────────────

export type TodoStatus = 'all' | 'completed' | 'pending';

export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
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

export interface TodosState {
  todos: Todo[];
  pagination: PaginationState;
  activeFilter: TodoStatus;
  isLoading: boolean;
  error: string | null;
}