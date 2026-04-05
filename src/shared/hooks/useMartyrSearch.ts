import { useState, useMemo } from 'react';
import type { Martyr } from '@/shared/types';

interface UseMartyrSearchOptions {
  martyrs: Martyr[];
  returnEmptyWhenNoQuery?: boolean;
}

export function useMartyrSearch({ 
  martyrs, 
  returnEmptyWhenNoQuery = false 
}: UseMartyrSearchOptions) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMartyrs = useMemo(() => {
    const query = searchQuery.trim();
    
    if (!query) {
      return returnEmptyWhenNoQuery ? [] : martyrs;
    }

    const lowerQuery = query.toLowerCase();
    
    return martyrs.filter((m) =>
      m.name.en.toLowerCase().includes(lowerQuery) ||
      m.name.ar.includes(query)
    );
  }, [martyrs, searchQuery, returnEmptyWhenNoQuery]);

  const clearSearch = () => setSearchQuery("");

  return {
    searchQuery,
    setSearchQuery,
    clearSearch,
    filteredMartyrs,
    hasQuery: Boolean(searchQuery.trim())
  };
}
