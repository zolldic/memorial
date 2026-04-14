import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { martyrService } from "../services/martyrService";

export function useMartyrDetail() {
  const { id } = useParams<{ id: string }>();

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["martyr-detail", id],
    queryFn: () => martyrService.getMartyrDetail(id),
    enabled: !!id,
  });

  return {
    martyr: data?.martyr ?? null,
    memories: data?.memories ?? [],
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  };
}
