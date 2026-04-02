import { Link } from 'react-router';
import { LucideIcon } from 'lucide-react';
import { AnimatedBackground } from '@/shared/components/AnimatedBackground';
import { useTranslation } from 'react-i18next';

interface HeroSectionProps {
  lang: string;
  ArrowIcon: LucideIcon;
}

export function HeroSection({ lang, ArrowIcon }: HeroSectionProps) {
  const { t } = useTranslation("home");

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Background — Animated Archive Portraits */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground absolute />
        {/* Dark overlay to ensure white text readability over the light-themed animated background */}
        <div className="absolute inset-0 bg-foreground/80 mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 lg:px-12 text-background text-center py-32">
        {/* Main headline */}
        <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif font-bold italic leading-[0.95] tracking-tight mb-12">
          {lang === "en"
            ? <>Our martyrs do not die;<br /><span className="not-italic">they live in our revolution.</span></>
            : <>شهداؤنا لا يموتون،<br /><span className="not-italic">بل يحيون في ثورتنا.</span></>
          }
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl font-body text-background/70 max-w-prose mx-auto mb-16 leading-relaxed">
          {t("livingArchiveSubtitle")}
        </p>

        {/* CTAs — clear primary / secondary hierarchy */}
        <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 w-full px-4 sm:px-0">
          {/* PRIMARY — solid, dominant */}
          <Link
            to="/martyrs"
            className="group w-full sm:w-auto min-h-[56px] inline-flex items-center justify-center gap-3 bg-background text-foreground px-12 py-5 font-body hover:bg-transparent hover:text-background hover:outline hover:outline-2 hover:outline-background transition-colors duration-300 ease-out focus-visible:outline focus-visible:outline-3 focus-visible:outline-background focus-visible:outline-offset-3"
          >
            {t("visitGallery")}
            <ArrowIcon size={18} strokeWidth={1.5} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform duration-300 ease-out" />
          </Link>
          {/* SECONDARY — ghost, reduced prominence */}
          <Link
            to="/share"
            className="group w-full sm:w-auto min-h-[56px] inline-flex items-center justify-center gap-2 border border-background/50 text-background/80 px-8 py-4 font-body hover:border-background hover:text-background transition-colors duration-300 ease-out focus-visible:outline focus-visible:outline-3 focus-visible:outline-background focus-visible:outline-offset-3"
          >
            {t("shareMemory")}
            <ArrowIcon size={14} strokeWidth={1.5} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform duration-300 ease-out" />
          </Link>
        </div>
      </div>
    </section>
  );
}
