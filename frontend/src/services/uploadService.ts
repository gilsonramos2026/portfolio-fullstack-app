import { apiClient } from "./apiClient";

export interface UploadResponse {
  url: string;
  fileName: string;
  sizeInBytes: number;
}

export const uploadService = {
  /** POST /api/uploads/images — foto de perfil ou capa de projeto (JPG/PNG/WEBP). */
  async uploadImage(file: File, onProgress?: (percent: number) => void): Promise<UploadResponse> {
    return upload("/uploads/images", file, onProgress);
  },

  /** POST /api/uploads/documents — currículo em PDF. */
  async uploadDocument(file: File, onProgress?: (percent: number) => void): Promise<UploadResponse> {
    return upload("/uploads/documents", file, onProgress);
  },
};

async function upload(
  path: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<UploadResponse>(path, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (!onProgress || !event.total) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    },
  });

  return data;
}
