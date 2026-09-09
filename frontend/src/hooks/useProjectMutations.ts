import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "@/services/projectService";
import { queryKeys } from "@/lib/queryClient";
import type { ProjectPayload } from "@/types/project";

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProjectPayload) => projectService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ProjectPayload }) =>
      projectService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.setQueryData(queryKeys.project(updated.id), updated);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => projectService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useAddProjectImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      file,
      onProgress,
    }: {
      projectId: number;
      file: File;
      onProgress?: (percent: number) => void;
    }) => projectService.addImage(projectId, file, onProgress),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
    },
  });
}

export function useRemoveProjectImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, imageId }: { projectId: number; imageId: number }) =>
      projectService.removeImage(projectId, imageId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
    },
  });
}

export function useReorderProjectImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, orderedImageIds }: { projectId: number; orderedImageIds: number[] }) =>
      projectService.reorderImages(projectId, orderedImageIds),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
    },
  });
}
