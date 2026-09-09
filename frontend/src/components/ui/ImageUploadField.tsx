import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { clsx } from "clsx";
import { useImageUpload } from "@/hooks/useUpload";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  error?: string;
  /** Proporção do preview: "square" (foto de perfil) ou "wide" (capa de projeto). */
  aspect?: "square" | "wide";
}

/**
 * Upload de imagem com preview imediato e fallback manual de URL.
 * O arquivo é enviado assim que selecionado (POST /api/uploads/images);
 * ao concluir, `onChange` recebe a URL pública para ser salva junto do
 * resto do formulário (perfil ou projeto).
 */
export function ImageUploadField({
  label,
  value,
  onChange,
  hint,
  error,
  aspect = "square",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const imageUpload = useImageUpload();

  function validateFile(file: File): string | null {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Formato não aceito. Envie JPG, PNG ou WEBP.";
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `Arquivo muito grande. Máximo de ${MAX_SIZE_MB}MB.`;
    }
    return null;
  }

  function handleFile(file: File | undefined) {
    if (!file) return;
    const validationError = validateFile(file);
    if (validationError) {
      setLocalError(validationError);
      return;
    }
    setLocalError(null);
    setProgress(0);
    imageUpload.mutate(
      { file, onProgress: setProgress },
      {
        onSuccess: (result) => {
          onChange(result.url);
          setProgress(null);
        },
        onError: () => {
          setLocalError("Falha no upload. Tente novamente.");
          setProgress(null);
        },
      },
    );
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    handleFile(event.target.files?.[0]);
    event.target.value = ""; // permite reenviar o mesmo arquivo depois
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  }

  const isUploading = imageUpload.isPending;
  const displayedError = localError ?? error;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-(--t2)">{label}</span>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          className={clsx(
            "relative flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border bg-(--cb) transition-colors",
            aspect === "square" ? "h-24 w-24" : "h-24 w-40",
            isDragging ? "border-(--color-brand-500)" : "border-(--bd) hover:border-(--t4)",
          )}
        >
          {value && !isUploading ? (
            <img src={value} alt="Prévia" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon size={22} className="text-(--t4)" />
          )}

          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/70 text-white">
              <Loader2 size={18} className="animate-spin" />
              <span className="font-mono text-xs">{progress ?? 0}%</span>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            onChange={handleInputChange}
            className="hidden"
          />
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 rounded-lg border border-(--bd) px-3.5 py-2 text-sm font-medium text-(--t1) transition-colors hover:border-(--color-brand-500) disabled:opacity-50"
          >
            <Upload size={14} />
            {value ? "Trocar imagem" : "Enviar imagem"}
          </button>
          {value && !isUploading && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1.5 text-xs text-(--t4) transition-colors hover:text-red-400"
            >
              <X size={12} />
              Remover
            </button>
          )}
        </div>
      </div>

      {hint && !displayedError && <span className="text-xs text-(--t4)">{hint}</span>}
      {displayedError && <span className="text-xs text-red-400">{displayedError}</span>}
    </div>
  );
}
