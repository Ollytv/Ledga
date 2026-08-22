import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { LedgaMark } from "@/components/LedgaMark";
import { AnimatedAmount } from "@/components/AnimatedAmount";

interface AuthShellProps {
  headline: string;
  subtext: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

const FLOATING_CARDS = [
  { name: "Bola", amount: "+₦15,000", tone: "paid" as const, top: "18%", left: "8%", delay: 0 },
  { name: "Aisha", amount: "₦30,000", tone: "owe" as const, top: "56%", left: "62%", delay: 0.5 },
  { name: "Tunde", amount: "+₦5,000", tone: "paid" as const, top: "72%", left: "12%", delay: 1 },
];

export function AuthShell({ headline, subtext, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-screen bg-paper md:grid-cols-2">
      {/* Left: decorative, desktop-only visual environment */}
      <div className="relative hidden overflow-hidden bg-ink md:block">
        <div className="bg-ledga-mesh absolute inset-0" aria-hidden="true" />

        <div className="relative flex h-full flex-col justify-between p-10" aria-hidden="true">
          <Link to="/" className="flex items-center gap-2.5">
            <LedgaMark size={36} />
            <span className="font-display text-lg font-semibold text-paper">Ledga</span>
          </Link>

          <div className="relative flex-1">
            {FLOATING_CARDS.map((card) => (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: [0, -10, 0] }}
                transition={{
                  opacity: { duration: 0.5, delay: card.delay },
                  y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: card.delay },
                }}
                className="absolute w-44 rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-md"
                style={{ top: card.top, left: card.left }}
              >
                <p className="text-xs font-medium text-paper/60">{card.name}</p>
                <p className={`font-display text-lg font-semibold ${card.tone === "paid" ? "text-paid" : "text-owe"}`}>
                  {card.amount}
                </p>
              </motion.div>
            ))}
          </div>

          <div>
            <p className="text-sm font-medium text-paper/60">Total Outstanding</p>
            <AnimatedAmount amount={245000} className="font-display text-5xl font-semibold text-paper" />
            <p className="mt-1 text-sm text-paper/50">Across 12 customers</p>
          </div>
        </div>
      </div>

      {/* Right: the actual auth panel */}
      <div className="flex flex-col items-center justify-center px-6 py-10 sm:px-10">
        <Link to="/" className="mb-8 flex items-center gap-2.5 md:hidden">
          <LedgaMark size={36} />
          <span className="font-display text-lg font-semibold text-ink">Ledga</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="w-full max-w-sm"
        >
          <h1 className="font-display text-3xl font-semibold text-ink">{headline}</h1>
          <p className="mt-2 text-sm text-ink-soft">{subtext}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-6 text-center text-sm text-ink-soft">{footer}</div>
        </motion.div>
      </div>
    </div>
  );
}
