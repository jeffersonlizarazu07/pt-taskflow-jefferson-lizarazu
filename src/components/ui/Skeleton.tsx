import { cn } from '@/lib/utils';

// ─── Skeleton Base ────────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-surface-100', className)}
    />
  );
}

// ─── Todo Item Skeleton ───────────────────────────────────────────────────────

function TodoItemSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-surface-100 bg-surface-0 p-4">
      <Skeleton className="h-5 w-5 rounded-md shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
  );
}

// ─── Todo List Skeleton ───────────────────────────────────────────────────────

export function TodoListSkeleton() {
  return (
    <div className="space-y-3" aria-label="Cargando tareas…">
      {Array.from({ length: 5 }).map((_, i) => (
        <TodoItemSkeleton key={i} />
      ))}
    </div>
  );
}