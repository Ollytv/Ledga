import { useCallback, useEffect, useState } from "react";
import type { AsyncState, Customer } from "@/types";
import { customerService } from "@/services/customerService";

export function useCustomers() {
  const [state, setState] = useState<AsyncState<Customer[]>>({ status: "loading" });

  const load = useCallback(async () => {
    try {
      const customers = await customerService.list();
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
