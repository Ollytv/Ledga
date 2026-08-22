import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LedgaMark } from "@/components/LedgaMark";

function AuthChecking() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper" role="status" aria-live="polite">
      <LedgaMark size={40} pulse />
      <span className="sr-only">Checking your session…</span>
    </div>
  );
}

/** Wraps routes that require a signed-in trader. Redirects to /login otherwise. */
export function ProtectedRoute() {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <AuthChecking />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}

/** Wraps /login and /signup so an already-signed-in trader skips straight past them. */
export function PublicOnlyRoute() {
  const { user, initializing } = useAuth();

  if (initializing) return <AuthChecking />;
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
}
