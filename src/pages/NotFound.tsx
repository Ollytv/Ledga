import { Link } from "react-router-dom";
import { LedgaMark } from "@/components/LedgaMark";

export function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <LedgaMark size={48} />
      <h1 className="font-display text-2xl font-semibold text-ink">Page not found</h1>
      <p className="max-w-xs text-ink-soft">That page doesn't exist. Let's get you back home.</p>
      <Link to="/" className="font-semibold text-gold-deep underline underline-offset-2">
        Go to Home
      </Link>
    </div>
  );
}
