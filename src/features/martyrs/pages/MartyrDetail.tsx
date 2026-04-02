import { useState } from 'react';
import { Link } from 'react-router';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { ArrowLeft, ArrowRight, Share2, Printer, Flame } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMartyrDetail } from '@/features/martyrs/hooks/useMartyrDetail';
import { MartyrProfile } from '@/features/martyrs/components/MartyrProfile';
import { TributeWall } from '@/features/martyrs/components/TributeWall';
import { MemorialSection } from '@/features/martyrs/components/MemorialSection';

export function MartyrDetail() {
  const { lang } = useLanguage();
  const { t } = useTranslation('dashboard');
  const { martyr, memories, isLoading, isError } = useMartyrDetail();
  const isRtl = lang === "ar";
  
  const [candleLit, setCandleLit] = useState(false);
  const [optimisticCandles, setOptimisticCandles] = useState(0);

  const handleLightCandle = () => {
    if (!candleLit) {
      setOptimisticCandles(1);
      setCandleLit(true);
    }
  };

  if (isLoading) {
    return (
      <div className="py-32 text-center max-w-6xl mx-auto px-6 md:px-8 lg:px-12 font-mono uppercase tracking-widest animate-pulse">
        {t("martyrPage.loadingRecord")}
      </div>
    );
  }

  if (isError || !martyr) {
    return (
      <div className="py-32 text-center max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <h1 className="text-4xl font-serif font-black uppercase">{t("martyrPage.recordNotFound")}</h1>
        <p className="mt-4 text-muted-foreground font-body italic">{t("martyrPage.recordNotFoundMessage")}</p>
        <Link
          to="/martyrs"
          className="mt-8 inline-block bg-foreground text-background px-8 py-4 font-mono uppercase tracking-widest hover:bg-background hover:text-foreground hover:outline hover:outline-2 hover:outline-ring transition-colors duration-500 ease-out"
        >
          {t("martyrPage.returnToArchives")}
        </Link>
      </div>
    );
  }

  const ArrowIcon = isRtl ? ArrowRight : ArrowLeft;
  const candleCount = (martyr.candles || 0) + optimisticCandles;

  return (
    <div className="py-16 md:py-24 lg:py-32 flex flex-col gap-12 max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
      {/* Top bar */}
      <div className="flex justify-between items-center border-b-4 border-border pb-8">
        <Link
          to="/martyrs"
          className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest hover:underline transition-all duration-500 ease-out"
        >
          <ArrowIcon size={16} strokeWidth={1.5} />
          {t("martyrPage.returnToArchives")}
        </Link>
        <div className="flex gap-4">
          <button className="p-2 min-w-[44px] min-h-[44px] border-2 border-border hover:bg-foreground hover:text-background transition-colors duration-500 ease-out focus-visible:outline focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-3">
            <Share2 size={16} strokeWidth={1.5} />
          </button>
          <button onClick={() => window.print()} className="p-2 min-w-[44px] min-h-[44px] border-2 border-border hover:bg-foreground hover:text-background transition-colors duration-500 ease-out focus-visible:outline focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-3">
            <Printer size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <MartyrProfile martyr={martyr} />

      <div className="lg:w-[55%] lg:ms-auto md:px-16 mb-12">
        {/* Light a Candle */}
        <div className="border-2 border-border p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Flame size={24} strokeWidth={1.5} className={candleLit ? "text-foreground" : "text-muted-foreground"} />
            <div>
              <div className="font-serif text-2xl font-black">{candleCount.toLocaleString()}</div>
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {t("martyrPage.candlesLitInHonor")}
              </div>
            </div>
          </div>
          <button
            onClick={handleLightCandle}
            disabled={candleLit}
            className={`px-6 py-3 min-h-[44px] font-mono text-xs uppercase tracking-widest transition-colors duration-500 ease-out inline-flex items-center gap-2 ${
              candleLit
                ? "bg-muted text-muted-foreground border-2 border-border-light cursor-default"
                : "bg-foreground text-background hover:bg-background hover:text-foreground hover:outline hover:outline-2 hover:outline-ring"
            }`}
          >
            <Flame size={14} strokeWidth={1.5} />
            {candleLit
              ? t("martyrPage.candleLit")
              : t("martyrPage.honorThisHero")
            }
          </button>
        </div>

        {/* Share a Memory link */}
        <Link
          to={`/share?martyr=${martyr.id}`}
          className="mt-6 block border-2 border-border p-4 text-center font-mono text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors duration-500 ease-out"
        >
          {t("martyrPage.shareAMemoryOf")}
          {lang === "en" ? martyr.nameEn : martyr.nameAr}
        </Link>
      </div>

      <TributeWall martyrId={martyr.id} memories={memories} />

      <MemorialSection martyrId={martyr.id} />
    </div>
  );
}