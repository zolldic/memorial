import { Outlet, useLocation } from "react-router";
import { AnimatedBackground } from "@/shared/components/AnimatedBackground";
import { ScrollToTop } from "./ScrollToTop";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Root() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body texture-noise">
      <ScrollToTop />
      {!isHome && <AnimatedBackground />}

      <Header />

      <main id="main-content" className="flex-1 relative z-10 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}