import { Outlet, useLocation } from "react-router";
import { AnimatedBackground } from "@/shared/components/AnimatedBackground";
import { ScrollToTop } from "./ScrollToTop";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useMartyrs } from "@/features/martyrs/hooks/useMartyrs";
import { useMemo } from "react";

export function Root() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const { martyrs } = useMartyrs();

  const martyrImages = useMemo(() => martyrs.map(m => m.image), [martyrs]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body texture-noise">
      <ScrollToTop />
      {!isHome && <AnimatedBackground images={martyrImages} />}

      <Header />

      <main id="main-content" className="flex-1 relative z-10 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}