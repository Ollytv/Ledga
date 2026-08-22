import { useCallback, useEffect, useState } from "react";
import type { AsyncState, DailySummary } from "@/types";
import { transactionService } from "@/services/transactionService";

export function useDailySummary() {
  const [state, setState] = useState<AsyncState<DailySummary>>({ status: "loading" });

  const load = useCallback(async () => {
    try {
      const summary = await transactionService.getTodaySummary();
      setState({ status: "success", data: summary });
    } catch {
      setState({ status: "error", message: "Couldn't load today's summary. Try again." });
    }
  }, []);

  useEffect(() => {
    load();
    return transactionService.subscribe(load);
  }, [load]);

  return state;
}
