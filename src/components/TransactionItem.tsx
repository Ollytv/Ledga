import type { Transaction } from "@/types";
import { formatNaira } from "@/utils/currency";
import { timeOfDay } from "@/utils/date";

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isCredit = transaction.type === "credit";

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          isCredit ? "bg-owe-soft text-owe" : "bg-paid-soft text-paid"
        }`}
        aria-hidden="true"
      >
        {isCredit ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M12 19l-5-5M12 19l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 19V5M12 5l-5 5M12 5l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink">{isCredit ? "Credit" : "Payment"}</p>
        <p className="text-xs text-ink-faint">{timeOfDay(transaction.createdAt)}</p>
      </div>
      <span className={`font-display text-lg font-semibold ${isCredit ? "text-owe" : "text-paid"}`}>
        {isCredit ? "+" : "−"}
        {formatNaira(transaction.amount)}
      </span>
    </li>
  );
}
