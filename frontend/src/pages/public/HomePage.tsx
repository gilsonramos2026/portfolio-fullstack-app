import { useQuery } from '@tanstack/react-query'
import { publicApi } from '../../services/api'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { TypeAnimation } from 'react-type-animation'
import {
  ArrowRight, Download, Github, Linkedin, MapPin,
  Star, ExternalLink, ChevronRight
} from 'lucide-react'
import clsx from 'clsx'

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <div
      ref={ref}
      className={clsx('transition-all duration-700', inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function HomePage() {
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: publicApi.getProfile })
  const { data: projects } = useQuery({ queryKey: ['projects-featured'], queryFn: () => publicApi.getProjects(true) })
  const { data: skills } = useQuery({ queryKey: ['skills'], queryFn: publicApi.getSkills })
  const { data: testimonials } = useQuery({ queryKey: ['testimonials-featured'], queryFn: () => publicApi.getTestimonials(true) })

  const allSkillFlat = skills ? Object.values(skills).flat() : []

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center">
        {/* bg effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-12 items-center w-full">
          {/* Text */}
          <div className="space-y-6">
            <div className="animate-in">
              {profile?.available && (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Disponível para projetos
                </span>
              )}
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Olá, sou{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400 glow-text">
                  {profile?.name?.split(' ')[0] ?? 'Dev'}
                </span>
              </h1>
            </div>

            <div className="animate-in delay-100 text-2xl md:text-3xl text-slate-300 font-medium h-10">
              <TypeAnimation
                sequence={[
                  profile?.title ?? 'Desenvolvedor Full Stack', 2500,
                  'Arquiteto de Soluções', 2000,
                  'Apaixonado por Código', 2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </div>

            <p className="animate-in delay-200 text-slate-400 text-lg leading-relaxed max-w-lg">
              {profile?.bio?.slice(0, 200)}
              {(profile?.bio?.length ?? 0) > 200 ? '...' : ''}
            </p>

            {profile?.location && (
              <p className="animate-in delay-200 flex items-center gap-1.5 text-slate-500 text-sm">
                <MapPin size={14} /> {profile.location}
              </p>
            )}

            <div className="animate-in delay-300 flex flex-wrap gap-3">
              <Link to="/projects" className="btn-primary">
                Ver projetos <ArrowRight size={16} />
              </Link>
              {profile?.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn-outline">
                  <Download size={16} /> Currículo
                </a>
              )}
            </div>

            <div className="animate-in delay-400 flex items-center gap-4 pt-2">
              {profile?.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noreferrer"
                  className="text-slate-400 hover:text-white transition-colors">
                  <Github size={20} />
                </a>
              )}
              {profile?.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer"
                  className="text-slate-400 hover:text-white transition-colors">
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Avatar / decorative */}
          <div className="animate-in delay-200 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden border-2 border-brand-500/30 shadow-2xl shadow-brand-500/20 animate-float">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center">
                    <span className="font-display text-8xl font-bold text-white/30">
                      {profile?.name?.[0] ?? 'D'}
                    </span>
                  </div>
                )}
              </div>
              {/* Stats floating badges */}
              {profile?.yearsExp && (
                <div className="absolute -left-6 top-1/3 card-glass px-4 py-3 text-center">
                  <div className="font-display text-2xl font-bold text-brand-400">{profile.yearsExp}+</div>
                  <div className="text-xs text-slate-400">Anos exp.</div>
                </div>
              )}
              <div className="absolute -right-4 bottom-12 card-glass px-4 py-3 text-center">
                <div className="font-display text-2xl font-bold text-accent-400">{projects?.length ?? 0}+</div>
                <div className="text-xs text-slate-400">Projetos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SKILLS STRIP ===== */}
      {allSkillFlat.length > 0 && (
        <section className="section-divider py-16 bg-surface-900/50">
          <div className="max-w-7xl mx-auto px-6">
            <FadeInSection>
              <h2 className="text-center text-slate-500 text-sm font-medium uppercase tracking-widest mb-8">
                Tecnologias que uso no dia a dia
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {allSkillFlat.slice(0, 16).map(skill => (
                  <span key={skill.id}
                    className="card-glass px-4 py-2 text-sm text-slate-300 font-medium cursor-default">
                    {skill.name}
                  </span>
                ))}
              </div>
            </FadeInSection>
          </div>
        </section>
      )}

      {/* ===== FEATURED PROJECTS ===== */}
      {projects && projects.length > 0 && (
        <section className="section-divider py-24">
          <div className="max-w-7xl mx-auto px-6">
            <FadeInSection>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <h2 className="section-title">Projetos em Destaque</h2>
                  <p className="section-subtitle">Alguns dos trabalhos que mais me orgulho</p>
                </div>
                <Link to="/projects" className="hidden md:flex items-center gap-1 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors">
                  Ver todos <ChevronRight size={16} />
                </Link>
              </div>
            </FadeInSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((project, i) => (
                <FadeInSection key={project.id} delay={i * 100}>
                  <Link to={`/projects/${project.slug}`} className="card-glass p-0 overflow-hidden block group h-full">
                    {/* Thumbnail */}
                    <div className="h-48 bg-gradient-to-br from-brand-900 to-surface-800 overflow-hidden">
                      {project.thumbnailUrl ? (
                        <img src={project.thumbnailUrl} alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-display text-4xl font-bold text-brand-400/30">
                            {project.title[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags?.slice(0, 3).map(tag => (
                          <span key={tag} className="tag-pill">{tag}</span>
                        ))}
                      </div>
                      <h3 className="font-display font-bold text-lg text-white group-hover:text-brand-300 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                        {project.shortDesc}
                      </p>
                      <div className="flex items-center gap-3 pt-2">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="text-slate-500 hover:text-white transition-colors">
                            <Github size={16} />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a href={project.demoUrl} target="_blank" rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="text-slate-500 hover:text-brand-400 transition-colors">
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <span className="ml-auto text-brand-400 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Detalhes <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </FadeInSection>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link to="/projects" className="btn-outline">
                Ver todos os projetos <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== TESTIMONIALS ===== */}
      {testimonials && testimonials.length > 0 && (
        <section className="section-divider py-24 bg-surface-900/50">
          <div className="max-w-7xl mx-auto px-6">
            <FadeInSection>
              <div className="text-center mb-12">
                <h2 className="section-title">O que dizem sobre mim</h2>
                <p className="section-subtitle mx-auto">Depoimentos de quem trabalhou comigo</p>
              </div>
            </FadeInSection>

            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((t, i) => (
                <FadeInSection key={t.id} delay={i * 100}>
                  <div className="card-glass p-6 space-y-4">
                    <div className="flex gap-1">
                      {Array.from({ length: t.rating ?? 5 }).map((_, j) => (
                        <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-300 leading-relaxed italic">"{t.content}"</p>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {t.avatarUrl
                          ? <img src={t.avatarUrl} alt={t.name} className="w-full h-full object-cover" />
                          : <span className="text-white font-bold text-sm">{t.name[0]}</span>
                        }
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{t.name}</div>
                        <div className="text-slate-500 text-xs">
                          {t.role}{t.company ? ` · ${t.company}` : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeInSection>
            <div className="card-glass p-12 space-y-6">
              <h2 className="font-display text-4xl font-bold text-white">
                Vamos trabalhar juntos?
              </h2>
              <p className="text-slate-400 text-lg">
                Estou sempre aberto a novos projetos e oportunidades. Manda uma mensagem!
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/contact" className="btn-primary">
                  Entrar em contato <ArrowRight size={16} />
                </Link>
                {profile?.resumeUrl && (
                  <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn-outline">
                    <Download size={16} /> Baixar CV
                  </a>
                )}
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  )
}
