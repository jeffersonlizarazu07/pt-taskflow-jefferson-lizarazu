import { ClipboardList } from 'lucide-react';
import type { ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EmptyState({
  title,
  description,
  icon = <ClipboardList className="h-10 w-10 text-surface-200" />,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center animate-fade-in">
      {icon}
      <p className="text-base font-semibold text-surface-800">{title}</p>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}