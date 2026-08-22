import { useMemo, useState } from "react";
import { Search, UserPlus, Users } from "lucide-react";
import { useCustomersWithActivity } from "@/hooks/useCustomersWithActivity";
import { CustomerCard } from "@/components/CustomerCard";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { AddCustomerModal } from "@/pages/AddCustomerModal";

export function Customers() {
  const state = useCustomersWithActivity();
  const [showAddModal, setShowAddModal] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (state.status !== "success") return [];
    const q = query.trim().toLowerCase();
    if (!q) return state.data;
    return state.data.filter((c) => c.name.toLowerCase().includes(q));
  }, [state, query]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Customers</h1>
        <Button variant="primary" size="md" onClick={() => setShowAddModal(true)} icon={<UserPlus size={16} />}>
          Add
        </Button>
      </div>

      {state.status === "success" && state.data.length > 0 && (
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers"
            aria-label="Search customers"
            className="min-h-12 w-full rounded-xl border border-border bg-surface pl-11 pr-4 text-base text-ink outline-none focus-visible:border-gold-deep"
          />
        </div>
      )}

      {state.status === "loading" && <LoadingState label="Loading customers" rows={4} />}

      {state.status === "error" && <ErrorState message={state.message} />}

      {state.status === "success" && state.data.length === 0 && (
        <EmptyState
          icon={<Users size={24} />}
          title="No customers yet"
          message="Add your first customer to start tracking who owes you."
          action={
            <Button variant="primary" size="md" onClick={() => setShowAddModal(true)}>
              + Add Customer
            </Button>
          }
        />
      )}

      {state.status === "success" && state.data.length > 0 && filtered.length === 0 && (
        <EmptyState
          icon={<Search size={24} />}
          title="No matches"
          message={`No customers match "${query}".`}
        />
      )}

      {filtered.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}

      {showAddModal && <AddCustomerModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
