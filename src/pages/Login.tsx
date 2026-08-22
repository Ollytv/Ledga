import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, type Location } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthField } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { authErrorMessage } from "@/utils/authErrors";

export function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return; // guards against duplicate submissions (e.g. double Enter)

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      setJustLoggedIn(true);
    } catch (err) {
      setError(authErrorMessage(err));
      setSubmitting(false);
    }
  }

  // Auth state updates asynchronously via onAuthStateChanged; once it lands,
  // ProtectedRoute/PublicOnlyRoute will happily send us onward. This covers
  // the brief window between a successful sign-in call and that update.
  if (justLoggedIn) {
    return <Navigate to={from?.pathname ?? "/"} replace />;
  }

  return (
    <AuthShell
      headline="Welcome back."
      subtext="Your business remembers everything."
      footer={
        <>
          New to Ledga?{" "}
          <Link to="/signup" className="font-semibold text-brand-deep underline underline-offset-2">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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

        <AuthField
          label="Password"
          icon={<Lock size={18} />}
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
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

        <div className="flex justify-end">
          <button type="button" className="text-sm font-semibold text-brand-deep hover:underline">
            Forgot password?
          </button>
        </div>

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
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
