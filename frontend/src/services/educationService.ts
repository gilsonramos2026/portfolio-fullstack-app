import type { Education, EducationPayload } from "../types/education";
import { apiClient } from "./apiClient";

export const educationService = {
  async list(): Promise<Education[]> {
    const { data } = await apiClient.get<Education[]>("/educations");
    return data;
  },
  async create(payload: EducationPayload): Promise<Education> {
    const { data } = await apiClient.post<Education>("/educations", payload);
    return data;
  },
  async update(id: number, payload: EducationPayload): Promise<Education> {
    const { data } = await apiClient.put<Education>(`/educations/${id}`, payload);
    return data;
  },
  async remove(id: number): Promise<void> {
    await apiClient.delete(`/educations/${id}`);
  },
};
