import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, BarChart3, UserCircle, Plus } from "lucide-react";
import { motion } from "motion/react";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/summary", label: "Summary", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: UserCircle },
];

export function BottomNavigation() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="relative mx-auto flex max-w-md items-center justify-between px-4 py-2">
        {NAV_ITEMS.slice(0, 2).map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <NavLink
          to="/new-entry"
          aria-label="New Transaction"
          className="relative -top-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-glow transition-transform active:scale-95"
        >
          <Plus size={26} strokeWidth={2.5} aria-hidden="true" />
        </NavLink>

        {NAV_ITEMS.slice(2).map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>
    </nav>
  );
}

function NavItem({ to, label, icon: Icon }: { to: string; label: string; icon: typeof LayoutDashboard }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className="relative flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-semibold"
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="bottom-nav-active-indicator"
              className="absolute -top-0.5 h-1 w-5 rounded-full bg-brand"
              transition={{ type: "spring", stiffness: 500, damping: 40 }}
            />
          )}
          <Icon size={21} strokeWidth={isActive ? 2.4 : 2} className={isActive ? "text-ink" : "text-ink-faint"} aria-hidden="true" />
          <span className={isActive ? "text-ink" : "text-ink-faint"}>{label}</span>
        </>
      )}
    </NavLink>
  );
}
