import { useMutation } from "@tanstack/react-query";
import { uploadService } from "@/services/uploadService";

export function useImageUpload() {
  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (percent: number) => void }) =>
      uploadService.uploadImage(file, onProgress),
  });
}

export function useDocumentUpload() {
  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (percent: number) => void }) =>
      uploadService.uploadDocument(file, onProgress),
  });
}
