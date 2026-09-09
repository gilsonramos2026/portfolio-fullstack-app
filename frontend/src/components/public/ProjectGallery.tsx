import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { ProjectImage } from "@/types/project";

interface ProjectGalleryProps {
  images: ProjectImage[];
  title: string;
}

/**
 * Exibe a galeria pública de um projeto: imagem principal + tiras de
 * miniatura quando há mais de uma, com lightbox fullscreen (setas,
 * teclado, clique fora para fechar) para navegar pelos screenshots.
 */
export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goPrev = useCallback(() => setActiveIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const goNext = useCallback(() => setActiveIndex((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, goPrev, goNext]);

  if (!images.length) return null;

  return (
    <div className="mt-8">
      <div
        onClick={() => setLightboxOpen(true)}
        role="button"
        tabIndex={0}
        className="group relative cursor-zoom-in overflow-hidden rounded-2xl border border-(--bd)"
      >
        <img src={images[activeIndex].url} alt={`${title} — screenshot ${activeIndex + 1}`} className="w-full object-cover" />
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <Maximize2 size={14} />
        </span>
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={
                "h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all " +
                (i === activeIndex ? "border-(--color-brand-400) opacity-100" : "border-transparent opacity-40 hover:opacity-70")
              }
            >
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: "rgba(2,6,23,0.97)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            <div className="flex shrink-0 items-center justify-between px-5 py-3" onClick={(e) => e.stopPropagation()}>
              <span className="font-mono text-sm text-white/50">
                {activeIndex + 1} / {images.length}
              </span>
              <button
                onClick={() => setLightboxOpen(false)}
                className="tap rounded-xl text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Fechar"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center gap-4 px-4" onClick={(e) => e.stopPropagation()}>
              {images.length > 1 && (
                <motion.button
                  onClick={goPrev}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="tap shrink-0 rounded-full border border-white/20 p-2 text-white/60 transition-all hover:border-white/50 hover:text-white"
                  aria-label="Anterior"
                >
                  <ChevronLeft size={22} />
                </motion.button>
              )}

              <motion.img
                key={activeIndex}
                src={images[activeIndex].url}
                alt={`${title} — screenshot ${activeIndex + 1}`}
                className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
                style={{ maxHeight: "calc(100dvh - 160px)" }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
              />

              {images.length > 1 && (
                <motion.button
                  onClick={goNext}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="tap shrink-0 rounded-full border border-white/20 p-2 text-white/60 transition-all hover:border-white/50 hover:text-white"
                  aria-label="Próxima"
                >
                  <ChevronRight size={22} />
                </motion.button>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex shrink-0 justify-center gap-2 overflow-x-auto px-4 pb-5" onClick={(e) => e.stopPropagation()}>
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveIndex(i)}
                    className={
                      "h-9 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all " +
                      (i === activeIndex ? "border-(--color-brand-400) opacity-100" : "border-transparent opacity-40 hover:opacity-70")
                    }
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
