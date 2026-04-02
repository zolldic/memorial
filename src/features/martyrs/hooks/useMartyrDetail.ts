import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { martyrService } from "../services/martyrService";

export function useMartyrDetail() {
  const { id } = useParams<{ id: string }>();

  const {
    data: martyr,
    isLoading: isMartyrLoading,
    isError: isMartyrError,
    error: martyrError,
  } = useQuery({
    queryKey: ["martyr", id],
    queryFn: () => martyrService.getMartyrById(id),
    enabled: !!id,
  });

  const {
    data: memories = [],
    isLoading: isMemoriesLoading,
    isError: isMemoriesError,
    error: memoriesError,
  } = useQuery({
    queryKey: ["memories", id],
    queryFn: () => martyrService.getMemoriesByMartyrId(id),
    enabled: !!id,
  });

  return {
    martyr,
    memories,
    isLoading: isMartyrLoading || isMemoriesLoading,
    isError: isMartyrError || isMemoriesError,
    error: martyrError || memoriesError,
  };
}
