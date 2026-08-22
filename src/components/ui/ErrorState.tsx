import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-3xl border border-owe-soft bg-owe-soft/40 px-6 py-10 text-center">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="#D14343" strokeWidth="2" />
        <path d="M12 8v5" stroke="#D14343" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="16" r="1" fill="#D14343" />
      </svg>
      <p className="max-w-xs text-sm font-medium text-owe">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="md" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
