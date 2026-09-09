import { useRef, useState, type DragEvent } from "react";
import toast from "react-hot-toast";
import { GripVertical, ImageOff, Loader2, Upload, X } from "lucide-react";
import { clsx } from "clsx";
import {
  useAddProjectImage,
  useRemoveProjectImage,
  useReorderProjectImages,
} from "@/hooks/useProjectMutations";
import type { ProjectImage } from "@/types/project";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

interface ProjectImageManagerProps {
  projectId: number;
  images: ProjectImage[];
}

/**
 * Galeria de screenshots de um projeto — upload múltiplo (com validação
 * client-side), reordenação por arrastar-e-soltar e remoção individual.
 * A primeira imagem (menor displayOrder) é a capa exibida publicamente.
 */
export function ProjectImageManager({ projectId, images }: ProjectImageManagerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const addImage = useAddProjectImage();
  const removeImage = useRemoveProjectImage();
  const reorderImages = useReorderProjectImages();

  const [uploadingNames, setUploadingNames] = useState<string[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const isUploading = uploadingNames.length > 0;

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const fileArr = Array.from(files);

    const invalid = fileArr.filter((f) => !ACCEPTED_TYPES.includes(f.type) || f.size > MAX_SIZE_MB * 1024 * 1024);
    if (invalid.length > 0) {
      toast.error(`${invalid.length} arquivo(s) inválido(s). Use JPG/PNG/WEBP até ${MAX_SIZE_MB}MB.`);
    }

    const valid = fileArr.filter((f) => ACCEPTED_TYPES.includes(f.type) && f.size <= MAX_SIZE_MB * 1024 * 1024);

    valid.forEach((file) => {
      setUploadingNames((prev) => [...prev, file.name]);
      addImage.mutate(
        { projectId, file },
        {
          onSuccess: () => toast.success("Screenshot adicionado!"),
          onError: () => toast.error(`Falha ao enviar ${file.name}.`),
          onSettled: () => setUploadingNames((prev) => prev.filter((n) => n !== file.name)),
        },
      );
    });
  }

  function handleDelete(imageId: number, index: number) {
    if (!confirm(`Remover screenshot ${index + 1}?`)) return;
    removeImage.mutate(
      { projectId, imageId },
      {
        onSuccess: () => toast.success("Screenshot removido."),
        onError: () => toast.error("Não foi possível remover a imagem."),
      },
    );
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDropIndex(null);
      return;
    }
    const reordered = [...images];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setDragIndex(null);
    setDropIndex(null);

    reorderImages.mutate(
      { projectId, orderedImageIds: reordered.map((img) => img.id) },
      {
        onSuccess: () => toast.success("Ordem atualizada!"),
        onError: () => toast.error("Erro ao reordenar."),
      },
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-(--t2)">Screenshots do projeto</p>
          <p className="mt-0.5 text-xs text-(--t4)">A primeira imagem aparece como capa na página pública</p>
        </div>
        <span className="rounded-full border border-(--bd) bg-(--cb) px-2 py-0.5 text-xs font-medium text-(--t4)">
          {images.length} {images.length === 1 ? "imagem" : "imagens"}
        </span>
      </div>

      {/* Dropzone */}
      <div
        onClick={() => !isUploading && fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        className={clsx(
          "flex cursor-pointer select-none flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition-all",
          isUploading
            ? "cursor-wait border-(--color-brand-500)/50 bg-(--color-brand-500)/5"
            : "border-(--bd2) hover:border-(--color-brand-500)/60 hover:bg-(--cb)",
        )}
      >
        {isUploading ? (
          <>
            <Loader2 size={22} className="animate-spin text-(--color-brand-400)" />
            <p className="text-sm font-medium text-(--color-brand-400)">
              Enviando {uploadingNames.length} arquivo{uploadingNames.length > 1 ? "s" : ""}…
            </p>
          </>
        ) : (
          <>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-(--bd) bg-(--cb)">
              <Upload size={18} className="text-(--t4)" />
            </span>
            <div>
              <p className="text-sm font-semibold text-(--t2)">Clique ou arraste imagens aqui</p>
              <p className="mt-0.5 text-xs text-(--t4)">JPG · PNG · WEBP — máx. {MAX_SIZE_MB}MB cada</p>
            </div>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* Galeria */}
      {images.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((img, i) => (
              <div
                key={img.id}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e: DragEvent) => {
                  e.preventDefault();
                  setDropIndex(i);
                }}
                onDrop={() => handleDrop(i)}
                onDragEnd={() => {
                  setDragIndex(null);
                  setDropIndex(null);
                }}
                className={clsx(
                  "group relative aspect-video cursor-grab overflow-hidden rounded-xl border bg-(--cb) transition-all",
                  dropIndex === i && dragIndex !== i
                    ? "scale-[1.03] border-(--color-brand-400) ring-2 ring-(--color-brand-400)/30"
                    : dragIndex === i
                      ? "scale-95 border-(--bd2) opacity-50"
                      : "border-(--bd) hover:border-(--bd2)",
                )}
              >
                <img src={img.url} alt={`Screenshot ${i + 1}`} className="h-full w-full object-cover" draggable={false} />

                <span className="absolute left-1.5 top-1.5 rounded-lg bg-black/60 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <GripVertical size={12} className="text-white/80" />
                </span>

                <button
                  type="button"
                  onClick={() => handleDelete(img.id, i)}
                  aria-label="Remover imagem"
                  className="absolute right-1.5 top-1.5 rounded-lg bg-black/60 p-1.5 opacity-0 transition-colors hover:bg-red-500 group-hover:opacity-100"
                >
                  <X size={11} className="text-white" />
                </button>

                <span
                  className={clsx(
                    "absolute bottom-1.5 left-1.5 rounded-md px-1.5 py-0.5 text-xs font-semibold",
                    i === 0 ? "bg-(--color-brand-500) text-white" : "bg-black/60 text-white/70",
                  )}
                >
                  {i === 0 ? "★ Capa" : `${i + 1}`}
                </span>
              </div>
            ))}
          </div>
          <p className="flex items-start gap-2 text-xs text-(--t4)">
            <GripVertical size={13} className="mt-0.5 shrink-0" />
            Arraste as imagens para reordenar. A marcada como <strong className="text-(--color-brand-400)">Capa</strong> é
            exibida como destaque na página do projeto.
          </p>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-(--bd) bg-(--cb)">
            <ImageOff size={20} className="text-(--t5)" />
          </span>
          <div>
            <p className="text-sm font-medium text-(--t3)">Nenhum screenshot ainda</p>
            <p className="mt-0.5 text-xs text-(--t4)">Envie pelo menos 1 imagem para aparecer na galeria</p>
          </div>
        </div>
      )}
    </div>
  );
}
