import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCustomerProfile } from "@/hooks/useCustomerProfile";
import { CustomerAvatar } from "@/components/CustomerAvatar";
import { BalanceCard } from "@/components/BalanceCard";
import { TransactionTimeline } from "@/components/TransactionTimeline";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { WhatsAppReminderModal } from "@/components/WhatsAppReminderModal";

export function CustomerProfile() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const state = useCustomerProfile(customerId);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderSent, setReminderSent] = useState(false);

  if (state.status === "loading") {
    return <LoadingState label="Loading customer profile" rows={4} />;
  }

  if (state.status === "error") {
    return <ErrorState message={state.message} onRetry={() => navigate("/customers")} />;
  }

  const { customer, transactions } = state.data;
  const hasPhone = !!customer.phone;
  const hasOutstandingBalance = customer.balance > 0;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      <div className="flex flex-col items-center gap-2 text-center">
        <CustomerAvatar customer={customer} size="lg" />
        <h1 className="font-display text-2xl font-semibold text-ink">{customer.name}</h1>
        {customer.phone && (
          <p className="flex items-center gap-1.5 text-sm text-ink-soft">
            <PhoneIcon />
            {customer.phone}
          </p>
        )}
      </div>

      <BalanceCard
        label={customer.balance === 0 ? `${customer.name}'s balance` : `${customer.name} owes you`}
        amount={customer.balance}
        clearedLabel="All cleared"
      />

      <div className="flex gap-3">
        <LinkButton to="/new-entry" variant="primary" size="lg" fullWidth>
          New Entry
        </LinkButton>
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          disabled={!hasPhone || !hasOutstandingBalance}
          title={
            !hasPhone
              ? "Add a phone number to send reminders"
              : !hasOutstandingBalance
                ? "No outstanding balance to remind about"
                : undefined
          }
          onClick={() => setShowReminderModal(true)}
        >
          <WhatsAppIcon />
          Remind on WhatsApp
        </Button>
      </div>
      {!hasPhone && (
        <p className="-mt-3 text-center text-xs text-ink-faint">
          No phone number saved. Add one for {customer.name} to send WhatsApp reminders.
        </p>
      )}
      {hasPhone && !hasOutstandingBalance && (
        <p className="-mt-3 text-center text-xs text-ink-faint">{customer.name} has no outstanding balance.</p>
      )}
      {reminderSent && (
        <p role="status" className="-mt-3 text-center text-xs font-medium text-paid">
          Reminder opened in WhatsApp.
        </p>
      )}

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">History</h2>
        {transactions.length === 0 ? (
          <EmptyState
            icon={<HistoryIcon />}
            title="No activity yet"
            message={`Record ${customer.name}'s first credit or payment to see it here.`}
          />
        ) : (
          <TransactionTimeline transactions={transactions} />
        )}
      </section>

      {showReminderModal && customer.phone && (
        <WhatsAppReminderModal
          customerName={customer.name}
          phone={customer.phone}
          balance={customer.balance}
          onClose={() => setShowReminderModal(false)}
          onSent={() => setReminderSent(true)}
        />
      )}
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8.5 8.7c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.4.2.5.6 1.4.6 1.5.1.1.1.3 0 .4-.1.2-.2.3-.3.4-.1.1-.3.3-.4.4-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.8.8.3.1.5.2.5.3.1.2.1.9-.2 1.6-.3.7-1.5 1.3-2.1 1.4-.5.1-1.2.2-3.9-1-3.2-1.5-5.2-4.7-5.4-4.9-.1-.2-1.2-1.6-1.2-3.1 0-1.4.8-2.1 1-2.4z"
        fill="currentColor"
      />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 8v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 12a8 8 0 118 8" strokeLinecap="round" />
      <path d="M4 12V8m0 4h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
