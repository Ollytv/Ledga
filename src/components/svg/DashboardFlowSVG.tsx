/**
 * Premium animated backdrop for the dashboard hero. Purely decorative
 * (aria-hidden) — soft flowing ledger lines + a breathing glow orb, built
 * from gradients and dash-offset animation only (transform/opacity), so it
 * stays cheap on mobile and is fully muted by `prefers-reduced-motion`.
 */
export function DashboardFlowSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 220"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="heroOrb" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3652E0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#3652E0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="heroLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3652E0" stopOpacity="0" />
          <stop offset="50%" stopColor="#7C8CFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3652E0" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* breathing glow orb, top-right */}
      <circle cx="380" cy="40" r="140" fill="url(#heroOrb)" className="animate-glow-breathe" />
      {/* second, smaller orb, bottom-left, offset timing via slower drift */}
      <circle
        cx="60"
        cy="190"
        r="90"
        fill="url(#heroOrb)"
        opacity="0.35"
        className="animate-drift-slower"
      />

      {/* flowing ledger lines */}
      <path
        d="M-20 150 C 100 120, 160 180, 260 140 S 420 90, 500 110"
        stroke="url(#heroLine)"
        strokeWidth="1.5"
        strokeDasharray="6 10"
        className="animate-dash-flow"
      />
      <path
        d="M-20 70 C 90 40, 180 100, 280 60 S 440 20, 500 50"
        stroke="url(#heroLine)"
        strokeWidth="1"
        strokeDasharray="4 12"
        opacity="0.6"
        className="animate-dash-flow"
        style={{ animationDuration: "8s", animationDirection: "reverse" }}
      />

      {/* floating nodes, gently drifting */}
      <circle cx="120" cy="60" r="2.5" fill="#7C8CFF" className="animate-drift-slow" />
      <circle cx="330" cy="150" r="2" fill="#3652E0" className="animate-drift-slower" opacity="0.8" />
      <circle cx="420" cy="80" r="3" fill="#7C8CFF" className="animate-drift-slow" opacity="0.6" />
    </svg>
  );
}
