import { useLanguage } from '@/app/providers/LanguageProvider';
import { useMartyrs } from '@/features/martyrs/hooks/useMartyrs';
import { useMartyrFilters } from '@/features/martyrs/hooks/useMartyrFilters';
import { Search } from 'lucide-react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { FilterBar } from '@/features/martyrs/components/FilterBar';
import { MartyrCard } from '@/features/martyrs/components/MartyrCard';
import { useTranslation } from 'react-i18next';

export function MartyrsList() {
  const { lang } = useLanguage();
  const { t } = useTranslation('dashboard');
  
  // Use React Query fetched data instead of local static import
  const { martyrs, isLoading, isError } = useMartyrs();
  
  // Pass fetched data straight to our custom derived-state hook!
  const { filteredMartyrs, filters, setSearchQuery, setYearFilter, setMonthFilter, setStateFilter, clearFilters, hasFilters } = useMartyrFilters(martyrs);

  return (
    <div className="py-16 md:py-24 lg:py-32 flex flex-col gap-0 max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
      {/* Header */}
      <section className="border-b-4 border-border pb-12 md:pb-16">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">
          {t("wallOfFaces", { ns: 'home' })}
        </div>
        <h1 className="text-6xl md:text-9xl font-serif font-black uppercase tracking-tighter leading-[0.85] mb-8">
          {t("martyrsList.title")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-prose font-body italic leading-loose">
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
           <div className="text-center py-32 border-2 border-border-light flex flex-col items-center gap-4">
             <div className="w-12 h-12 border-4 border-t-foreground border-e-foreground border-b-border border-s-border rounded-full animate-spin"></div>
             <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
               {t("martyrsList.loadingRecords")}
             </p>
           </div>
        ) : isError ? (
          <div className="text-center py-32 border-2 border-destructive bg-destructive/10 text-destructive">
            <p className="font-mono uppercase tracking-widest">{t("martyrsList.loadingError")}</p>
          </div>
        ) : filteredMartyrs.length > 0 ? (
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 600: 2, 900: 3 }}>
            <Masonry gutter="0px">
              {filteredMartyrs.map((martyr, idx) => (
                <MartyrCard 
                  key={martyr.id} 
                  martyr={martyr} 
                  idx={idx} 
                  lang={lang} 
                />
              ))}
            </Masonry>
          </ResponsiveMasonry>
        ) : (
          <div className="text-center py-32 border-2 border-border-light">
            <Search size={48} strokeWidth={1} className="text-border-light mx-auto mb-6" />
            <p className="text-2xl font-serif font-black uppercase italic tracking-tighter text-muted-foreground">
              {t("martyrsList.noRecordsFound")}
            </p>
            <p className="mt-4 text-muted-foreground font-body italic max-w-md mx-auto">
              {t("martyrsList.noRecordsMessage")}
            </p>
          </div>
        )}
      </section>

      {/* Closing */}
      <div className="py-16 md:py-24 border-t-8 border-border text-center texture-lines">
        <div className="max-w-xl mx-auto space-y-6 relative z-10">
          <div className="font-serif text-8xl leading-none opacity-10">"</div>
          <p className="font-serif text-2xl italic -mt-12">"{t("martyrsList.closingQuote")}"</p>
          <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {t("martyrsList.inEternalRemembrance")}
          </div>
        </div>
      </div>
    </div>
  );
}
