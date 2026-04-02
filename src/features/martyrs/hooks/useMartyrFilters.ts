import { useState, useMemo } from 'react';
import { SUDAN_STATES } from '@/shared/utils/filters';
import { Martyr } from '@/shared/types';

export function useMartyrFilters(initialMartyrs: Martyr[] = []) {
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  const filteredMartyrs = useMemo(() => {
    if (!initialMartyrs?.length) return [];
    
    const stateEntry = SUDAN_STATES.find((s) => s.value === stateFilter);

    return initialMartyrs.filter((m) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        m.nameEn.toLowerCase().includes(q) ||
        m.nameAr.includes(q);

      const matchesYear = !yearFilter || m.dateOfMartyrdom.startsWith(yearFilter);
      
      const matchesMonth =
        !monthFilter || m.dateOfMartyrdom.substring(5, 7) === monthFilter;

      const matchesState =
        !stateFilter ||
        !stateEntry ||
        stateEntry.keywords.some((kw) =>
          m.locationEn.toLowerCase().includes(kw)
        );

      return matchesSearch && matchesYear && matchesMonth && matchesState;
    });
  }, [initialMartyrs, searchQuery, yearFilter, monthFilter, stateFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setYearFilter("");
    setMonthFilter("");
    setStateFilter("");
  };

  const hasFilters = Boolean(searchQuery || yearFilter || monthFilter || stateFilter);

  return {
    filters: {
      searchQuery,
      yearFilter,
      monthFilter,
      stateFilter,
    },
    setSearchQuery,
    setYearFilter,
    setMonthFilter,
    setStateFilter,
    clearFilters,
    hasFilters,
    filteredMartyrs
  };
}
