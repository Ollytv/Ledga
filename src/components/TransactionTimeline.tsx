import type { Transaction } from "@/types";
import { TransactionItem } from "@/components/TransactionItem";
import { friendlyDate } from "@/utils/date";

interface TransactionTimelineProps {
  transactions: Transaction[];
}

export function TransactionTimeline({ transactions }: TransactionTimelineProps) {
  const groups: { label: string; items: Transaction[] }[] = [];

  for (const txn of transactions) {
    const label = friendlyDate(txn.createdAt);
    const lastGroup = groups[groups.length - 1];
    if (lastGroup?.label === label) {
      lastGroup.items.push(txn);
    } else {
      groups.push({ label, items: [txn] });
    }
  }

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div key={group.label}>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-faint">{group.label}</h3>
          <ul className="space-y-2">
            {group.items.map((txn) => (
              <TransactionItem key={txn.id} transaction={txn} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
