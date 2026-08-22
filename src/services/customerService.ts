import type { Customer } from "@/types";
import { dataStore } from "@/services/dataStore";

export interface AddCustomerInput {
  name: string;
  phone?: string;
}

export interface CustomerWithActivity extends Customer {
  /** ISO timestamp of this customer's most recent transaction, if any. */
  lastActivityAt?: string;
}

export const customerService = {
  async list(): Promise<Customer[]> {
    const customers = await dataStore.getCustomers();
    return customers.sort((a, b) => b.balance - a.balance);
  },

  /** Customers plus each one's most recent transaction date — for cards that show "last activity". */
  async listWithActivity(): Promise<CustomerWithActivity[]> {
    const [customers, transactions] = await Promise.all([dataStore.getCustomers(), dataStore.getAllTransactions()]);
    const lastActivityById = new Map<string, string>();
    // transactions are already newest-first, so the first hit per customer wins.
    for (const txn of transactions) {
      if (!lastActivityById.has(txn.customerId)) {
        lastActivityById.set(txn.customerId, txn.createdAt);
      }
    }
    return customers
      .map((c) => ({ ...c, lastActivityAt: lastActivityById.get(c.id) }))
      .sort((a, b) => b.balance - a.balance);
  },

  async get(id: string): Promise<Customer | null> {
    return dataStore.getCustomer(id);
  },

  async create(input: AddCustomerInput): Promise<Customer> {
    if (!input.name.trim()) {
      throw new Error("Customer name is required.");
    }
    return dataStore.addCustomer(input);
  },

  subscribe(listener: () => void): () => void {
    return dataStore.subscribe(listener);
  },
};
