import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-surface/60 px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-soft text-gold-deep" aria-hidden="true">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="max-w-xs text-sm text-ink-soft">{message}</p>
      {action}
    </div>
  );
}
