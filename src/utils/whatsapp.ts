import { formatNaira } from "@/utils/currency";

/**
 * Normalizes common Nigerian phone number formats into the digits-only
 * international format WhatsApp's click-to-chat link expects (234XXXXXXXXXX).
 * Returns null when the number can't confidently be normalized.
 *
 * Accepts:
 *  - "08012345678"        (11-digit local, leading 0)
 *  - "2348012345678"      (already international, no +)
 *  - "+2348012345678"     (international with +)
 *  - "8012345678"         (10-digit, no leading 0)
 * Tolerates spaces/hyphens/parentheses anywhere in the input.
 */
export function normalizeNigerianPhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;

  if (digits.startsWith("234") && digits.length === 13) {
    return digits;
  }
  if (digits.startsWith("0") && digits.length === 11) {
    return `234${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    return `234${digits}`;
  }

  return null;
}

/** Generates a polite, balance-aware WhatsApp reminder message for a customer. */
export function buildReminderMessage(customerName: string, balance: number): string {
  return `Hello ${customerName}, this is a friendly reminder that you currently have an outstanding balance of ${formatNaira(
    balance,
  )}. Please let me know when you are able to make payment. Thank you.`;
}

/** Builds a WhatsApp click-to-chat URL with a pre-filled, URL-encoded message. */
export function buildWhatsAppLink(normalizedPhone: string, message: string): string {
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
