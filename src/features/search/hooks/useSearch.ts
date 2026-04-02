import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { martyrService } from "@/features/martyrs/services/martyrService";

export function useSearch() {
  const [params, setSearchParams] = useSearchParams();
  const query = params.get("q") || "";

  const {
    data: results = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["martyrs", "search", query],
    queryFn: () => martyrService.searchMartyrs(query),
    enabled: true, // Always run, but empty query returns all martyrs
  });

  const handleSearch = (newQuery: string) => {
    if (newQuery) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchParams({});
  };

  return {
    query,
    results,
    isLoading,
    isError,
    error,
    handleSearch,
    clearSearch,
  };
}
