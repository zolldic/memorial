import { Link } from 'react-router';
import { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ClosingCTAProps {
  ArrowIcon: LucideIcon;
}

export function ClosingCTA({ ArrowIcon }: ClosingCTAProps) {
  const { t } = useTranslation("home");

  return (
    <section className="bg-foreground text-background py-20 md:py-32 border-t border-border/80">
      <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12 text-center">
        <blockquote className="mx-auto max-w-2xl font-serif text-3xl md:text-5xl font-bold leading-tight mb-8">
          {t("theirNamesAreStars")}
        </blockquote>
        <Link
          to="/share"
          className="inline-flex items-center gap-3 border border-background/80 text-background px-10 py-5 font-body hover:bg-background hover:text-foreground transition-colors duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-background"
        >
          {t("tellUsWhoTheyWere")}
          <ArrowIcon size={18} strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
}
