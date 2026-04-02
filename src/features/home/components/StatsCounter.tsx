import { useTranslation } from 'react-i18next';

interface Martyr {
  id: string;
}

interface StatsCounterProps {
  martyrsData: Martyr[];
  totalCandles: number;
}

export function StatsCounter({ martyrsData, totalCandles }: StatsCounterProps) {
  const { t } = useTranslation("home");
  const yearsSince2019 = new Date().getFullYear() - 2019;

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-baseline gap-6 md:gap-12">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-4xl md:text-5xl font-bold">{martyrsData.length}</span>
            <span className="font-body text-lg text-muted-foreground">{t("livesDocumented")}</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-4xl md:text-5xl font-bold">{yearsSince2019}</span>
            <span className="font-body text-lg text-muted-foreground">{t("yearsArchived")}</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-4xl md:text-5xl font-bold">{totalCandles.toLocaleString()}</span>
            <span className="font-body text-lg text-muted-foreground">{t("candlesLit")}</span>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border-light">
          <p className="font-body text-muted-foreground leading-relaxed max-w-2xl">
            {t("archiveIncomplete")}
          </p>
        </div>
      </div>
    </section>
  );
}
