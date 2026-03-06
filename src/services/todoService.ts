import { env } from '@/config/env';
import type {
  Todo,
  TodosResponse,
  CreateTodoPayload,
  UpdateTodoPayload,
} from '@/types/todo';

const BASE = `${env.apiBaseUrl}/todos`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

// ─── Service Functions ────────────────────────────────────────────────────────

export async function fetchTodos(
  limit: number,
  skip: number
): Promise<TodosResponse> {
  const response = await fetch(`${BASE}?limit=${limit}&skip=${skip}`);
  return handleResponse<TodosResponse>(response);
}

export async function createTodo(payload: CreateTodoPayload): Promise<Todo> {
  const response = await fetch(`${BASE}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Todo>(response);
}

export async function updateTodo(
  id: number,
  payload: UpdateTodoPayload
): Promise<Todo> {
  const response = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Todo>(response);
}

export async function deleteTodo(id: number): Promise<Todo> {
  const response = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  return handleResponse<Todo>(response);
}