import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryClient";
import { projectService } from "../services/projectService";

export function useProject(id: number | string | undefined) {
  return useQuery({
    queryKey: queryKeys.project(id ?? "unknown"),
    queryFn: () => projectService.getById(id as number | string),
    enabled: id !== undefined,
  });
}
