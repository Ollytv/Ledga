import { Link, NavLink } from "react-router-dom";
import { LayoutDashboard, Users, BarChart3, UserCircle, Plus } from "lucide-react";
import { motion } from "motion/react";
import { LedgaMark } from "@/components/LedgaMark";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/summary", label: "Summary", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: UserCircle },
];

export function SidebarNav() {
  const { user } = useAuth();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 border-r border-border bg-surface px-5 py-7 md:flex">
      <Link to="/" className="flex items-center gap-2.5 px-1">
        <LedgaMark size={38} />
        <div className="leading-tight">
          <p className="font-display text-xl font-semibold text-ink">Ledga</p>
          <p className="text-xs text-ink-faint">Your ledger, remembered</p>
        </div>
      </Link>

      <Link
        to="/new-entry"
        className="flex min-h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-ink text-base font-bold text-paper shadow-glow transition-colors hover:bg-ink/90"
      >
        <Plus size={20} strokeWidth={2.5} aria-hidden="true" />
        New Transaction
      </Link>

      <nav aria-label="Primary" className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 rounded-xl bg-brand-soft"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <Icon size={20} className={`relative ${isActive ? "text-brand-deep" : ""}`} aria-hidden="true" />
                <span className={`relative ${isActive ? "text-ink" : ""}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {user?.email && (
        <div className="border-t border-border pt-4">
          <p className="truncate px-1 text-xs text-ink-faint">{user.email}</p>
        </div>
      )}
    </aside>
  );
}
