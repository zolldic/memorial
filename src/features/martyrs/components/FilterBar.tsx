import React from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { YEARS, MONTHS, SUDAN_STATES } from '@/shared/utils/filters';
import { useTranslation } from 'react-i18next';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  yearFilter: string;
  setYearFilter: (year: string) => void;
  monthFilter: string;
  setMonthFilter: (month: string) => void;
  stateFilter: string;
  setStateFilter: (state: string) => void;
  hasFilters: boolean;
  clearFilters: () => void;
  filteredCount: number;
}

export function FilterBar({
  searchQuery,
  setSearchQuery,
  yearFilter,
  setYearFilter,
  monthFilter,
  setMonthFilter,
  stateFilter,
  setStateFilter,
  hasFilters,
  clearFilters,
  filteredCount,
}: FilterBarProps) {
  const { lang } = useLanguage();
  const { t } = useTranslation('dashboard');
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  // Derived state: auto-show advanced filters if any are active
  const shouldShowAdvanced = showAdvanced || yearFilter !== '' || monthFilter !== '' || stateFilter !== '';

  return (
    <section className="py-8 border-b border-border/70 flex flex-col gap-5">
      {/* Screen reader announcement for filter results */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {t("martyrsList.showingResults", { count: filteredCount, defaultValue: `Showing ${filteredCount} results` })}
      </div>

      {/* Search - primary action */}
      <div className="flex flex-col gap-4">
        <div className="relative flex-1 max-w-2xl">
          <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
            <Search size={18} strokeWidth={1.5} className="text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder={t("martyrsList.searchByName")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-12 pe-10 py-4 border border-border/70 bg-background font-body placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 end-0 pe-3 flex items-center text-muted-foreground hover:text-foreground"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Advanced filters toggle */}
        <div className="flex items-center gap-4">
          {!shouldShowAdvanced && (
          <button
            onClick={() => setShowAdvanced(true)}
            className="text-sm font-body text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
          >
            {t("martyrsList.refineSearch", { defaultValue: "Refine search" })}
          </button>
          )}

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm font-body text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors flex items-center gap-2"
            >
              <X size={14} strokeWidth={1.5} />
              {t("clearFilters", { ns: "common" })}
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters - progressive disclosure */}
      {shouldShowAdvanced && (
        <div className="pt-4 border-t border-border/70">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Year */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full min-h-[44px] border border-border/70 bg-background px-4 py-3 font-body text-sm cursor-pointer hover:bg-muted transition-colors"
            >
              {YEARS.map((y) => (
                <option key={y.value} value={y.value}>
                  {lang === "en" ? y.labelEn : y.labelAr}
                </option>
              ))}
            </select>

            {/* Month */}
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="w-full min-h-[44px] border border-border/70 bg-background px-4 py-3 font-body text-sm cursor-pointer hover:bg-muted transition-colors"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {lang === "en" ? m.labelEn : m.labelAr}
                </option>
              ))}
            </select>

            {/* Sudan State */}
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full min-h-[44px] border border-border/70 bg-background px-4 py-3 font-body text-sm cursor-pointer hover:bg-muted transition-colors"
            >
              {SUDAN_STATES.map((s) => (
                <option key={s.value} value={s.value}>
                  {lang === "en" ? s.labelEn : s.labelAr}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Count */}
      <div className="font-body text-sm text-muted-foreground">
        {filteredCount} {t("martyrsList.livesDocumented")}
        {hasFilters && <span className="ms-2">({t("martyrsList.filtered")})</span>}
      </div>
    </section>
  );
}
