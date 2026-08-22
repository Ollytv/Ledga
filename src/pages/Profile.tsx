import { useNavigate } from "react-router-dom";
import { LogOut, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  const initial = (user?.displayName?.[0] ?? user?.email?.[0] ?? "?").toUpperCase();

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Profile</h1>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-surface p-8 text-center shadow-card"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft font-display text-2xl font-semibold text-brand-deep">
          {initial}
        </div>
        {user?.displayName && <p className="font-display text-lg font-semibold text-ink">{user.displayName}</p>}
        <div className="flex items-center gap-1.5 text-sm text-ink-soft">
          <Mail size={15} aria-hidden="true" />
          <span>{user?.email}</span>
        </div>
      </motion.div>

      <Button variant="secondary" size="lg" fullWidth onClick={handleLogout} icon={<LogOut size={18} aria-hidden="true" />}>
        Log Out
      </Button>
    </div>
  );
}
