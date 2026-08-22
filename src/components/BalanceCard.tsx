import { AmountDisplay } from "@/components/AmountDisplay";

interface BalanceCardProps {
  label: string;
  amount: number;
  /** Shown when amount is 0 instead of the figure, e.g. "All cleared". */
  clearedLabel?: string;
}

export function BalanceCard({ label, amount, clearedLabel }: BalanceCardProps) {
  const isCleared = amount === 0 && clearedLabel;

  return (
    <div className="rounded-3xl bg-ink px-6 py-8 text-center shadow-card sm:text-left">
      <p className="text-sm font-medium text-paper/70">{label}</p>
      {isCleared ? (
        <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="#17825A" />
            <path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-display text-2xl font-semibold text-paid">{clearedLabel}</span>
        </div>
      ) : (
        <AmountDisplay amount={amount} tone="gold" size="xl" className="mt-1 block" />
      )}
    </div>
  );
}
