import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthField } from "@/components/auth/AuthField";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { Button } from "@/components/ui/Button";
import { LedgaMark } from "@/components/LedgaMark";
import { useAuth } from "@/contexts/AuthContext";
import { authErrorMessage } from "@/utils/authErrors";

export function Signup() {
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(false);
  const [readyToEnter, setReadyToEnter] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return; // guards against duplicate submissions

    if (!name.trim()) {
      setError("Enter your name.");
      return;
    }
    if (!email.trim() || !password) {
      setError("Enter an email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Choose a password with at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await signup(name, email, password);
      setJustSignedUp(true);
      // Hold the premium welcome moment on screen briefly before entering
      // the app, rather than redirecting the instant auth state resolves.
      setTimeout(() => setReadyToEnter(true), 1600);
    } catch (err) {
      setError(authErrorMessage(err));
      setSubmitting(false);
    }
  }

  if (readyToEnter) {
    return <Navigate to="/" replace />;
  }

  if (justSignedUp) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <LedgaMark size={56} pulse />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h1 className="font-display text-3xl font-semibold text-paper">Welcome to Ledga.</h1>
          <p className="mt-2 text-paper/60">Let's get your business organized.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <AuthShell
      headline="Start remembering every transaction."
      subtext="Keep your customers, payments and balances organized in one place."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-deep underline underline-offset-2">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthField
          label="Name"
          icon={<User size={18} />}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
          error={!!error}
        />

        <AuthField
          label="Email"
          icon={<Mail size={18} />}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          error={!!error}
        />

        <div>
          <AuthField
            label="Password"
            icon={<Lock size={18} />}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            error={!!error}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-ink-faint hover:text-ink-soft"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />
          <PasswordStrengthMeter password={password} />
        </div>

        <AuthField
          label="Confirm password"
          icon={<Lock size={18} />}
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
          error={!!error}
        />

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              role="alert"
              className="text-sm font-medium text-owe"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={submitting}
          icon={submitting ? <Loader2 size={18} className="animate-spin" /> : undefined}
        >
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
