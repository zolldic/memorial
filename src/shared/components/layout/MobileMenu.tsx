import { useEffect } from "react";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, Globe } from "lucide-react";
import { layoutNavItems } from "./navigation";
import type { Language } from "@/shared/types";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  toggleLang: () => void;
}

export function MobileMenu({ isOpen, onClose, lang, toggleLang }: MobileMenuProps) {
  const { t } = useTranslation(["common", "home"]);
  const isRtl = lang === "ar";

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleLanguageToggle = () => {
    toggleLang();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t("navigation")}
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
                    onClick={onClose}
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
                  onClick={handleLanguageToggle}
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
  );
}
