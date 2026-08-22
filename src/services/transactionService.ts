import type { DailySummary, Transaction, TransactionType } from "@/types";
import { dataStore } from "@/services/dataStore";
import { isSameDay, todayIso } from "@/utils/date";

export interface AddTransactionInput {
  customerId: string;
  type: TransactionType;
  amount: number;
  note?: string;
}

export const transactionService = {
  async listForCustomer(customerId: string): Promise<Transaction[]> {
    return dataStore.getTransactions(customerId);
  },

  /** Most recent transactions across all customers, newest first — powers the dashboard activity feed. */
  async listRecent(limit: number): Promise<Transaction[]> {
    const all = await dataStore.getAllTransactions();
    return all.slice(0, limit);
  },

  async create(input: AddTransactionInput): Promise<Transaction> {
    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      throw new Error("Enter an amount greater than zero.");
    }
    return dataStore.addTransaction(input);
  },

  async getTodaySummary(): Promise<DailySummary> {
    const all = await dataStore.getAllTransactions();
    const today = todayIso();
    const todaysTxns = all.filter((t) => isSameDay(t.createdAt, today));

    const totalCredit = todaysTxns.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0);
    const totalCollected = todaysTxns.filter((t) => t.type === "payment").reduce((sum, t) => sum + t.amount, 0);

    return {
      date: today,
      totalCredit,
      totalCollected,
      stillOwed: totalCredit - totalCollected,
      transactionCount: todaysTxns.length,
    };
  },

  subscribe(listener: () => void): () => void {
    return dataStore.subscribe(listener);
  },
};
