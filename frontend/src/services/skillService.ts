import { apiClient } from "./apiClient";
import type { Skill, SkillPayload } from "@/types/skill";

export const skillService = {
  async list(): Promise<Skill[]> {
    const { data } = await apiClient.get<Skill[]>("/skills");
    return data;
  },
  async create(payload: SkillPayload): Promise<Skill> {
    const { data } = await apiClient.post<Skill>("/skills", payload);
    return data;
  },
  async update(id: number, payload: SkillPayload): Promise<Skill> {
    const { data } = await apiClient.put<Skill>(`/skills/${id}`, payload);
    return data;
  },
  async remove(id: number): Promise<void> {
    await apiClient.delete(`/skills/${id}`);
  },
};
