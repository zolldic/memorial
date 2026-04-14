import { useLanguage } from '@/app/providers/LanguageProvider';
import { useMartyrs } from '@/features/martyrs/hooks/useMartyrs';
import { useMartyrFilters } from '@/features/martyrs/hooks/useMartyrFilters';
import { Search } from 'lucide-react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { FilterBar } from '@/features/martyrs/components/FilterBar';
import { MartyrCard } from '@/features/martyrs/components/MartyrCard';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/utils/supabaseError';

export function MartyrsList() {
  const { lang } = useLanguage();
  const { t } = useTranslation('dashboard');
  
  // Use React Query fetched data instead of local static import
  const { martyrs, isLoading, isError, error, refetch, isFetching } = useMartyrs();
  
  // Pass fetched data straight to our custom derived-state hook!
  const { filteredMartyrs, filters, setSearchQuery, setYearFilter, setMonthFilter, setStateFilter, clearFilters, hasFilters } = useMartyrFilters(martyrs);

  useEffect(() => {
    if (isError) {
      toast.error(getErrorMessage(error, t('martyrsList.loadingError')));
    }
  }, [isError, error, t]);

  return (
    <div className="py-16 md:py-24 lg:py-32 flex flex-col gap-0 max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
      {/* Header */}
      <section className="pb-10 md:pb-12 mb-10 border-b border-border/70 max-w-3xl">
        <div className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground mb-4">
          {t("martyrsList.completeArchive")}
        </div>
        <h1 className="text-4xl md:text-7xl font-serif font-bold tracking-tight leading-[1.02] mb-6 text-balance">
          {t("martyrsList.title")}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl font-body leading-loose">
          {t("martyrsList.wallOfFacesSubtitle")}
        </p>
      </section>

      <FilterBar 
        {...filters}
        setSearchQuery={setSearchQuery}
        setYearFilter={setYearFilter}
        setMonthFilter={setMonthFilter}
        setStateFilter={setStateFilter}
        clearFilters={clearFilters}
        hasFilters={hasFilters}
        filteredCount={filteredMartyrs.length}
      />

      {/* Masonry Gallery Loading State */}
      <section className="py-12">
        {isLoading ? (
           <div className="text-center py-28 border border-border/70 flex flex-col items-center gap-4 bg-muted/20">
             <div className="w-10 h-10 border-2 border-border/60 border-t-foreground animate-spin"></div>
             <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
               {t("martyrsList.loadingRecords")}
             </p>
           </div>
        ) : isError ? (
          <div className="text-center py-20 border border-border/70 bg-muted/20 text-foreground px-6">
            <p className="font-mono uppercase tracking-widest mb-3">{t("martyrsList.loadingError")}</p>
            <p className="text-sm text-muted-foreground mb-6">
              {getErrorMessage(error, t('martyrsList.loadingError'))}
            </p>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="px-6 py-3 border border-border/70 font-mono text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors disabled:opacity-60"
            >
              {isFetching ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        ) : filteredMartyrs.length > 0 ? (
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 600: 2, 900: 3 }}>
            <Masonry gutter="0px">
              {filteredMartyrs.map((martyr) => (
                <MartyrCard 
                  key={martyr.id} 
                  martyr={martyr} 
                  lang={lang} 
                />
              ))}
            </Masonry>
          </ResponsiveMasonry>
        ) : (
          <div className="text-center py-28 border border-border/70 bg-muted/10">
            <Search size={40} strokeWidth={1} className="text-border-light mx-auto mb-5" />
            <p className="text-xl md:text-2xl font-serif font-bold tracking-tight text-muted-foreground">
              {t("martyrsList.noRecordsFound")}
            </p>
            <p className="mt-4 text-muted-foreground font-body leading-loose max-w-md mx-auto">
              {t("martyrsList.noRecordsMessage")}
            </p>
          </div>
        )}
      </section>

      {/* Closing */}
      <div className="py-14 md:py-20 border-t border-border/70 text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <p className="font-serif text-lg md:text-xl italic text-foreground leading-relaxed">
            {t("martyrsList.closingQuote")}
          </p>
          <div className="text-[10px] md:text-xs font-mono uppercase tracking-[0.28em] text-muted-foreground">
            {t("martyrsList.inEternalRemembrance")}
          </div>
        </div>
      </div>
    </div>
  );
}
