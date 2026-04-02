import { useState } from 'react';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { Link } from 'react-router';
import { Search, MapPin, X, ArrowRight, ArrowLeft, Calendar } from 'lucide-react';
import { useSearch } from '@/features/search/hooks/useSearch';
import { useTranslation } from 'react-i18next';

export function SearchResults() {
  const { lang } = useLanguage();
  const { t } = useTranslation('dashboard');
  const { query, results: filteredData, isLoading, handleSearch, clearSearch } = useSearch();
  
  // Local state only for the input field to allow typing before submission
  const [inputValue, setInputValue] = useState(query);
  
  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(inputValue);
  };

  const onClear = () => {
    setInputValue('');
    clearSearch();
  };

  return (
    <div className="py-16 md:py-24 lg:py-32 flex flex-col gap-0 max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
      {/* Header */}
      <section className="border-b border-border pb-12">
        <div className="mb-6">
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight leading-tight mb-6">
            {t("searchResults.title")}
          </h1>
          <p className="text-lg font-body text-muted-foreground max-w-prose">
            {t("searchResults.archiveSearch")}
          </p>
        </div>

        <form onSubmit={onFormSubmit} className="relative max-w-2xl mt-8">
          <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
            <Search size={20} strokeWidth={1.5} className="text-muted-foreground" />
          </div>
          <input
            type="text"
            className="block w-full px-14 py-5 border border-border bg-background text-lg font-body placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
            placeholder={t("searchArchives", { ns: 'common' })}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          {inputValue && (
            <button
              type="button"
              onClick={onClear}
              className="absolute inset-y-0 end-0 pe-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          )}
        </form>
      </section>

      {/* Results bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 mt-12">
        <div className="font-body text-sm text-muted-foreground">
          {isLoading ? (
            <span className="animate-pulse">{t("searchResults.searching")}</span>
          ) : (
            <>
              {filteredData.length === 0 && query ? (
                t("searchResults.noRecordsFound")
              ) : filteredData.length > 0 ? (
                <>
                  <span className="font-bold text-foreground">{filteredData.length}</span> {t("searchResults.recordsFound")}
                  {query && <span className="ms-2 italic">for "{query}"</span>}
                </>
              ) : (
                t("searchResults.enterSearchTerm", { defaultValue: "Enter a search term to begin" })
              )}
            </>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex flex-col gap-0 mt-8">
        {isLoading ? (
          <div className="py-32 text-center font-body text-muted-foreground">
            {t("searchResults.loadingArchive")}
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map((martyr) => (
            <Link
              key={martyr.id}
              to={`/martyrs/${martyr.id}`}
              className="group flex flex-col md:flex-row gap-6 border-b border-border-light py-8 hover:bg-muted transition-colors"
            >
              <div className="md:w-40 h-48 md:h-40 flex-shrink-0 border border-border relative overflow-hidden">
                <img
                  src={martyr.image}
                  alt={lang === "en" ? martyr.nameEn : martyr.nameAr}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-out"
                />
              </div>

              <div className="flex flex-col justify-center gap-3 flex-1">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight leading-tight">
                    {lang === "en" ? martyr.nameEn : martyr.nameAr}
                  </h2>
                  <span className="text-sm font-body text-muted-foreground">
                    {lang === "en" ? martyr.professionEn : martyr.professionAr}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-body text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} strokeWidth={1.5} />
                    {martyr.dateOfMartyrdom} · {t("searchResults.age")}: {martyr.age}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} strokeWidth={1.5} />
                    {lang === "en" ? martyr.locationEn : martyr.locationAr}
                  </span>
                </div>

                <p className="text-sm font-body line-clamp-2 text-muted-foreground leading-relaxed">
                  {lang === "en" ? martyr.storyEn : martyr.storyAr}
                </p>

                <div className="mt-2 flex items-center gap-2 font-body text-sm group-hover:underline">
                  <span>{t("martyrPage.viewRecord")}</span>
                  <ArrowIcon size={14} strokeWidth={1.5} />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-32">
            <Search size={48} strokeWidth={1} className="text-border-light mx-auto mb-6" />
            <p className="text-2xl font-serif font-bold text-muted-foreground mb-4">
              {query ? t("searchResults.noRecordsFound") : t("searchResults.enterSearchTerm", { defaultValue: "Search the archive" })}
            </p>
            {query && (
              <p className="text-muted-foreground font-body max-w-md mx-auto mb-6">
                {t("searchResults.noResultsMessage")}
              </p>
            )}
            {query && (
              <button
                onClick={onClear}
                className="border border-border px-8 py-3 font-body hover:bg-muted transition-colors"
              >
                {t("searchResults.clearAllFilters")}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}