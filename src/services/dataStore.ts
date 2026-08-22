import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import type { Customer, Transaction } from "@/types";

interface StoreShape {
  customers: Customer[];
  transactions: Transaction[];
}

/** A promise plus its resolver, used to let reads wait for the first Firestore snapshot. */
interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
}

function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

function toIso(value: unknown): string {
  return value instanceof Timestamp ? value.toDate().toISOString() : new Date().toISOString();
}

function customerFromDoc(snap: QueryDocumentSnapshot<DocumentData>): Customer {
  const data = snap.data();
  return {
    id: snap.id,
    name: typeof data.name === "string" ? data.name : "",
    phone: typeof data.phone === "string" && data.phone ? data.phone : undefined,
    avatarUrl: typeof data.photoUrl === "string" && data.photoUrl ? data.photoUrl : undefined,
    balance: 0, // overwritten by withDerivedBalances before this ever reaches a consumer
    createdAt: toIso(data.createdAt),
  };
}

function transactionFromDoc(snap: QueryDocumentSnapshot<DocumentData>): Transaction {
  const data = snap.data();
  return {
    id: snap.id,
    customerId: typeof data.customerId === "string" ? data.customerId : "",
    type: data.type === "payment" ? "payment" : "credit",
    amount: typeof data.amount === "number" ? data.amount : 0,
    note: typeof data.note === "string" && data.note ? data.note : undefined,
    createdAt: toIso(data.createdAt),
  };
}

/**
 * Recomputes each customer's balance from the transaction ledger. The
 * ledger — not any stored balance field — is the source of truth; this
 * keeps balances correct even if a write is retried, arrives out of order,
 * or a future feature edits/deletes a past transaction.
 */
function withDerivedBalances(customers: Customer[], transactions: Transaction[]): Customer[] {
  const balances = new Map<string, number>();
  for (const txn of transactions) {
    const delta = txn.type === "credit" ? txn.amount : -txn.amount;
    balances.set(txn.customerId, (balances.get(txn.customerId) ?? 0) + delta);
  }
  return customers.map((c) => ({ ...c, balance: balances.get(c.id) ?? 0 }));
}

let state: StoreShape = { customers: [], transactions: [] };
let userId: string | null = null;
let unsubCustomers: Unsubscribe | null = null;
let unsubTransactions: Unsubscribe | null = null;
let customersReady = createDeferred<void>();
let transactionsReady = createDeferred<void>();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function teardownListeners() {
  unsubCustomers?.();
  unsubTransactions?.();
  unsubCustomers = null;
  unsubTransactions = null;
}

/** Attaches real-time listeners scoped to this trader's own subtree: users/{uid}/... */
function attach(uid: string) {
  teardownListeners();
  userId = uid;
  state = { customers: [], transactions: [] };
  customersReady = createDeferred<void>();
  transactionsReady = createDeferred<void>();

  unsubCustomers = onSnapshot(
    collection(db, "users", uid, "customers"),
    (snap) => {
      state = { ...state, customers: snap.docs.map(customerFromDoc) };
      customersReady.resolve();
      notify();
    },
    () => {
      // Read denied or offline — resolve so callers don't hang forever; the
      // resulting empty list plus service-layer error handling covers it.
      customersReady.resolve();
      notify();
    },
  );

  unsubTransactions = onSnapshot(
    collection(db, "users", uid, "transactions"),
    (snap) => {
      state = { ...state, transactions: snap.docs.map(transactionFromDoc) };
      transactionsReady.resolve();
      notify();
    },
    () => {
      transactionsReady.resolve();
      notify();
    },
  );
}

function detach() {
  teardownListeners();
  userId = null;
  state = { customers: [], transactions: [] };
  customersReady = createDeferred<void>();
  transactionsReady = createDeferred<void>();
  notify();
}

// Keep the store in lockstep with auth: attach real-time listeners for the
// signed-in trader's own data, and tear everything down (never leaking one
// trader's cached data into the next) on logout.
onAuthStateChanged(auth, (user) => {
  if (user) attach(user.uid);
  else detach();
});

function requireUserId(): string {
  if (!userId) throw new Error("You need to be logged in to do that.");
  return userId;
}

/**
 * Firestore-backed store. Reads come from a live, per-trader cache kept in
 * sync via onSnapshot; writes go straight to Firestore and the cache
 * updates itself when the snapshot listener fires (including an optimistic
 * local update before the server acknowledges).
 */
export const dataStore = {
  async getCustomers(): Promise<Customer[]> {
    if (!userId) return [];
    await Promise.all([customersReady.promise, transactionsReady.promise]);
    return withDerivedBalances(state.customers, state.transactions);
  },

  async getCustomer(id: string): Promise<Customer | null> {
    if (!userId) return null;
    await Promise.all([customersReady.promise, transactionsReady.promise]);
    const found = withDerivedBalances(state.customers, state.transactions).find((c) => c.id === id);
    return found ?? null;
  },

  async addCustomer(input: { name: string; phone?: string }): Promise<Customer> {
    const uid = requireUserId();
    const name = input.name.trim();
    const phone = input.phone?.trim() || undefined;
    const docRef = await addDoc(collection(db, "users", uid, "customers"), {
      name,
      phone: phone ?? null,
      photoUrl: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, name, phone, balance: 0, createdAt: new Date().toISOString() };
  },

  async getTransactions(customerId: string): Promise<Transaction[]> {
    if (!userId) return [];
    await transactionsReady.promise;
    return state.transactions
      .filter((t) => t.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getAllTransactions(): Promise<Transaction[]> {
    if (!userId) return [];
    await transactionsReady.promise;
    return [...state.transactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addTransaction(input: {
    customerId: string;
    type: Transaction["type"];
    amount: number;
    note?: string;
  }): Promise<Transaction> {
    const uid = requireUserId();
    const note = input.note?.trim() || undefined;
    const docRef = await addDoc(collection(db, "users", uid, "transactions"), {
      customerId: input.customerId,
      type: input.type,
      amount: input.amount,
      note: note ?? null,
      createdAt: serverTimestamp(),
    });
    return {
      id: docRef.id,
      customerId: input.customerId,
      type: input.type,
      amount: input.amount,
      note,
      createdAt: new Date().toISOString(),
    };
  },

  /** Registers a listener called after every store change (Firestore updates, or sign-in/out). Returns an unsubscribe function. */
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
