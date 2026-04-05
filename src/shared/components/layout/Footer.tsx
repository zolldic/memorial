import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { layoutNavItems } from "./navigation";

export function Footer() {
  const { t } = useTranslation(["common", "home", "dashboard"]);

  return (
    <footer className="bg-background text-foreground border-t border-border/80 py-16 md:py-24 z-10 relative texture-lines">
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.9fr_0.9fr] gap-12 pb-12 border-b border-border-light/80 items-start">
          <div className="flex flex-col gap-4">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground border-b border-border-light pb-2 w-fit">
              {t("memorialEdition")}
            </div>
            <div className="font-serif text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">
              MEMORIAL
            </div>
            <p className="max-w-sm text-sm text-muted-foreground leading-loose font-body">
              {t("footerMessage")}
            </p>
          </div>

          <nav className="flex flex-col gap-4" aria-label={t("quickLinks")}>
            <div className="font-mono text-xs uppercase tracking-widest border-b border-border pb-1 w-fit">
              {t("quickLinks")}
            </div>
            <div className="grid grid-cols-1 gap-3">
              {layoutNavItems.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-body hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  {t(link.labelKey, { ns: link.namespace })}
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex flex-col gap-4 max-w-sm">
            <div className="font-mono text-xs uppercase tracking-widest border-b border-border pb-1 w-fit">
              {t("archiveStatus")}
            </div>
            <div className="flex items-center gap-3 py-2 px-3 border border-border-light bg-muted/40">
              <div className="w-2 h-2 bg-foreground flex-shrink-0" />
              <span className="text-xs font-mono uppercase tracking-tight">{t("liveDatabase")}</span>
            </div>
            <p className="text-xs text-muted-foreground font-mono uppercase leading-tight">
              {t("nonProfitFreeArchive")}
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{t("copyright")}</div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground">
            <span>{t("memorialEdition")}</span>
            <span className="w-1 h-1 bg-foreground" aria-hidden="true" />
            <span>{t("sudanMartyrsArchive")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
