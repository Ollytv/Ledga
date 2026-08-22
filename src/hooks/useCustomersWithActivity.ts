import { useCallback, useEffect, useState } from "react";
import type { AsyncState } from "@/types";
import { customerService, type CustomerWithActivity } from "@/services/customerService";

export function useCustomersWithActivity() {
  const [state, setState] = useState<AsyncState<CustomerWithActivity[]>>({ status: "loading" });

  const load = useCallback(async () => {
    try {
      const customers = await customerService.listWithActivity();
      setState({ status: "success", data: customers });
    } catch {
      setState({ status: "error", message: "Couldn't load your customers. Check your connection and try again." });
    }
  }, []);

  useEffect(() => {
    load();
    return customerService.subscribe(load);
  }, [load]);

  return state;
}
