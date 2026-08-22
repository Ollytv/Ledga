import { motion } from "motion/react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { ActivityEntry } from "@/hooks/useRecentActivity";
import { formatNaira } from "@/utils/currency";
import { timeOfDay, friendlyDate } from "@/utils/date";

interface RecentActivityProps {
  entries: ActivityEntry[];
}

export function RecentActivity({ entries }: RecentActivityProps) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
      {entries.map(({ transaction, customerName }, i) => {
        const isCredit = transaction.type === "credit";
        return (
          <motion.li
            key={transaction.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.04 }}
            className="flex items-center gap-3 px-4 py-3"
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                isCredit ? "bg-owe-soft text-owe" : "bg-paid-soft text-paid"
              }`}
              aria-hidden="true"
            >
              {isCredit ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{customerName}</p>
              <p className="text-xs text-ink-faint">
                {isCredit ? "Owes" : "Paid"} · {friendlyDate(transaction.createdAt)}, {timeOfDay(transaction.createdAt)}
              </p>
            </div>
            <span className={`shrink-0 font-display text-sm font-semibold ${isCredit ? "text-owe" : "text-paid"}`}>
              {isCredit ? "" : "+"}
              {formatNaira(transaction.amount)}
            </span>
          </motion.li>
        );
      })}
    </ul>
  );
}
