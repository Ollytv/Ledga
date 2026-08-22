import { useState } from "react";
import { Plus, UserPlus, Users } from "lucide-react";
import { motion } from "motion/react";
import { useCustomersWithActivity } from "@/hooks/useCustomersWithActivity";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { useDailySummary } from "@/hooks/useDailySummary";
import { AnimatedAmount } from "@/components/AnimatedAmount";
import { CustomerCard } from "@/components/CustomerCard";
import { RecentActivity } from "@/components/RecentActivity";
import { DailyFlowBar } from "@/components/DailyFlowBar";
import { DashboardFlowSVG } from "@/components/svg/DashboardFlowSVG";
import { EmptyLedgerSVG } from "@/components/svg/EmptyLedgerSVG";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { AddCustomerModal } from "@/pages/AddCustomerModal";

export function Home() {
  const customersState = useCustomersWithActivity();
  const activityState = useRecentActivity(5);
  const summaryState = useDailySummary();
  const [showAddModal, setShowAddModal] = useState(false);

  const outstanding =
    customersState.status === "success" ? customersState.data.reduce((sum, c) => sum + Math.max(c.balance, 0), 0) : 0;
  const customerCount = customersState.status === "success" ? customersState.data.length : 0;
  const hasAnyCustomers = customersState.status === "success" && customersState.data.length > 0;

  return (
    <div className="space-y-8">
      {customersState.status === "success" ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl bg-ink px-6 py-9 text-center shadow-card sm:text-left"
        >
          <DashboardFlowSVG />
          <div className="relative">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-sm font-medium text-paper/60"
            >
              Total Outstanding
            </motion.p>
            <AnimatedAmount
              amount={outstanding}
              className="mt-1 block font-display text-5xl font-semibold text-paper sm:text-6xl"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="mt-2 text-sm text-paper/50"
            >
              Across {customerCount} {customerCount === 1 ? "customer" : "customers"}
            </motion.p>
          </div>
        </motion.div>
      ) : (
        <div className="h-40 animate-pulse rounded-3xl bg-ink/10" aria-hidden="true" />
      )}

      {summaryState.status === "success" && summaryState.data.transactionCount > 0 && (
        <DailyFlowBar totalCredit={summaryState.data.totalCredit} totalCollected={summaryState.data.totalCollected} />
      )}

      <div className="grid grid-cols-2 gap-3">
        <LinkButton
          to="/new-entry"
          variant="primary"
          size="lg"
          fullWidth
          icon={<Plus size={18} />}
          className="shadow-glow"
        >
          New Transaction
        </LinkButton>
        <Button variant="secondary" size="lg" fullWidth icon={<UserPlus size={18} />} onClick={() => setShowAddModal(true)}>
          Add Customer
        </Button>
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">Customers</h2>

        {customersState.status === "loading" && <LoadingState label="Loading customers" rows={3} />}
        {customersState.status === "error" && <ErrorState message={customersState.message} />}

        {customersState.status === "success" && customersState.data.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-surface/60 px-6 py-10 text-center">
            <EmptyLedgerSVG />
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">Your business story starts here.</h3>
              <p className="mt-1 text-sm text-ink-soft">
                Record your first transaction and let Ledga keep track from here.
              </p>
            </div>
            <Button variant="primary" size="md" icon={<Users size={16} />} onClick={() => setShowAddModal(true)}>
              Add Customer
            </Button>
          </div>
        )}

        {hasAnyCustomers && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {(customersState.status === "success" ? customersState.data : []).slice(0, 8).map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        )}
      </section>

      {activityState.status === "success" && activityState.data.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-ink">Recent Activity</h2>
          <RecentActivity entries={activityState.data} />
        </section>
      )}

      {showAddModal && <AddCustomerModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
