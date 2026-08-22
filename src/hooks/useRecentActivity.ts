import { useCallback, useEffect, useState } from "react";
import type { AsyncState, Transaction } from "@/types";
import { customerService } from "@/services/customerService";
import { transactionService } from "@/services/transactionService";

export interface ActivityEntry {
  transaction: Transaction;
  customerName: string;
}

export function useRecentActivity(limit = 5) {
  const [state, setState] = useState<AsyncState<ActivityEntry[]>>({ status: "loading" });

  const load = useCallback(async () => {
    try {
      const [customers, transactions] = await Promise.all([
        customerService.list(),
        transactionService.listRecent(limit),
      ]);
      const nameById = new Map(customers.map((c) => [c.id, c.name]));
      const entries = transactions.map((transaction) => ({
        transaction,
        customerName: nameById.get(transaction.customerId) ?? "Unknown",
      }));
      setState({ status: "success", data: entries });
    } catch {
      setState({ status: "error", message: "Couldn't load recent activity. Try again." });
    }
  }, [limit]);

  useEffect(() => {
    load();
    return transactionService.subscribe(load);
  }, [load]);

  return state;
}
