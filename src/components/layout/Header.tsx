import { Link } from "react-router-dom";
import { LedgaMark } from "@/components/LedgaMark";

/** Compact top bar shown on mobile. Desktop uses the sidebar's own brand block instead. */
export function Header() {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-2.5 border-b border-border bg-paper/95 px-4 py-3 backdrop-blur md:hidden">
      <Link to="/" className="flex items-center gap-2.5">
        <LedgaMark size={30} />
        <span className="font-display text-lg font-semibold text-ink">Ledga</span>
      </Link>
    </header>
  );
}
