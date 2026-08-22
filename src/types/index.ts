/**
 * Core domain types for Ledga.
 *
 * Amounts are always stored as integer Naira (no kobo, no floats) to avoid
 * floating-point rounding issues with money. Format for display with
 * `formatNaira` from `@/utils/currency`.
 */

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  /** Data URL or remote URL for a photo. Falls back to initials when absent. */
  avatarUrl?: string;
  /** Denormalized running balance in whole Naira. Positive = they owe you. */
  balance: number;
  createdAt: string; // ISO date
}

export type TransactionType = "credit" | "payment";

export interface Transaction {
  id: string;
  customerId: string;
  type: TransactionType;
  /** Always a positive integer, whole Naira. */
  amount: number;
  createdAt: string; // ISO date
  note?: string;
}

export interface DailySummary {
  date: string; // ISO date (day)
  totalCredit: number;
  totalCollected: number;
  stillOwed: number;
  transactionCount: number;
}

/** Discriminated async-state shape used by data hooks. */
export type AsyncState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };
