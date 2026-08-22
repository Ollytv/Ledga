/** Custom illustration for the "no transactions yet" dashboard state — an open ledger with a gently pulsing entry line, not stock clip-art. */
export function EmptyLedgerSVG({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <rect x="18" y="24" width="84" height="76" rx="10" fill="#EAEDFC" />
      <rect x="18" y="24" width="84" height="76" rx="10" stroke="#3652E0" strokeOpacity="0.15" />
      <path d="M60 24v76" stroke="#3652E0" strokeOpacity="0.25" strokeWidth="1.5" />
      <rect x="30" y="40" width="20" height="4" rx="2" fill="#3652E0" opacity="0.3" />
      <rect x="30" y="50" width="14" height="4" rx="2" fill="#3652E0" opacity="0.2" />
      <rect x="70" y="40" width="20" height="4" rx="2" fill="#17825A" opacity="0.3" />
      <rect x="70" y="50" width="14" height="4" rx="2" fill="#17825A" opacity="0.2" />
      <circle cx="60" cy="76" r="18" fill="#3652E0" className="animate-glow-breathe" opacity="0.12" />
      <path
        d="M50 76h20M60 66v20"
        stroke="#3652E0"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="animate-drift-slow"
      />
    </svg>
  );
}
