import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, PublicOnlyRoute } from "@/components/auth/RouteGuards";
import { AppLayout } from "@/components/layout/AppLayout";
import { LedgaMark } from "@/components/LedgaMark";

const Login = lazy(() => import("@/pages/Login").then((m) => ({ default: m.Login })));
const Signup = lazy(() => import("@/pages/Signup").then((m) => ({ default: m.Signup })));
const Home = lazy(() => import("@/pages/Home").then((m) => ({ default: m.Home })));
const Customers = lazy(() => import("@/pages/Customers").then((m) => ({ default: m.Customers })));
const CustomerProfile = lazy(() => import("@/pages/CustomerProfile").then((m) => ({ default: m.CustomerProfile })));
const NewEntry = lazy(() => import("@/pages/NewEntry").then((m) => ({ default: m.NewEntry })));
const DailySummary = lazy(() => import("@/pages/DailySummary").then((m) => ({ default: m.DailySummary })));
const Profile = lazy(() => import("@/pages/Profile").then((m) => ({ default: m.Profile })));
const NotFound = lazy(() => import("@/pages/NotFound").then((m) => ({ default: m.NotFound })));

function RouteFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper" role="status" aria-live="polite">
      <LedgaMark size={40} pulse />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export default function App() {
  return (
    // reducedMotion="user" makes every Motion animation in the app respect
    // the OS-level prefers-reduced-motion setting automatically.
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route element={<PublicOnlyRoute />}>
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route index element={<Home />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="customers/:customerId" element={<CustomerProfile />} />
                  <Route path="new-entry" element={<NewEntry />} />
                  <Route path="summary" element={<DailySummary />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}
