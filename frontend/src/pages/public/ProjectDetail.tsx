import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { publicApi } from '../../services/api'
import {
  ArrowLeft, Github, ExternalLink, Calendar,
  CheckCircle2, Clock, Archive, ChevronLeft,
  ChevronRight, X, Tag, Maximize2, Image
} from 'lucide-react'
import clsx from 'clsx'

// ─── tipos de status ────────────────────────────────────────
const STATUS_MAP = {
  completed: {
    label: 'Concluído',
    icon: CheckCircle2,
    cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  in_progress: {
    label: 'Em andamento',
    icon: Clock,
    cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-400',
  },
  archived: {
    label: 'Arquivado',
    icon: Archive,
    cls: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    dot: 'bg-slate-500',
  },
}

// ─── lightbox ───────────────────────────────────────────────
function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: { url: string; altText?: string }[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div
      style={{ minHeight: '100vh', background: 'rgba(0,0,0,0.92)' }}
      className="flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full mx-6 flex flex-col items-center gap-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X size={28} />
        </button>

        {/* Counter */}
        <p className="absolute -top-10 left-0 text-white/40 text-sm">
          {index + 1} / {images.length}
        </p>

        {/* Main image */}
        <div className="w-full rounded-2xl overflow-hidden border border-white/10">
          <img
            src={images[index].url}
            alt={images[index].altText ?? `Imagem ${index + 1}`}
            className="w-full object-contain max-h-[70vh]"
          />
        </div>

        {/* Alt text caption */}
        {images[index].altText && (
          <p className="text-white/50 text-sm text-center">{images[index].altText}</p>
        )}

        {/* Prev / Next */}
        {images.length > 1 && (
          <div className="flex items-center gap-4">
            <button
              onClick={onPrev}
              className="p-3 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all"
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={clsx('w-2 h-2 rounded-full transition-all', i === index ? 'bg-brand-400 w-4' : 'bg-white/20')}
                />
              ))}
            </div>
            <button
              onClick={onNext}
              className="p-3 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all"
              aria-label="Próxima imagem"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── galeria de screenshots ─────────────────────────────────
function ScreenshotGallery({ images }: { images: { url: string; altText?: string; sortOrder?: number }[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const prev = () => setLightboxIndex(i => (i === null ? 0 : (i - 1 + images.length) % images.length))
  const next = () => setLightboxIndex(i => (i === null ? 0 : (i + 1) % images.length))

  if (images.length === 0) return null

  const hero = images[0]
  const rest = images.slice(1)

  return (
    <>
      <div className="space-y-3">
        {/* Hero image (primeira screenshot, grande) */}
        <div
          className="relative rounded-2xl overflow-hidden border border-white/10 cursor-pointer group"
          onClick={() => setLightboxIndex(0)}
        >
          <img
            src={hero.url}
            alt={hero.altText ?? 'Screenshot principal'}
            className="w-full object-cover max-h-96 group-hover:scale-[1.02] transition-transform duration-500"
          />
          {/* Overlay com ícone de fullscreen */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm border border-white/20 rounded-xl p-3">
              <Maximize2 size={20} className="text-white" />
            </div>
          </div>
          {/* Label figma-style */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg px-2.5 py-1">
            <Image size={11} className="text-brand-400" />
            <span className="text-white/70 text-xs font-medium">Screenshot</span>
          </div>
        </div>

        {/* Grid de miniaturas */}
        {rest.length > 0 && (
          <div className={clsx('grid gap-3', rest.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3')}>
            {rest.map((img, i) => (
              <div
                key={i}
                className="relative rounded-xl overflow-hidden border border-white/10 cursor-pointer group aspect-video"
                onClick={() => setLightboxIndex(i + 1)}
              >
                <img
                  src={img.url}
                  alt={img.altText ?? `Screenshot ${i + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <Maximize2 size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {img.altText && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white/80 text-xs truncate">{img.altText}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="text-slate-600 text-xs text-center">
          {images.length} screenshot{images.length > 1 ? 's' : ''} · clique para ampliar
        </p>
      </div>

      {/* Lightbox (usa minHeight para não usar position:fixed) */}
      {lightboxIndex !== null && (
        <div style={{ marginTop: 0 }}>
          <Lightbox
            images={images}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={prev}
            onNext={next}
          />
        </div>
      )}
    </>
  )
}

// ─── formatação de data ─────────────────────────────────────
function fmtDate(d?: string) {
  if (!d) return null
  return new Date(d).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

// ─── página principal ───────────────────────────────────────
export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => publicApi.getProject(slug!),
    enabled: !!slug,
  })

  // loading skeleton
  if (isLoading) return (
    <div className="max-w-5xl mx-auto px-6 py-24 space-y-6 animate-pulse">
      <div className="h-5 bg-white/10 rounded w-32" />
      <div className="h-72 bg-white/10 rounded-2xl" />
      <div className="h-8 bg-white/10 rounded w-2/3" />
      <div className="space-y-2">
        <div className="h-4 bg-white/10 rounded" />
        <div className="h-4 bg-white/10 rounded w-5/6" />
        <div className="h-4 bg-white/10 rounded w-4/6" />
      </div>
    </div>
  )

  if (isError || !project) return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-4">
      <p className="text-slate-400 text-lg">Projeto não encontrado.</p>
      <Link to="/projects" className="btn-primary inline-flex">
        <ArrowLeft size={16} /> Ver todos os projetos
      </Link>
    </div>
  )

  const status = STATUS_MAP[project.status as keyof typeof STATUS_MAP] ?? STATUS_MAP.completed
  const StatusIcon = status.icon
  const hasImages = project.images && project.images.length > 0

  // Mescla thumbnail como primeira imagem se não houver imagens próprias
  const galleryImages: { url: string; altText?: string }[] = hasImages
    ? project.images!
    : project.thumbnailUrl
      ? [{ url: project.thumbnailUrl, altText: project.title }]
      : []

  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      {/* Breadcrumb */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-10 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Voltar para projetos
      </Link>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* ─── COLUNA ESQUERDA – info e galeria ─── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Tags + título */}
          <div>
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map(t => (
                  <span key={t} className="tag-pill flex items-center gap-1">
                    <Tag size={10} /> {t}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
              {project.title}
            </h1>
            <p className="text-slate-400 text-lg mt-3 leading-relaxed">{project.shortDesc}</p>
          </div>

          {/* Galeria de screenshots */}
          {galleryImages.length > 0 && (
            <div>
              <h2 className="font-display font-bold text-white text-xl mb-4 flex items-center gap-2">
                <Image size={18} className="text-brand-400" />
                Screenshots
              </h2>
              <ScreenshotGallery images={galleryImages} />
            </div>
          )}

          {/* Descrição completa */}
          <div>
            <h2 className="font-display font-bold text-white text-xl mb-4">Sobre o projeto</h2>
            <div className="card-glass p-6">
              <p className="text-slate-300 leading-relaxed whitespace-pre-line text-base">
                {project.description}
              </p>
            </div>
          </div>
        </div>

        {/* ─── COLUNA DIREITA – meta ─── */}
        <div className="space-y-4">

          {/* Status card */}
          <div className="card-glass p-5 space-y-4">
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-widest">
              Detalhes
            </h3>

            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Status</span>
              <span className={clsx('flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border', status.cls)}>
                <span className={clsx('w-2 h-2 rounded-full', status.dot)} />
                {status.label}
              </span>
            </div>

            {/* Período */}
            {(project.startedAt || project.finishedAt) && (
              <div className="flex items-start justify-between gap-3">
                <span className="text-slate-400 text-sm flex items-center gap-1.5 flex-shrink-0">
                  <Calendar size={14} /> Período
                </span>
                <div className="text-right">
                  {project.startedAt && (
                    <p className="text-slate-200 text-sm">{fmtDate(project.startedAt)}</p>
                  )}
                  {project.finishedAt ? (
                    <p className="text-slate-400 text-xs">até {fmtDate(project.finishedAt)}</p>
                  ) : project.startedAt ? (
                    <p className="text-slate-400 text-xs">até hoje</p>
                  ) : null}
                </div>
              </div>
            )}

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div>
                <span className="text-slate-400 text-sm block mb-2">Tecnologias</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map(t => (
                    <span key={t} className="tag-pill text-xs">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="space-y-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2.5 w-full px-5 py-3 rounded-xl border border-white/20 hover:border-brand-400/60 text-slate-300 hover:text-white font-semibold text-sm transition-all hover:bg-white/5 group"
              >
                <Github size={18} className="group-hover:scale-110 transition-transform" />
                Ver código no GitHub
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary w-full justify-center"
              >
                <ExternalLink size={16} />
                Abrir demo ao vivo
              </a>
            )}
          </div>

          {/* Featured badge */}
          {project.featured && (
            <div className="card-glass p-4 text-center border-amber-500/20">
              <p className="text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5">
                ⭐ Projeto em destaque
              </p>
            </div>
          )}

          {/* Contagem de screenshots */}
          {galleryImages.length > 0 && (
            <div className="card-glass p-4 text-center">
              <p className="text-slate-500 text-xs">
                <span className="text-brand-400 font-semibold">{galleryImages.length}</span>
                {' '}screenshot{galleryImages.length > 1 ? 's' : ''} disponíve{galleryImages.length > 1 ? 'is' : 'l'}
              </p>
            </div>
          )}

          {/* Ver mais projetos */}
          <Link
            to="/projects"
            className="block text-center text-slate-500 hover:text-brand-400 text-sm transition-colors pt-2"
          >
            ← Ver todos os projetos
          </Link>
        </div>
      </div>
    </div>
  )
}
