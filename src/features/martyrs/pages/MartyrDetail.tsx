import { Link } from 'react-router';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { Share2, Flame } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMartyrDetail } from '@/features/martyrs/hooks/useMartyrDetail';
import { useCandleState } from '@/features/martyrs/hooks/useCandleState';
import { MartyrProfile } from '@/features/martyrs/components/MartyrProfile';
import { TributeWall } from '@/features/martyrs/components/TributeWall';
import { MemorialSection } from '@/features/martyrs/components/MemorialSection';
import { toast } from 'sonner';
import { useDirectionalArrow } from '@/shared/hooks/useArrow';

export function MartyrDetail() {
  const { lang } = useLanguage();
  const { t } = useTranslation('dashboard');
  const BackArrow = useDirectionalArrow('back');
  const { martyr, memories, isLoading, isError } = useMartyrDetail();
  const { candleLit, optimisticCandles, lightCandle } = useCandleState(martyr?.id);

  const handleShare = async () => {
    const url = window.location.href;
    const title = martyr?.name[lang];
    
    if (navigator.share) {
      try {
        await navigator.share({ title: title || 'Memorial', url });
      } catch {
        // User cancelled share dialog
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success(t('martyrPage.linkCopied', { defaultValue: 'Link copied to clipboard!' }));
    }
  };

  if (isLoading) {
    return (
      <div className="py-28 md:py-32 text-center max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.28em] text-muted-foreground">
          {t("martyrPage.loadingRecord")}
        </p>
      </div>
    );
  }

  if (isError || !martyr) {
    return (
      <div className="py-28 md:py-32 text-center max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">{t("martyrPage.recordNotFound")}</h1>
        <p className="mt-4 text-muted-foreground font-body leading-loose max-w-xl mx-auto">{t("martyrPage.recordNotFoundMessage")}</p>
        <Link
          to="/martyrs"
          className="mt-8 inline-flex items-center gap-2 border border-foreground/80 text-foreground px-8 py-4 font-body hover:bg-foreground hover:text-background transition-colors duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {t("martyrPage.returnToArchives")}
        </Link>
      </div>
    );
  }

  const candleCount = (martyr.candles || 0) + optimisticCandles;

  return (
    <div className="py-16 md:py-24 lg:py-32 flex flex-col gap-12 max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
      {/* Top bar */}
      <div className="flex justify-between items-center gap-4 border-b border-border/70 pb-6">
        <Link
          to="/martyrs"
          className="group inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 ease-out"
        >
          <BackArrow size={14} strokeWidth={1.5} />
          {t("martyrPage.returnToArchives")}
        </Link>
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            aria-label={t('martyrPage.shareProfile', { defaultValue: 'Share this profile' })}
            className="inline-flex items-center gap-2 px-3 py-2 min-h-[44px] border border-border/70 text-sm font-body text-muted-foreground hover:text-foreground hover:border-foreground/80 transition-colors duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <Share2 size={14} strokeWidth={1.5} aria-hidden="true" />
            <span>{t('martyrPage.shareProfile', { defaultValue: 'Share' })}</span>
          </button>
{/*           <button
            onClick={() => window.print()}
            aria-label={t('martyrPage.printProfile', { defaultValue: 'Print this profile' })}
            className="p-2 min-w-[44px] min-h-[44px] border-2 border-border hover:bg-foreground hover:text-background transition-colors duration-500 ease-out focus-visible:outline focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-3"
          >
            <Printer size={16} strokeWidth={1.5} aria-hidden="true" />
          </button> */}
        </div>
      </div>

      <MartyrProfile martyr={martyr} />

      <div className="lg:w-[55%] lg:ms-auto md:px-16 mb-12">
        {/* Light a Candle */}
        <div className="border border-border/70 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 bg-background">
          <div className="flex items-start gap-4">
            <Flame size={20} strokeWidth={1.5} className={candleLit ? "text-foreground" : "text-muted-foreground"} />
            <div>
              <div className="font-serif text-xl md:text-2xl font-bold leading-none">{candleCount.toLocaleString()}</div>
              <div className="mt-1 font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-muted-foreground">
                {t("martyrPage.candlesLitInHonor")}
              </div>
              <p className="mt-3 max-w-sm text-sm leading-loose text-muted-foreground">
                {t('martyrPage.candleNote', { defaultValue: 'Lighting a candle adds a quiet mark of remembrance.' })}
              </p>
            </div>
          </div>
          <button
            onClick={lightCandle}
            disabled={candleLit}
            className={`px-6 py-3 min-h-[44px] font-body text-sm transition-colors duration-300 ease-out inline-flex items-center gap-2 ${
              candleLit
                ? "bg-muted text-muted-foreground border border-border/70 cursor-default"
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
          className="mt-6 inline-flex items-center gap-2 border border-border/70 px-4 py-3 text-sm font-body text-muted-foreground hover:text-foreground hover:border-foreground/80 transition-colors duration-300 ease-out"
        >
          {t("martyrPage.shareAMemoryOf")}
          {martyr.name[lang]}
        </Link>
      </div>

      <TributeWall martyrId={martyr.id} memories={memories} />

      <MemorialSection martyrId={martyr.id} />
    </div>
  );
}