import { motion } from "motion/react";
import { formatNaira } from "@/utils/currency";

interface DailyFlowBarProps {
  totalCredit: number;
  totalCollected: number;
}

/**
 * A single segmented bar answering "how did today go" at a glance:
 * collected vs. still-outstanding-from-today's-credit, as a proportion of
 * the day's total credit extended. Deliberately one visual, not a chart
 * dashboard.
 */
export function DailyFlowBar({ totalCredit, totalCollected }: DailyFlowBarProps) {
  const total = Math.max(totalCredit, totalCollected, 1);
  const collectedPct = Math.min((totalCollected / total) * 100, 100);
  const creditPct = Math.min((totalCredit / total) * 100, 100);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold text-ink-faint">
        <span>Today's Flow</span>
        <span>
          {formatNaira(totalCollected)} of {formatNaira(totalCredit)}
        </span>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full bg-surface-sunken">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${creditPct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 rounded-full bg-owe-soft"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${collectedPct}%` }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="absolute inset-y-0 left-0 rounded-full bg-paid"
        />
      </div>
      <div className="mt-2 flex items-center gap-4 text-xs text-ink-faint">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-paid" aria-hidden="true" /> Collected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-owe-soft" aria-hidden="true" /> Extended
        </span>
      </div>
    </div>
  );
}
