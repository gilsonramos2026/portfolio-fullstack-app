import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/projectService";
import { queryKeys } from "@/lib/queryClient";

export function useProject(id: number | string | undefined) {
  return useQuery({
    queryKey: queryKeys.project(id ?? "unknown"),
    queryFn: () => projectService.getById(id as number | string),
    enabled: id !== undefined,
  });
}
