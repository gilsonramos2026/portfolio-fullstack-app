import { useRef, useState, type ChangeEvent } from "react";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { useDocumentUpload } from "@/hooks/useUpload";

const MAX_SIZE_MB = 10;

interface DocumentUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  error?: string;
}

/** Upload de PDF com feedback textual (sem preview visual, como no de imagem). */
export function DocumentUploadField({ label, value, onChange, hint, error }: DocumentUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const documentUpload = useDocumentUpload();

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.type !== "application/pdf") {
      setLocalError("Formato não aceito. Envie um arquivo PDF.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setLocalError(`Arquivo muito grande. Máximo de ${MAX_SIZE_MB}MB.`);
      return;
    }

    setLocalError(null);
    setProgress(0);
    documentUpload.mutate(
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

  const isUploading = documentUpload.isPending;
  const displayedError = localError ?? error;
  const fileNameFromUrl = value ? decodeURIComponent(value.split("/").pop() ?? "") : null;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-(--t2)">{label}</span>

      <div className="flex items-center gap-3 rounded-lg border border-(--bd) bg-(--s1) px-3.5 py-2.5">
        <FileText size={16} className="shrink-0 text-(--t4)" />

        <div className="min-w-0 flex-1">
          {isUploading ? (
            <span className="font-mono text-xs text-(--t4)">Enviando... {progress ?? 0}%</span>
          ) : value ? (
            <a
              href={value}
              target="_blank"
              rel="noreferrer noopener"
              className="block truncate text-sm text-(--color-brand-400) hover:underline"
            >
              {fileNameFromUrl}
            </a>
          ) : (
            <span className="text-sm text-(--t4)">Nenhum currículo enviado</span>
          )}
        </div>

        {value && !isUploading && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remover currículo"
            className="shrink-0 text-(--t4) transition-colors hover:text-red-400"
          >
            <X size={14} />
          </button>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-(--bd) px-3 py-1.5 text-xs font-medium text-(--t1) transition-colors hover:border-(--color-brand-500) disabled:opacity-50"
        >
          {isUploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
          {value ? "Trocar" : "Enviar PDF"}
        </button>

        <input ref={inputRef} type="file" accept="application/pdf" onChange={handleInputChange} className="hidden" />
      </div>

      {hint && !displayedError && <span className="text-xs text-(--t4)">{hint}</span>}
      {displayedError && <span className="text-xs text-red-400">{displayedError}</span>}
    </div>
  );
}
