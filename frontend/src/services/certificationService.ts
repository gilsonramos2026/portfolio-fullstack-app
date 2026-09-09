import { apiClient } from "./apiClient";
import type { Certification, CertificationPayload } from "@/types/certification";

export const certificationService = {
  async list(): Promise<Certification[]> {
    const { data } = await apiClient.get<Certification[]>("/certifications");
    return data;
  },
  async create(payload: CertificationPayload): Promise<Certification> {
    const { data } = await apiClient.post<Certification>("/certifications", payload);
    return data;
  },
  async update(id: number, payload: CertificationPayload): Promise<Certification> {
    const { data } = await apiClient.put<Certification>(`/certifications/${id}`, payload);
    return data;
  },
  async remove(id: number): Promise<void> {
    await apiClient.delete(`/certifications/${id}`);
  },
};
