import { useQuery } from '@tanstack/react-query'
import { publicApi } from '../../services/api'
import { useInView } from 'react-intersection-observer'
import { MapPin, Mail, Phone, Award, ExternalLink } from 'lucide-react'
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

function SkillBar({ name, proficiency, delay }: { name: string; proficiency: number; delay: number }) {
  const { ref, inView } = useInView({ triggerOnce: true })
  return (
    <div ref={ref} className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-300 font-medium">{name}</span>
        <span className="text-slate-500">{proficiency}%</span>
      </div>
      <div className="skill-bar">
        <div
          className="skill-bar-fill"
          style={{ width: inView ? `${proficiency}%` : '0%', transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  )
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
}

export default function AboutPage() {
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: publicApi.getProfile })
  const { data: skillsMap } = useQuery({ queryKey: ['skills'], queryFn: publicApi.getSkills })
  const { data: experiences } = useQuery({ queryKey: ['experiences'], queryFn: publicApi.getExperiences })
  const { data: educations } = useQuery({ queryKey: ['educations'], queryFn: publicApi.getEducations })
  const { data: certifications } = useQuery({ queryKey: ['certifications'], queryFn: publicApi.getCertifications })

  const categoryLabels: Record<string, string> = {
    frontend: 'Front-end', backend: 'Back-end', devops: 'DevOps',
    database: 'Banco de Dados', tools: 'Ferramentas', soft: 'Soft Skills',
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-24">

      {/* ===== PROFILE ===== */}
      <section>
        <FadeIn>
          <div className="grid md:grid-cols-3 gap-12 items-start">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-brand-500/30 shadow-xl shadow-brand-500/10">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center">
                    <span className="font-display text-6xl font-bold text-white/40">{profile?.name?.[0]}</span>
                  </div>
                )}
              </div>
              <div className="text-center space-y-1">
                {profile?.location && (
                  <p className="flex items-center gap-1.5 text-slate-500 text-sm justify-center">
                    <MapPin size={13} /> {profile.location}
                  </p>
                )}
                {profile?.email && (
                  <p className="flex items-center gap-1.5 text-slate-500 text-sm justify-center">
                    <Mail size={13} /> {profile.email}
                  </p>
                )}
                {profile?.phone && (
                  <p className="flex items-center gap-1.5 text-slate-500 text-sm justify-center">
                    <Phone size={13} /> {profile.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="section-title">{profile?.name}</h1>
                <p className="text-brand-400 font-medium text-lg">{profile?.title}</p>
              </div>
              <p className="text-slate-300 leading-relaxed text-base whitespace-pre-line">{profile?.bio}</p>
              {profile?.available && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Disponível para novas oportunidades
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ===== SKILLS ===== */}
      {skillsMap && (
        <section className="section-divider pt-24">
          <FadeIn>
            <h2 className="section-title mb-2">Habilidades</h2>
            <p className="section-subtitle mb-12">Minhas competências técnicas</p>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(skillsMap).map(([category, skills], ci) => (
              <FadeIn key={category} delay={ci * 80}>
                <div className="card-glass p-6 space-y-4">
                  <h3 className="font-display font-bold text-white text-lg">
                    {categoryLabels[category] ?? category}
                  </h3>
                  <div className="space-y-4">
                    {skills.map((skill, si) => (
                      <SkillBar key={skill.id} name={skill.name} proficiency={skill.proficiency} delay={si * 100} />
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* ===== EXPERIENCE ===== */}
      {experiences && experiences.length > 0 && (
        <section className="section-divider pt-24">
          <FadeIn>
            <h2 className="section-title mb-2">Experiência Profissional</h2>
            <p className="section-subtitle mb-12">Minha trajetória de trabalho</p>
          </FadeIn>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/50 via-brand-500/20 to-transparent" />
            <div className="space-y-8 pl-12">
              {experiences.map((exp, i) => (
                <FadeIn key={exp.id} delay={i * 80}>
                  <div className="relative">
                    <div className="timeline-dot absolute -left-[2.75rem] top-1.5" />
                    <div className="card-glass p-6 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="font-display font-bold text-white text-lg">{exp.role}</h3>
                          <p className="text-brand-400 font-medium">{exp.company}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-sm">
                            {formatDate(exp.startedAt)} → {exp.current ? 'Presente' : exp.endedAt ? formatDate(exp.endedAt) : '?'}
                          </p>
                          {exp.location && <p className="text-slate-500 text-xs">{exp.location}</p>}
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">{exp.description}</p>
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {[...exp.technologies].map(t => <span key={t} className="tag-pill">{t}</span>)}
                        </div>
                      )}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== EDUCATION ===== */}
      {educations && educations.length > 0 && (
        <section className="section-divider pt-24">
          <FadeIn>
            <h2 className="section-title mb-2">Educação</h2>
            <p className="section-subtitle mb-12">Formação acadêmica</p>
          </FadeIn>
          <div className="space-y-6">
            {educations.map((edu, i) => (
              <FadeIn key={edu.id} delay={i * 80}>
                <div className="card-glass p-6 flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {edu.logoUrl
                      ? <img src={edu.logoUrl} alt={edu.institution} className="w-full h-full object-cover" />
                      : <span className="text-brand-400 font-bold text-lg">{edu.institution[0]}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-white">{edu.degree}</h3>
                    <p className="text-brand-400 text-sm font-medium">{edu.institution}</p>
                    {edu.fieldOfStudy && <p className="text-slate-400 text-sm">{edu.fieldOfStudy}</p>}
                    <p className="text-slate-500 text-xs mt-1">
                      {formatDate(edu.startedAt)} → {edu.current ? 'Cursando' : edu.endedAt ? formatDate(edu.endedAt) : '?'}
                    </p>
                    {edu.description && <p className="text-slate-400 text-sm mt-2">{edu.description}</p>}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* ===== CERTIFICATIONS ===== */}
      {certifications && certifications.length > 0 && (
        <section className="section-divider pt-24">
          <FadeIn>
            <h2 className="section-title mb-2">Certificações</h2>
            <p className="section-subtitle mb-12">Cursos e certificados</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, i) => (
              <FadeIn key={cert.id} delay={i * 60}>
                <div className="card-glass p-5 flex flex-col gap-3 h-full">
                  {cert.imageUrl && (
                    <img src={cert.imageUrl} alt={cert.name}
                      className="h-12 w-auto object-contain" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <Award size={15} className="text-brand-400 flex-shrink-0 mt-0.5" />
                      <h3 className="font-semibold text-white text-sm leading-snug">{cert.name}</h3>
                    </div>
                    <p className="text-brand-400/80 text-xs mt-1">{cert.issuer}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      Emitido: {formatDate(cert.issuedAt)}
                      {cert.expiresAt ? ` · Expira: ${formatDate(cert.expiresAt)}` : ''}
                    </p>
                  </div>
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noreferrer"
                      className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
                      <ExternalLink size={11} /> Ver credencial
                    </a>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
