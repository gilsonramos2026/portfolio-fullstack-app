import type { PageResponse } from "../types/api";
import type { Project, ProjectImage, ProjectPayload } from "../types/project";
import { apiClient } from "./apiClient";

export interface ListProjectsParams {
  page?: number;
  size?: number;
}

export const projectService = {
  /** Rota pública, paginada — GET /projects?page=&size=&sort=displayOrder,asc */
  async list(params: ListProjectsParams = {}): Promise<PageResponse<Project>> {
    const { page = 0, size = 6 } = params;
    const { data } = await apiClient.get<PageResponse<Project>>("/projects", {
      params: { page, size, sort: "displayOrder,asc" },
    });
    return data;
  },

  /** Rota pública, paginada — projetos marcados como destaque (endpoint dedicado). */
  async listFeatured(params: ListProjectsParams = {}): Promise<PageResponse<Project>> {
    const { page = 0, size = 3 } = params;
    const { data } = await apiClient.get<PageResponse<Project>>("/projects/featured", {
      params: { page, size, sort: "displayOrder,asc" },
    });
    return data;
  },

  /** Rota pública — detalhe de um projeto. */
  async getById(id: number | string): Promise<Project> {
    const { data } = await apiClient.get<Project>(`/projects/${id}`);
    return data;
  },

  /** Rota admin — criação. */
  async create(payload: ProjectPayload): Promise<Project> {
    const { data } = await apiClient.post<Project>("/projects", payload);
    return data;
  },

  /** Rota admin — edição. */
  async update(id: number, payload: ProjectPayload): Promise<Project> {
    const { data } = await apiClient.put<Project>(`/projects/${id}`, payload);
    return data;
  },

  /** Rota admin — exclusão. */
  async remove(id: number): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },

  /** Rota admin — adiciona um screenshot à galeria do projeto. */
  async addImage(projectId: number, file: File, onProgress?: (percent: number) => void): Promise<ProjectImage> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await apiClient.post<ProjectImage>(`/projects/${projectId}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (!onProgress || !event.total) return;
        onProgress(Math.round((event.loaded / event.total) * 100));
      },
    });
    return data;
  },

  /** Rota admin — remove um screenshot da galeria. */
  async removeImage(projectId: number, imageId: number): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/images/${imageId}`);
  },

  /** Rota admin — reordena a galeria (arrastar-e-soltar no frontend). */
  async reorderImages(projectId: number, orderedImageIds: number[]): Promise<ProjectImage[]> {
    const { data } = await apiClient.put<ProjectImage[]>(`/projects/${projectId}/images/reorder`, orderedImageIds);
    return data;
  },
};
