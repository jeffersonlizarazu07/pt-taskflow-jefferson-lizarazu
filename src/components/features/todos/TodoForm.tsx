'use client';

import { useState, type FormEvent } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TodoFormProps {
  onAdd: (text: string) => Promise<boolean>;
}

type FeedbackStatus = 'idle' | 'success' | 'error';

const FEEDBACK_MESSAGES: Record<FeedbackStatus, string> = {
  idle: '',
  success: '✓ Tarea agregada correctamente.',
  error: '✗ No se pudo agregar la tarea. Intenta de nuevo.',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackStatus>('idle');

  const showFeedback = (status: FeedbackStatus) => {
    setFeedback(status);
    setTimeout(() => setFeedback('idle'), 3000);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedText = text.trim();
    if (!trimmedText) return;

    setIsSubmitting(true);
    const success = await onAdd(trimmedText);
    setIsSubmitting(false);

    if (success) {
      setText('');
      showFeedback('success');
    } else {
      showFeedback('error');
    }
  };

  return (
    <div className="border-surface-100 bg-surface-0 rounded-xl border p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nueva tarea…"
          disabled={isSubmitting}
          aria-label="Descripción de la nueva tarea"
          className="border-surface-200 bg-surface-50 text-surface-800 focus:border-brand-500 focus:ring-brand-500/20 h-10 flex-1 rounded-lg border px-3 text-sm placeholder-gray-400 transition-all focus:ring-2 focus:outline-none disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          size="md"
          aria-label="Agregar tarea"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Agregar</span>
        </Button>
      </form>

      {/* Feedback message */}
      {feedback !== 'idle' && (
        <p
          className={`animate-fade-in mt-2 text-xs font-medium ${
            feedback === 'success' ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {FEEDBACK_MESSAGES[feedback]}
        </p>
      )}
    </div>
  );
}
