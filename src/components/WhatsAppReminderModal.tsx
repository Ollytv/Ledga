import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatNaira } from "@/utils/currency";
import { buildReminderMessage, buildWhatsAppLink, normalizeNigerianPhone } from "@/utils/whatsapp";

interface WhatsAppReminderModalProps {
  customerName: string;
  /** Raw phone as stored on the customer record. */
  phone: string;
  /** Current outstanding balance — always the latest derived balance, never a stale figure. */
  balance: number;
  onClose: () => void;
  /** Called once the trader actually opens WhatsApp (for optional "Reminder Queued" UI). */
  onSent?: () => void;
}

export function WhatsAppReminderModal({
  customerName,
  phone,
  balance,
  onClose,
  onSent,
}: WhatsAppReminderModalProps) {
  const normalized = normalizeNigerianPhone(phone);
  const message = buildReminderMessage(customerName, balance);

  if (!normalized) {
    return (
      <Modal title="Send Reminder" onClose={onClose}>
        <p className="text-sm text-ink-soft">
          The saved phone number for {customerName} doesn't look like a valid Nigerian number, so a WhatsApp
          reminder can't be sent yet.
        </p>
        <Button variant="primary" size="lg" fullWidth className="mt-5" onClick={onClose}>
          Close
        </Button>
      </Modal>
    );
  }

  return (
    <Modal title="Send Payment Reminder?" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-ink">{customerName}</span>
          <span className="font-display text-lg font-semibold text-owe">{formatNaira(balance)} outstanding</span>
        </div>

        <div className="rounded-2xl border border-border bg-paper p-4">
          <p className="text-sm text-ink-soft">{message}</p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" size="lg" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => {
              window.open(buildWhatsAppLink(normalized, message), "_blank", "noopener,noreferrer");
              onSent?.();
              onClose();
            }}
          >
            Open WhatsApp
          </Button>
        </div>
      </div>
    </Modal>
  );
}
