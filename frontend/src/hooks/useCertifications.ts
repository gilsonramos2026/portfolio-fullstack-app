import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { certificationService } from "@/services/certificationService";
import type { CertificationPayload } from "@/types/certification";

const KEY = ["certifications"] as const;

export function useCertifications() {
  return useQuery({ queryKey: KEY, queryFn: certificationService.list });
}

export function useCreateCertification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CertificationPayload) => certificationService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateCertification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CertificationPayload }) =>
      certificationService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteCertification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => certificationService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
