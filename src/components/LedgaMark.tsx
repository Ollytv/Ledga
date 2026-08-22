interface LedgaMarkProps {
  size?: number;
  pulse?: boolean;
  className?: string;
}

/** The Ledga mark: two ledger lines resolving into a checkmark — a balance, confirmed. */
export function LedgaMark({ size = 36, pulse = false, className = "" }: LedgaMarkProps) {
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-2xl bg-ink ${pulse ? "animate-brand-pulse" : ""} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 32 32" fill="none">
        <rect x="6" y="7" width="20" height="3" rx="1.5" fill="#3652E0" />
        <rect x="6" y="14" width="13" height="3" rx="1.5" fill="#3652E0" opacity="0.55" />
        <path
          d="M6 21.5h8l3.2 3.2L26 15.5"
          stroke="#3652E0"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
