import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { SidebarNav } from "@/components/layout/SidebarNav";

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-paper">
      <SidebarNav />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-4 md:px-8 md:pb-10 md:pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}
