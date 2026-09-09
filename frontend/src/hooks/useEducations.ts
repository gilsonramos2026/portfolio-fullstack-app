import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { educationService } from "@/services/educationService";
import type { EducationPayload } from "@/types/education";

const KEY = ["educations"] as const;

export function useEducations() {
  return useQuery({ queryKey: KEY, queryFn: educationService.list });
}

export function useCreateEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: EducationPayload) => educationService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: EducationPayload }) => educationService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => educationService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
