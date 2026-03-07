import { env } from '@/config/env';
import type {
    Todo,
    TodosResponse,
    CreateTodoPayload,
    UpdateTodoPayload,
} from '@/types/todo';

// Definí dos constantes anidadas para mejor lectura y mantenivilidad
const API_ROOT = `${env.apiBaseUrl}`;
const TODOS_RESOURCE = `${API_ROOT}/todos`;

// Definí la constante ya que se repetía en mas de una consulta a la API
const JSON_HEADERS = {
    'Content-Type': 'application/json',
} as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        // Intento obtener el mensaje del JSON, si falla, uso el texto
        let errorMessage = response.statusText;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            // Si no es JSON, la segunda opción es leerlo como texto simple
            const text = await response.text();
            if (text) errorMessage = text;
        }

        throw new Error(`API Error ${response.status}: ${errorMessage}`);
    }
    return response.json() as Promise<T>;
}


// ─── Service Functions ────────────────────────────────────────────────────────

export async function fetchTodos(
    limit: number,
    skip: number
): Promise<TodosResponse> {
    const response = await fetch(`${TODOS_RESOURCE}?limit=${limit}&skip=${skip}`);
    return handleResponse<TodosResponse>(response);
}

export async function createTodo(payload: CreateTodoPayload): Promise<Todo> {
    const response = await fetch(`${TODOS_RESOURCE}/add`, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(payload),
    });
    return handleResponse<Todo>(response);
}

export async function updateTodo(
    id: number,
    payload: UpdateTodoPayload
): Promise<Todo> {
    const response = await fetch(`${TODOS_RESOURCE}/${id}`, {
        method: 'PATCH',
        headers: JSON_HEADERS,
        body: JSON.stringify(payload),
    });
    return handleResponse<Todo>(response);
}

export async function deleteTodo(id: number): Promise<Todo> {
    const response = await fetch(`${TODOS_RESOURCE}/${id}`, { method: 'DELETE' });
    return handleResponse<Todo>(response);
}