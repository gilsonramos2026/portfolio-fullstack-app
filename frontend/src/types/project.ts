export type ProjectStatus = "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";

export interface ProjectImage {
  id: number;
  url: string;
  displayOrder: number;
}

export interface Project {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  repositoryUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  status: ProjectStatus;
  featured: boolean;
  displayOrder: number;
  startDate?: string; // LocalDate ISO (yyyy-MM-dd)
  endDate?: string;
  techStack: string[];
  images: ProjectImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectPayload {
  title: string;
  shortDescription: string;
  description: string;
  repositoryUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  status: ProjectStatus;
  featured: boolean;
  displayOrder: number;
  startDate?: string;
  endDate?: string;
  techStack: string[];
}

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluído",
  ARCHIVED: "Arquivado",
};
