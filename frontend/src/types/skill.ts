export interface Skill {
  id: number;
  name: string;
  category?: string;
  proficiency: number; // 0-100
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SkillPayload {
  name: string;
  category?: string;
  proficiency: number;
  displayOrder: number;
}
