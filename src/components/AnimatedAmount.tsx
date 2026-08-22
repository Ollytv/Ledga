import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { formatNaira } from "@/utils/currency";

interface AnimatedAmountProps {
  amount: number;
  className?: string;
  /** Total duration of the count-up, in ms. */
  duration?: number;
}

/**
 * Animates a Naira figure counting up from 0 to `amount` once on mount.
 * Subtle by design — a single settle, not a slot-machine effect. Skips
 * straight to the final value when the user prefers reduced motion.
 */
export function AnimatedAmount({ amount, className = "", duration = 700 }: AnimatedAmountProps) {
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(prefersReducedMotion ? amount : 0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(amount);
      return;
    }

    let frame: number;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic — fast start, gentle settle
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(amount * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // Intentionally re-runs only when the target amount changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, duration, prefersReducedMotion]);

  return <span className={className}>{formatNaira(display)}</span>;
}
