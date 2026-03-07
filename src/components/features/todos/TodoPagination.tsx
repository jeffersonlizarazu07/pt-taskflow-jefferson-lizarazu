'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { PaginationState } from '@/types/todo';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TodoPaginationProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  isDisabled: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TodoPagination({ pagination, onPageChange, isDisabled }: TodoPaginationProps) {
  const { currentPage, totalPages, total } = pagination;

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  if (totalPages <= 1) return null;

  return (
    <div className="border-surface-100 flex items-center justify-between border-t pt-4">
      <p className="text-xs text-gray-400">
        Página <span className="text-surface-800 font-semibold">{currentPage}</span> de{' '}
        <span className="text-surface-800 font-semibold">{totalPages}</span>
        {' · '}
        <span className="text-surface-800 font-semibold">{total}</span> tareas
      </p>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrev || isDisabled}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext || isDisabled}
          aria-label="Página siguiente"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
