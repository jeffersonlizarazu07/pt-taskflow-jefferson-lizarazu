import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-red-100 bg-red-50 p-8 text-center animate-fade-in">
      <AlertCircle className="h-8 w-8 text-red-400" />
      <div className="space-y-1">
        <p className="font-semibold text-red-700">Algo salió mal</p>
        <p className="text-sm text-red-500">{message}</p>
      </div>
      <Button variant="destructive" size="sm" onClick={onRetry}>
        Reintentar
      </Button>
    </div>
  );
}