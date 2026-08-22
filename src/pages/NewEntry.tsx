import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomers } from "@/hooks/useCustomers";
import { CustomerAvatar } from "@/components/CustomerAvatar";
import { AmountDisplay } from "@/components/AmountDisplay";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { AddCustomerModal } from "@/pages/AddCustomerModal";
import { VoiceAmountInput } from "@/components/VoiceAmountInput";
import { SuccessBurst } from "@/components/svg/SuccessBurst";
import { transactionService } from "@/services/transactionService";
import { formatNaira, parseAmountInput } from "@/utils/currency";
import type { Customer, TransactionType } from "@/types";

type Step = "customer" | "type" | "amount" | "confirm" | "success";

export function NewEntry() {
  const navigate = useNavigate();
  const customersState = useCustomers();

  const [step, setStep] = useState<Step>("customer");
  const [query, setQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [type, setType] = useState<TransactionType | null>(null);
  const [amountInput, setAmountInput] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredCustomers = useMemo(() => {
    if (customersState.status !== "success") return [];
    const q = query.trim().toLowerCase();
    if (!q) return customersState.data;
    return customersState.data.filter((c) => c.name.toLowerCase().includes(q));
  }, [customersState, query]);

  async function handleSave() {
    if (!selectedCustomer || !type) return;
    const amount = parseAmountInput(amountInput);
    if (!amount) return;

    setSaving(true);
    setSaveError(null);
    try {
      await transactionService.create({ customerId: selectedCustomer.id, type, amount });
      setStep("success");
    } catch {
      setSaveError("Couldn't save this entry. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleAmountContinue() {
    const amount = parseAmountInput(amountInput);
    if (!amount) {
      setAmountError("Enter an amount greater than zero.");
      return;
    }
    setAmountError(null);
    setStep("confirm");
  }

  function reset() {
    setStep("customer");
    setSelectedCustomer(null);
    setType(null);
    setAmountInput("");
    setAmountError(null);
    setSaveError(null);
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {step !== "success" && <StepIndicator step={step} />}

      {step === "customer" && (
        <section>
          <h1 className="mb-4 font-display text-2xl font-semibold text-ink">Who is this for?</h1>

          {customersState.status === "success" && customersState.data.length > 3 && (
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers"
              aria-label="Search customers"
              className="mb-4 min-h-12 w-full rounded-xl border border-border bg-surface px-4 text-base text-ink outline-none focus-visible:border-gold-deep"
            />
          )}

          {customersState.status === "loading" && <LoadingState label="Loading customers" rows={3} />}
          {customersState.status === "error" && <ErrorState message={customersState.message} />}

          {customersState.status === "success" && customersState.data.length === 0 && (
            <EmptyState
              icon={<PeopleIcon />}
              title="No customers yet"
              message="Add a customer first, then record what they owe."
              action={
                <Button variant="primary" size="md" onClick={() => setShowAddModal(true)}>
                  + Add Customer
                </Button>
              }
            />
          )}

          {customersState.status === "success" && customersState.data.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {filteredCustomers.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setStep("type");
                  }}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-3 text-center transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
                >
                  <CustomerAvatar customer={customer} size="md" />
                  <span className="text-sm font-semibold text-ink">{customer.name}</span>
                </button>
              ))}

              <button
                onClick={() => setShowAddModal(true)}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-transparent p-3 text-center text-ink-faint transition-colors hover:bg-surface"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-border">
                  <PlusIcon />
                </div>
                <span className="text-sm font-semibold">New</span>
              </button>
            </div>
          )}
        </section>
      )}

      {step === "type" && selectedCustomer && (
        <section>
          <BackButton onClick={() => setStep("customer")} />
          <div className="mb-6 flex items-center gap-3">
            <CustomerAvatar customer={selectedCustomer} size="md" />
            <h1 className="font-display text-2xl font-semibold text-ink">{selectedCustomer.name}</h1>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={() => {
                setType("credit");
                setStep("amount");
              }}
              className="flex flex-col items-center gap-2 rounded-3xl border-2 border-owe bg-owe-soft px-6 py-10 text-center transition-transform hover:-translate-y-0.5"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 5v14M12 19l-5-5M12 19l5-5" stroke="#D14343" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-display text-xl font-bold text-owe">They Owe Me</span>
            </button>

            <button
              onClick={() => {
                setType("payment");
                setStep("amount");
              }}
              className="flex flex-col items-center gap-2 rounded-3xl border-2 border-paid bg-paid-soft px-6 py-10 text-center transition-transform hover:-translate-y-0.5"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 19V5M12 5l-5 5M12 5l5 5" stroke="#17825A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-display text-xl font-bold text-paid">They Paid</span>
            </button>
          </div>
        </section>
      )}

      {step === "amount" && selectedCustomer && type && (
        <section>
          <BackButton onClick={() => setStep("type")} />
          <h1 className="mb-1 font-display text-2xl font-semibold text-ink">
            How much{type === "payment" ? " did they pay" : ""}?
          </h1>
          <p className="mb-6 text-sm text-ink-soft">
            {selectedCustomer.name} · {type === "credit" ? "They owe me" : "They paid"}
          </p>

          <VoiceAmountInput
            onConfirm={(amount) => {
              setAmountInput(String(amount));
              setAmountError(null);
              setStep("confirm");
            }}
          />

          <label htmlFor="amount-input" className="mb-1 block text-sm font-semibold text-ink">
            Amount (₦)
          </label>
          <input
            id="amount-input"
            type="text"
            inputMode="numeric"
            value={amountInput}
            onChange={(e) => {
              setAmountInput(e.target.value);
              if (amountError) setAmountError(null);
            }}
            placeholder="15,000"
            autoFocus
            aria-invalid={!!amountError}
            aria-describedby={amountError ? "amount-error" : undefined}
            className="min-h-16 w-full rounded-2xl border border-border bg-surface px-5 text-3xl font-display font-semibold text-ink outline-none focus-visible:border-gold-deep"
          />
          {amountError && (
            <p id="amount-error" role="alert" className="mt-2 text-sm font-medium text-owe">
              {amountError}
            </p>
          )}

          {parseAmountInput(amountInput) !== null && (
            <p className="mt-3 text-center">
              <AmountDisplay amount={parseAmountInput(amountInput)!} tone="gold" size="lg" />
            </p>
          )}

          <Button variant="primary" size="lg" fullWidth className="mt-6" onClick={handleAmountContinue}>
            Continue
          </Button>
        </section>
      )}

      {step === "confirm" && selectedCustomer && type && (
        <section>
          <BackButton onClick={() => setStep("amount")} />
          <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Confirm entry</h1>

          <div className="space-y-4 rounded-3xl border border-border bg-surface p-6 shadow-card">
            <Row label="Customer">
              <div className="flex items-center gap-2">
                <CustomerAvatar customer={selectedCustomer} size="sm" />
                <span className="font-display text-lg font-semibold text-ink">{selectedCustomer.name}</span>
              </div>
            </Row>
            <Row label="Transaction">
              <span className={`font-display text-lg font-semibold ${type === "credit" ? "text-owe" : "text-paid"}`}>
                {type === "credit" ? "They owe me" : "They paid"}
              </span>
            </Row>
            <Row label="Amount">
              <AmountDisplay amount={parseAmountInput(amountInput) ?? 0} tone={type === "credit" ? "owe" : "paid"} size="md" />
            </Row>
          </div>

          {saveError && (
            <p role="alert" className="mt-4 text-sm font-medium text-owe">
              {saveError}
            </p>
          )}

          <Button variant="primary" size="lg" fullWidth className="mt-6" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Entry"}
          </Button>
        </section>
      )}

      {step === "success" && selectedCustomer && type && (
        <section className="flex flex-col items-center gap-2 py-6 text-center">
          <SuccessBurst />
          <h1 className="font-display text-2xl font-semibold text-ink">Entry saved</h1>
          <p className="text-ink-soft">
            {selectedCustomer.name} {type === "credit" ? "now owes" : "paid"}{" "}
            <strong className="text-ink">{formatNaira(parseAmountInput(amountInput) ?? 0)}</strong>
          </p>
          <div className="mt-2 flex w-full max-w-xs flex-col gap-3">
            <Button variant="primary" size="lg" fullWidth onClick={() => navigate(`/customers/${selectedCustomer.id}`)}>
              View {selectedCustomer.name}'s Profile
            </Button>
            <Button variant="secondary" size="lg" fullWidth onClick={reset}>
              Add Another Entry
            </Button>
          </div>
        </section>
      )}

      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onCreated={() => {
            /* the customers list re-renders reactively via the store subscription */
          }}
        />
      )}
    </div>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const steps: Step[] = ["customer", "type", "amount", "confirm"];
  const activeIndex = steps.indexOf(step);
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      {steps.map((s, i) => (
        <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= activeIndex ? "bg-gold" : "bg-border"}`} />
      ))}
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back
    </button>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-ink-faint">{label}</span>
      {children}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 8a3 3 0 100 6M17 14c2.2 0 5 1.3 5 4v2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
