import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { SUDAN_STATES } from '@/shared/utils/filters';
import { Martyr } from '@/shared/types';
import { useMartyrSearch } from '@/shared/hooks/useMartyrSearch';

export function useMartyrFilters(initialMartyrs: Martyr[] = []) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [yearFilter, setYearFilter] = useState(searchParams.get('year') || "");
  const [monthFilter, setMonthFilter] = useState(searchParams.get('month') || "");
  const [stateFilter, setStateFilter] = useState(searchParams.get('state') || "");
  
  const { searchQuery, setSearchQuery, filteredMartyrs: searchedMartyrs } = useMartyrSearch({
    martyrs: initialMartyrs,
    returnEmptyWhenNoQuery: false
  });

  // Initialize search from URL
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) setSearchQuery(query);
  }, []);

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (yearFilter) params.set('year', yearFilter);
    if (monthFilter) params.set('month', monthFilter);
    if (stateFilter) params.set('state', stateFilter);
    
    setSearchParams(params, { replace: true });
  }, [searchQuery, yearFilter, monthFilter, stateFilter, setSearchParams]);

  const filteredMartyrs = useMemo(() => {
    if (!searchedMartyrs?.length) return [];
    
    const stateEntry = SUDAN_STATES.find((s) => s.value === stateFilter);

    return searchedMartyrs.filter((m) => {
      const matchesYear = !yearFilter || m.dateOfMartyrdom.startsWith(yearFilter);
      
      const matchesMonth =
        !monthFilter || m.dateOfMartyrdom.substring(5, 7) === monthFilter;

      const matchesState =
        !stateFilter ||
        !stateEntry ||
        stateEntry.keywords.some((kw) =>
          m.location.en.toLowerCase().includes(kw)
        );

      return matchesYear && matchesMonth && matchesState;
    });
  }, [searchedMartyrs, yearFilter, monthFilter, stateFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setYearFilter("");
    setMonthFilter("");
    setStateFilter("");
    setSearchParams({}, { replace: true });
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
