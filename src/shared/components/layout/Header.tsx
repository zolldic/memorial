import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Globe, Menu, X } from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const { lang, toggleLang } = useLanguage();
  const { t } = useTranslation("common");
  const [menuOpen, setMenuOpen] = useState(false);
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

      <MobileMenu
        isOpen={menuOpen}
        onClose={closeMenu}
        lang={lang}
        toggleLang={toggleLang}
      />
    </>
  );
}
