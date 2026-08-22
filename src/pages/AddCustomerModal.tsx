import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { customerService } from "@/services/customerService";

interface AddCustomerModalProps {
  onClose: () => void;
  /** Called with the new customer's id right after a successful save. */
  onCreated?: (customerId: string) => void;
}

export function AddCustomerModal({ onClose, onCreated }: AddCustomerModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Enter the customer's name.");
      return;
    }
    if (phone.trim() && !/^[0-9+\s-]{7,15}$/.test(phone.trim())) {
      setError("Enter a valid phone number, or leave it blank.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const customer = await customerService.create({ name: trimmedName, phone: phone.trim() || undefined });
      onCreated?.(customer.id);
      onClose();
    } catch {
      setError("Couldn't save this customer. Try again.");
      setSaving(false);
    }
  }

  return (
    <Modal title="Add Customer" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="customer-name" className="mb-1 block text-sm font-semibold text-ink">
            Name
          </label>
          <input
            id="customer-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Bola"
            autoComplete="off"
            className="min-h-12 w-full rounded-xl border border-border bg-paper px-4 text-base text-ink outline-none focus-visible:border-gold-deep"
          />
        </div>

        <div>
          <label htmlFor="customer-phone" className="mb-1 block text-sm font-semibold text-ink">
            Phone number <span className="font-normal text-ink-faint">(optional)</span>
          </label>
          <input
            id="customer-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 0803 123 4567"
            autoComplete="off"
            className="min-h-12 w-full rounded-xl border border-border bg-paper px-4 text-base text-ink outline-none focus-visible:border-gold-deep"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-owe">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={saving}>
          {saving ? "Saving…" : "Save Customer"}
        </Button>
      </form>
    </Modal>
  );
}
