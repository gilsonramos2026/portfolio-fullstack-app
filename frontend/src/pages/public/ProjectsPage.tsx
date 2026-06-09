import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { publicApi } from '../../services/api'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { Github, ExternalLink, Search, ArrowRight, CheckCircle2, Clock, Archive, Image } from 'lucide-react'
import clsx from 'clsx'

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })
  return (
    <div ref={ref}
      className={clsx('transition-all duration-700', inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

const STATUS_CFG = {
  completed:   { label: 'Concluído',    Icon: CheckCircle2, cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
  in_progress: { label: 'Em andamento', Icon: Clock,        cls: 'bg-amber-500/15  text-amber-400  border-amber-500/25' },
  archived:    { label: 'Arquivado',    Icon: Archive,      cls: 'bg-slate-500/15  text-slate-400  border-slate-500/25' },
}

export default function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => publicApi.getProjects(),
  })

  const allTags = [...new Set(projects.flatMap(p => p.tags ?? []))].sort()

  const filtered = projects.filter(p => {
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDesc.toLowerCase().includes(search.toLowerCase()) ||
      (p.tags ?? []).some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchTag    = !filterTag    || (p.tags ?? []).includes(filterTag)
    const matchStatus = !filterStatus || p.status === filterStatus
    return matchSearch && matchTag && matchStatus
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      {/* Header */}
      <div className="mb-12">
        <FadeIn>
          <h1 className="section-title">Todos os Projetos</h1>
          <p className="section-subtitle">Explore meu portfólio — clique em qualquer projeto para ver os detalhes e screenshots</p>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="mt-8 space-y-3">
            {/* Busca */}
            <div className="relative max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar por nome ou tecnologia..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-9"
              />
            </div>

            {/* Filtro de tags */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-slate-600 text-xs font-medium mr-1">Tag:</span>
              <button onClick={() => setFilterTag(null)}
                className={clsx('px-3 py-1 rounded-lg text-xs font-medium transition-all',
                  !filterTag ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10')}>
                Todas
              </button>
              {allTags.map(tag => (
                <button key={tag} onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                  className={clsx('px-3 py-1 rounded-lg text-xs font-medium transition-all',
                    filterTag === tag ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10')}>
                  {tag}
                </button>
              ))}
            </div>

            {/* Filtro de status */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-slate-600 text-xs font-medium mr-1">Status:</span>
              {[null, 'completed', 'in_progress', 'archived'].map(s => {
                const cfg = s ? STATUS_CFG[s as keyof typeof STATUS_CFG] : null
                return (
                  <button key={s ?? 'all'} onClick={() => setFilterStatus(s)}
                    className={clsx('px-3 py-1 rounded-lg text-xs font-medium transition-all border',
                      filterStatus === s
                        ? s ? STATUS_CFG[s as keyof typeof STATUS_CFG].cls : 'bg-brand-500 text-white border-transparent'
                        : 'text-slate-400 border-white/10 hover:border-white/20 hover:text-white bg-white/5')}>
                    {cfg ? cfg.label : 'Todos'}
                  </button>
                )
              })}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Contagem */}
      {!isLoading && (
        <p className="text-slate-600 text-sm mb-6">
          {filtered.length} projeto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          {(filterTag || filterStatus || search) && ' com filtros ativos'}
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="card-glass h-72 animate-pulse rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 space-y-3">
          <p className="text-slate-500 text-lg">Nenhum projeto encontrado.</p>
          <button onClick={() => { setSearch(''); setFilterTag(null); setFilterStatus(null) }}
            className="text-brand-400 hover:text-brand-300 text-sm transition-colors">
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => {
            const st = STATUS_CFG[(project.status as keyof typeof STATUS_CFG) ?? 'completed']
            const StIcon = st?.Icon ?? CheckCircle2
            const imgCount = project.images?.length ?? (project.thumbnailUrl ? 1 : 0)
            return (
              <FadeIn key={project.id} delay={i * 60}>
                <Link
                  to={`/projects/${project.slug}`}
                  className="card-glass block group overflow-hidden rounded-2xl h-full flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-brand-900/40 to-surface-800 overflow-hidden flex-shrink-0">
                    {project.thumbnailUrl ? (
                      <img src={project.thumbnailUrl} alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-5xl font-bold text-brand-400/20">{project.title[0]}</span>
                      </div>
                    )}

                    {/* Badges overlay */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      {project.featured && (
                        <span className="bg-amber-500/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded-md">
                          ⭐ Destaque
                        </span>
                      )}
                      <span className={clsx('text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm ml-auto', st?.cls)}>
                        <StIcon size={10} className="inline mr-1" />
                        {st?.label}
                      </span>
                    </div>

                    {/* Screenshots count badge */}
                    {imgCount > 0 && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg px-2 py-1">
                        <Image size={11} className="text-brand-400" />
                        <span className="text-white/70 text-xs">{imgCount}</span>
                      </div>
                    )}

                    {/* Hover overlay "Ver detalhes" */}
                    <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/40 transition-all flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-brand-500/90 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2">
                        Ver detalhes <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3 flex flex-col flex-1">
                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 4).map(t => (
                          <span key={t} className="tag-pill text-xs">{t}</span>
                        ))}
                        {project.tags.length > 4 && (
                          <span className="text-slate-600 text-xs self-center">+{project.tags.length - 4}</span>
                        )}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-display font-bold text-white group-hover:text-brand-300 transition-colors text-lg leading-snug">
                      {project.title}
                    </h3>

                    {/* Desc */}
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 flex-1">
                      {project.shortDesc}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center gap-3 pt-1 border-t border-white/5">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          title="Ver no GitHub"
                          className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors text-xs">
                          <Github size={14} /> GitHub
                        </a>
                      )}
                      {project.demoUrl && (
                        <a href={project.demoUrl} target="_blank" rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          title="Abrir demo"
                          className="flex items-center gap-1.5 text-slate-500 hover:text-brand-400 transition-colors text-xs">
                          <ExternalLink size={14} /> Demo
                        </a>
                      )}
                      <span className="ml-auto text-brand-400 text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Detalhes <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            )
          })}
        </div>
      )}
    </div>
  )
}
