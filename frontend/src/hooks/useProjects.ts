import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { projectService, type ListProjectsParams } from "../services/projectService";
import { queryKeys } from "../lib/queryClient";

export function useProjects(params: ListProjectsParams = {}) {
  return useQuery({
    queryKey: queryKeys.projects(params),
    queryFn: () => projectService.list(params),
    placeholderData: keepPreviousData, // evita "flash" de loading ao trocar de página
  });
}

export function useFeaturedProjects(params: ListProjectsParams = {}) {
  return useQuery({
    queryKey: queryKeys.projects({ featured: true, ...params }),
    queryFn: () => projectService.listFeatured(params),
  });
}
