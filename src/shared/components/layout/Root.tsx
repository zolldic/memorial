import { useState } from "react";
import { Outlet, Link, NavLink, useLocation } from "react-router";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { AnimatedBackground } from "@/shared/components/AnimatedBackground";
import { Globe, Search, Menu, X, Home as HomeIcon, Info, Users, Mail, PenLine } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ScrollToTop } from "./ScrollToTop";
import { useTranslation } from "react-i18next";

function RootContent() {
  const { lang, toggleLang } = useLanguage();
  const { t } = useTranslation(["common", "home", "dashboard"]);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isRtl = lang === "ar";
  const isHome = location.pathname === "/";

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { to: "/", label: t("home"), icon: <HomeIcon size={20} strokeWidth={1.5} /> },
    { to: "/martyrs", label: t("martyrsList.title", { ns: "dashboard" }), icon: <Users size={20} strokeWidth={1.5} /> },
    { to: "/share", label: t("shareMemory", { ns: "home" }), icon: <PenLine size={20} strokeWidth={1.5} /> },
    { to: "/about", label: t("about.title", { ns: "dashboard" }), icon: <Info size={20} strokeWidth={1.5} /> },
    { to: "/work", label: t("contribute.title", { ns: "dashboard" }), icon: <Mail size={20} strokeWidth={1.5} /> },
  ];

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col font-body texture-noise ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <ScrollToTop />
      {!isHome && <AnimatedBackground />}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b-4 border-border">
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="flex justify-between items-center h-24 md:h-32">
            {/* Left: Language & Search */}
            <div className="hidden md:flex items-center gap-6 flex-1">
              <button
                onClick={toggleLang}
                className="flex items-center gap-2 border-2 border-border px-4 py-2 font-mono text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors duration-500 ease-out focus-visible:outline focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-3"
              >
                <Globe size={20} strokeWidth={1.5} aria-hidden="true" />
                {lang === "en" ? t("switchLanguageArabic") : t("switchLanguageEnglish")}
              </button>
              <Link to="/search" aria-label="Search the archive" className="p-2 border-2 border-transparent hover:border-border transition-all duration-500 ease-out">
                <Search size={20} strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>

            {/* Center: Masthead */}
            <Link to="/" onClick={closeMenu} className="flex flex-col items-center gap-1 group py-4">
              <div className="text-xs font-mono uppercase tracking-[0.3em] border-b border-border mb-1">
                {t("memorialEdition")}
              </div>
              <h1 className="font-serif text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                MEMORIAL
              </h1>
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mt-1">
                {new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-SD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </Link>

            {/* Right: Menu */}
            <div className="flex items-center justify-end gap-4 md:flex-1">
              <div className="hidden md:flex items-center gap-4">
                <div className="h-12 w-px bg-foreground opacity-20 mx-4" />
              </div>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                className="p-3 min-w-[44px] min-h-[44px] border-2 border-border bg-background hover:bg-foreground hover:text-background transition-colors duration-500 ease-out focus-visible:outline focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-3"
              >
                {menuOpen ? <X size={24} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={24} strokeWidth={1.5} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -100 : 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? -100 : 100 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-background flex flex-col pt-32 pb-12 overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto px-8 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <nav className="flex flex-col gap-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 border-b border-border-light pb-2">
                    {t("navigation")}
                  </div>
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `group flex items-center justify-between py-4 border-b border-transparent hover:border-b-2 hover:border-border transition-all duration-500 ease-out ${
                          isActive ? "border-b-2 border-border" : ""
                        }`
                      }
                    >
                      <span className="font-serif text-3xl md:text-5xl font-black italic group-hover:not-italic transition-all">
                        {link.label}
                      </span>
                      <div className={`p-2 border-2 border-border opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out ${isRtl ? 'rotate-180' : ''}`}>
                        <Search size={20} strokeWidth={1.5} />
                      </div>
                    </NavLink>
                  ))}
                </nav>

                <div className="flex flex-col gap-6 justify-center">
                  <div className="p-8 border-2 border-border bg-background relative">
                    <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3 pb-2 border-b border-border-light">
                      {t("aboutThisArchive")}
                    </div>
                    <h3 className="font-serif text-xl font-black mb-3">{t("footerMessage")}</h3>
                    <p className="text-sm text-muted-foreground mb-3 italic leading-loose font-body">
                      {lang === 'en'
                        ? "Preserving the history of the Sudanese Revolution through the stories of those who led with their lives."
                        : "توثيق تاريخ الثورة السودانية من خلال قصص من ضحوا بأرواحهم."}
                    </p>
                    <div className="flex items-center gap-2 py-2 px-3 bg-muted border border-border-light">
                      <div className="w-2 h-2 bg-foreground flex-shrink-0" />
                      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                        {t("nonProfitFreeArchive")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { toggleLang(); closeMenu(); }}
                    className="w-full flex items-center justify-center gap-3 bg-foreground text-background py-4 font-mono uppercase tracking-widest hover:bg-background hover:text-foreground hover:border-2 hover:border-border transition-colors duration-500 ease-out min-h-[44px]"
                  >
                    <Globe size={20} strokeWidth={1.5} />
                    {lang === "en" ? t("switchLanguageArabic") : t("switchLanguageEnglish")}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 relative z-10 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-background text-foreground border-t-4 md:border-t-8 border-border py-16 md:py-24 z-10 relative texture-lines">
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-border-light">
            <div className="flex flex-col gap-4">
              <div className="font-serif text-2xl font-black uppercase tracking-tighter">MEMORIAL</div>
              <p className="text-sm text-muted-foreground leading-loose font-body">
                {t("footerMessage")}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="font-mono text-xs uppercase tracking-widest border-b border-border pb-1 w-fit">
                {t("quickLinks")}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map(link => (
                  <Link key={link.to} to={link.to} onClick={closeMenu} className="text-sm hover:underline font-body">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="font-mono text-xs uppercase tracking-widest border-b border-border pb-1 w-fit">
                {t("archiveStatus")}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-foreground" />
                <span className="text-xs font-mono uppercase tracking-tighter">{t("liveDatabase")}</span>
              </div>
              <p className="text-xs text-muted-foreground font-mono uppercase leading-tight">
                {t("nonProfitFreeArchive")}
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              {t("copyright")}
            </div>
            <div className="flex gap-2">
              <div className="w-6 h-px bg-foreground" />
              <div className="w-6 h-px bg-foreground" />
              <div className="w-6 h-px bg-foreground" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Root() {
  return <RootContent />;
}