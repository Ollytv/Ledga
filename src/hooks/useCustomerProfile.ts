import { useCallback, useEffect, useState } from "react";
import type { AsyncState, Customer, Transaction } from "@/types";
import { customerService } from "@/services/customerService";
import { transactionService } from "@/services/transactionService";

export interface CustomerProfile {
  customer: Customer;
  transactions: Transaction[];
}

export function useCustomerProfile(customerId: string | undefined) {
  const [state, setState] = useState<AsyncState<CustomerProfile>>({ status: "loading" });

  const load = useCallback(async () => {
    if (!customerId) {
      setState({ status: "error", message: "No customer selected." });
      return;
    }
    try {
      const [customer, transactions] = await Promise.all([
        customerService.get(customerId),
        transactionService.listForCustomer(customerId),
      ]);
      if (!customer) {
        setState({ status: "error", message: "We couldn't find this customer." });
        return;
      }
      setState({ status: "success", data: { customer, transactions } });
    } catch {
      setState({ status: "error", message: "Couldn't load this customer's profile. Try again." });
    }
  }, [customerId]);

  useEffect(() => {
    setState({ status: "loading" });
    load();
    return transactionService.subscribe(load);
  }, [load]);

  return state;
}
