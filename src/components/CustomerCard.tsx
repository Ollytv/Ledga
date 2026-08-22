import { Link } from "react-router-dom";
import { motion } from "motion/react";
import type { Customer } from "@/types";
import { CustomerAvatar } from "@/components/CustomerAvatar";
import { formatNaira } from "@/utils/currency";
import { friendlyDate } from "@/utils/date";

interface CustomerCardProps {
  customer: Customer & { lastActivityAt?: string };
}

const MotionLink = motion.create(Link);

export function CustomerCard({ customer }: CustomerCardProps) {
  const cleared = customer.balance === 0;

  return (
    <MotionLink
      to={`/customers/${customer.id}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-4 text-center shadow-card"
    >
      <div className="relative">
        <CustomerAvatar customer={customer} size="lg" />
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-surface ${
            cleared ? "bg-paid" : "bg-owe"
          }`}
          aria-hidden="true"
        />
      </div>
      <span className="font-display font-semibold text-ink">{customer.name}</span>
      {cleared ? (
        <span className="rounded-full bg-paid-soft px-2.5 py-0.5 text-xs font-semibold text-paid">Cleared</span>
      ) : (
        <span className="text-sm font-bold text-owe">{formatNaira(customer.balance)}</span>
      )}
      {customer.lastActivityAt && (
        <span className="text-xs text-ink-faint">{friendlyDate(customer.lastActivityAt)}</span>
      )}
    </MotionLink>
  );
}
