import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, Globe, Menu, X } from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { layoutNavItems } from "./navigation";

export function Header() {
  const { lang, toggleLang } = useLanguage();
  const { t } = useTranslation(["common", "home", "dashboard"]);
  const [menuOpen, setMenuOpen] = useState(false);
  const isRtl = lang === "ar";
  const dateLocale = lang === "en" ? "en-US" : "ar-SD";
  const displayDate = new Date().toLocaleDateString(dateLocale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-background focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:outline focus:outline-2 focus:outline-ring"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/80">
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-24 md:h-32 gap-4">
            <div className="hidden md:flex items-center justify-start gap-4">
              <button
                onClick={toggleLang}
                className="flex items-center gap-2 border-2 border-border px-4 py-2 font-mono text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors duration-500 ease-out focus-visible:outline focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-3"
              >
                <Globe size={20} strokeWidth={1.5} aria-hidden="true" />
                {lang === "en" ? t("switchLanguageArabic") : t("switchLanguageEnglish")}
              </button>
            </div>

            <Link to="/" onClick={closeMenu} className="flex flex-col items-center gap-1 group py-4 justify-self-center text-center">
              <div className="text-xs font-mono uppercase tracking-[0.3em] border-b border-border mb-1">
                {t("memorialEdition")}
              </div>
              <h1 className="font-serif text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                MEMORIAL
              </h1>
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mt-1">
                {displayDate}
              </div>
            </Link>

            <div className="flex items-center justify-end gap-4 justify-self-end">
              <button
                onClick={toggleMenu}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="p-2.5 min-w-[44px] min-h-[44px] border-2 border-border bg-background hover:bg-foreground hover:text-background transition-colors duration-500 ease-out focus-visible:outline focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-3"
              >
                {menuOpen ? (
                  <X size={20} strokeWidth={1.5} aria-hidden="true" />
                ) : (
                  <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -80 : 80, scale: 0.99 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? -80 : 80, scale: 0.99 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-sm flex flex-col pt-32 pb-12 overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto px-8 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <nav className="flex flex-col gap-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 border-b border-border-light pb-2">
                    {t("navigation")}
                  </div>
                  {layoutNavItems.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `group flex items-center justify-between py-4 border-b border-transparent hover:border-b-2 hover:border-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring transition-all duration-500 ease-out ${
                          isActive ? "border-b-2 border-border" : ""
                        }`
                      }
                    >
                      <span className="font-serif text-3xl md:text-5xl font-black italic group-hover:not-italic transition-all">
                        {t(link.labelKey, { ns: link.namespace })}
                      </span>
                      <div className={`p-2 border-2 border-border opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out ${isRtl ? "rotate-180" : ""}`}>
                        <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
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
                      {lang === "en"
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
                    onClick={() => {
                      toggleLang();
                      closeMenu();
                    }}
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
    </>
  );
}
