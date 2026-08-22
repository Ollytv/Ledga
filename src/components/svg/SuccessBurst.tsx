import { useMemo, type CSSProperties } from "react";
import { motion } from "motion/react";

const PARTICLE_COUNT = 10;

/**
 * Transaction-success moment: a circle scales in, a checkmark draws itself
 * with a stroke-dashoffset animation, and a short particle burst fires
 * outward. All motion is short (<900ms) by design — this confirms the save,
 * it doesn't make the trader wait.
 */
export function SuccessBurst({ size = 88 }: { size?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
        const distance = 46 + (i % 3) * 10;
        return {
          id: i,
          px: Math.cos(angle) * distance,
          py: Math.sin(angle) * distance,
          delay: 120 + i * 12,
        };
      }),
    [],
  );

  return (
    <div className="relative flex items-center justify-center" style={{ width: size * 1.8, height: size * 1.8 }}>
      {particles.map((p) => (
        <span
          key={p.id}
          className="animate-particle-burst absolute h-1.5 w-1.5 rounded-full bg-brand"
          style={
            {
              "--px": `${p.px}px`,
              "--py": `${p.py}px`,
              animationDelay: `${p.delay}ms`,
            } as CSSProperties
          }
          aria-hidden="true"
        />
      ))}

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
        className="flex items-center justify-center rounded-full bg-paid"
        style={{ width: size, height: size }}
      >
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 13l4.5 4.5L19 7"
            stroke="white"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1}
            className="animate-check-draw"
          />
        </svg>
      </motion.div>
    </div>
  );
}
