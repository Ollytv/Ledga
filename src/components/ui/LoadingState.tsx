interface LoadingStateProps {
  label: string;
  rows?: number;
}

/** Simple pulsing skeleton rows. Announces itself for screen readers without a layout jump. */
export function LoadingState({ label, rows = 3 }: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" className="space-y-3">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-20 animate-pulse rounded-2xl border border-border bg-surface"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
