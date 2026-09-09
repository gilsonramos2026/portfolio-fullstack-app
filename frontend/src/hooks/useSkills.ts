import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { skillService } from "@/services/skillService";
import type { SkillPayload } from "@/types/skill";

const KEY = ["skills"] as const;

export function useSkills() {
  return useQuery({ queryKey: KEY, queryFn: skillService.list });
}

export function useCreateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SkillPayload) => skillService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SkillPayload }) => skillService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => skillService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
