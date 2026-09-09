export interface Education {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string; // ISO yyyy-MM-dd
  endDate?: string; // undefined/null = em andamento
  description?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface EducationPayload {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  displayOrder: number;
}
