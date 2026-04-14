import { useQuery } from "@tanstack/react-query";
import { martyrService } from "../services/martyrService";

export function useMartyrs() {
  const { 
    data: martyrs = [], 
    isLoading, 
    isError, 
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["martyrs", "list"],
    queryFn: () => martyrService.getMartyrs(),
  });

  return {
    martyrs,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  };
}
