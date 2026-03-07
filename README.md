# TaskFlow

Aplicación de gestión de tareas construida como prueba técnica para Orquestia. Consume la API pública de [DummyJSON](https://dummyjson.com/docs/todos) e implementa un CRUD completo gestionado en estado local.

---

## Instalación y ejecución local

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/pt-taskflow-jefferson-lizarazu.git
cd pt-taskflow-jefferson-lizarazu

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env.local

# 4. Correr en desarrollo
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

> El proyecto corre con `pnpm install` y `pnpm dev` sin pasos adicionales.

---

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | URL base de la API de DummyJSON | `https://dummyjson.com` |

---

## Stack

| Tecnología | Versión | Motivo |
|---|---|---|
| Next.js | 15.1.0 | Framework base requerido. App Router para layouts y Server Components. |
| React | 19 | Librería de UI base. |
| TypeScript | 5 | Tipado estático para mayor seguridad y mantenibilidad. |
| Tailwind CSS | 4 | Utility-first CSS, configurado con design tokens propios via `@theme`. |
| class-variance-authority | 0.7 | Gestión tipada de variantes de componentes UI. |
| tailwind-merge + clsx | — | Merge seguro de clases de Tailwind sin conflictos. |
| lucide-react | 0.468 | Iconos consistentes y accesibles. |
| ESLint + Prettier | — | Calidad y formato de código consistente. Sin errores en `pnpm build`. |

---

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx           # Layout raíz con fuentes y metadata
│   ├── page.tsx             # Página principal — solo composición, sin lógica
│   └── globals.css          # Design tokens (@theme), animaciones y base styles
├── components/
│   ├── ui/                  # Componentes reutilizables genéricos
│   │   ├── Button.tsx       # Botón con variantes CVA: primary/secondary/ghost/destructive
│   │   ├── ConfirmDialog.tsx# Modal de confirmación via React Portal, sin dependencias
│   │   ├── EmptyState.tsx   # Estado vacío reutilizable
│   │   ├── ErrorMessage.tsx # Error con botón de reintentar
│   │   └── Skeleton.tsx     # Skeleton loader para el listado
│   └── features/
│       └── todos/           # Componentes específicos del dominio de tareas
│           ├── TodoFilters.tsx     # Tabs de filtro: Todas / Completadas / Pendientes
│           ├── TodoForm.tsx        # Input para crear tarea con feedback de éxito/error
│           ├── TodoItem.tsx        # Ítem individual con toggle switch y botón eliminar
│           ├── TodoList.tsx        # Orquesta skeleton / error / vacío / lista
│           └── TodoPagination.tsx  # Controles de paginación anterior/siguiente
├── config/
│   └── env.ts               # Validación de variables de entorno en build time
├── constants/
│   └── todos.ts             # TODOS_PER_PAGE, DEFAULT_USER_ID
├── hooks/
│   ├── useTodos.ts          # Orquestador público — único punto de entrada para la UI
│   ├── useTodosFetch.ts     # Responsabilidad única: carga inicial y paginación local
│   ├── useTodosMutations.ts # Responsabilidad única: crear, toggle, eliminar
│   └── useTodosFilter.ts    # Responsabilidad única: filtrado local por estado
├── lib/
│   └── utils.ts             # Helper cn() para merge de clases Tailwind
├── services/
│   └── todoService.ts       # Capa de acceso a la API (fetchAllTodos, createTodo, etc.)
└── types/
    └── todo.ts              # Tipos TypeScript del dominio
```

---

## Decisiones técnicas

### Cargar todos los registros de una vez (`fetchAllTodos`)

La API de DummyJSON siempre devuelve los mismos ~250 registros sin importar las operaciones de escritura, ya que no persiste los cambios. Paginar desde la API (con `limit` y `skip`) en este contexto genera inconsistencias inevitables: al crear o eliminar una tarea localmente, la página recargada desde la API devuelve los mismos datos originales ignorando el cambio local.

**Solución adoptada:** se carga todo el listado en un único request al inicio (`GET /todos?limit=0`) y la paginación, el filtrado y todas las mutaciones se gestionan íntegramente en estado local. Esto garantiza consistencia perfecta entre las operaciones CRUD y la UI.

### Gestión de estado: `useState` local en hooks especializados

Se optó por `useState` en hooks personalizados en lugar de Zustand u otra librería por las siguientes razones:

- La aplicación tiene una sola página y un único dominio de datos.
- No hay comunicación entre contextos distintos que requiera estado global.
- Es más simple, sin dependencias adicionales, y suficiente para la escala de esta aplicación.

Zustand sería la elección correcta si la aplicación creciera con múltiples páginas compartiendo el mismo estado.

### Separación de responsabilidades en hooks (Single Responsibility Principle)

El hook `useTodos` fue dividido en tres hooks especializados más un orquestador:

| Hook | Responsabilidad |
|---|---|
| `useTodosFetch` | Fetch inicial, paginación local, exposición de `allTodos` |
| `useTodosMutations` | Crear, toggle, eliminar sobre `allTodos` |
| `useTodosFilter` | Filtrado local por estado (completada/pendiente) |
| `useTodos` | Orquestador — compone los tres anteriores y expone la API pública |

El flujo de datos es: `allTodos → filteredTodos → getPageSlice(page)`. El filtro siempre se aplica antes de paginar, garantizando que la regla de 10 registros por página se respete en cualquier combinación de filtro y página activa.

### Optimistic Update para `toggleTodo`

Al marcar una tarea como completada/pendiente se eligió el patrón de **actualización optimista**:

1. La UI refleja el cambio **inmediatamente** sin esperar la respuesta de la API.
2. Si la API falla, el cambio se **revierte** automáticamente al estado anterior.

**Razón:** la operación de toggle es de bajo riesgo y la latencia percibida es cero. Si el riesgo fuera mayor (por ejemplo, una operación financiera), se elegiría actualización post-respuesta.

### Tareas locales vs. tareas de la API (`isLocal`)

La API retorna siempre el mismo id para tareas creadas vía `POST /todos/add`, un id que no existe realmente en el servidor. Llamar a `DELETE` o `PATCH` sobre ese id falla.

**Solución:** las tareas creadas localmente se identifican con `isLocal: true` y un id temporal negativo generado con `-Date.now()` (nunca colisiona con los ids positivos de la API). El hook `useTodosMutations` evalúa `isLocal` antes de cada operación y omite la llamada a la API cuando corresponde. Las tareas locales muestran un badge `local` en la UI.

### Modal de confirmación sin dependencias externas

En lugar de `window.confirm` (bloqueante, sin estilos) o instalar shadcn/ui, se implementó `ConfirmDialog` usando React Portal (`createPortal`) directamente sobre `document.body`. Incluye backdrop con blur, cierre con Escape, bloqueo de scroll y atributos de accesibilidad (`role="alertdialog"`, `aria-modal`, `aria-labelledby`).

---

## Calidad de código

- **ESLint** configurado con `next/core-web-vitals` + `prettier`. Sin errores en `pnpm build`.
- **Prettier** con `prettier-plugin-tailwindcss` para orden automático de clases.
- **TypeScript strict mode** activado. Sin `any` en el código de producción.
- **Commits descriptivos** por funcionalidad siguiendo convención `feat/fix/chore/docs`.

---

## Gitflow

```
main
└── develop
    ├── feat/project-setup
    ├── feat/todo-list-pagination
    ├── feat/create-todo
    ├── feat/toggle-todo
    ├── feat/delete-todo
    ├── feat/filter-todos
    └── feat/readme-and-docs
```

Cada funcionalidad se desarrolla en una rama `feat/*` que hace PR hacia `develop`. Al finalizar, `develop` hace PR hacia `main` con el tag `v1.0.0`.

**Regla:** nunca se commitea directamente en `main`.