import { useQuery } from '@tanstack/react-query'
import { adminApiService } from '../../services/api'
import { Link } from 'react-router-dom'
import {
  FolderKanban, Zap, Award, MessageSquare,
  GraduationCap, Star, Briefcase, ArrowRight, Clock
} from 'lucide-react'
import clsx from 'clsx'

const statusColor = (s?: string) =>
  s === 'new' ? 'text-brand-400' : s === 'replied' ? 'text-emerald-400' : 'text-slate-500'

export default function AdminDashboard() {
  const { data: projects }       = useQuery({ queryKey: ['admin-projects'],      queryFn: adminApiService.getProjects })
  const { data: skills }         = useQuery({ queryKey: ['admin-skills'],        queryFn: adminApiService.getSkills })
  const { data: experiences }    = useQuery({ queryKey: ['admin-experiences'],   queryFn: adminApiService.getExperiences })
  const { data: educations }     = useQuery({ queryKey: ['admin-educations'],    queryFn: adminApiService.getEducations })
  const { data: certifications } = useQuery({ queryKey: ['admin-certs'],        queryFn: adminApiService.getCertifications })
  const { data: testimonials }   = useQuery({ queryKey: ['admin-testimonials'], queryFn: adminApiService.getTestimonials })
  const { data: contacts }       = useQuery({ queryKey: ['admin-contacts'],     queryFn: () => adminApiService.getContacts() })
  const { data: newCount }       = useQuery({ queryKey: ['contacts-count'],     queryFn: adminApiService.countNewContacts })

  const stats = [
    { label: 'Projetos',      value: projects?.length       ?? 0, icon: FolderKanban, to: '/admin/projects',      color: 'blue' },
    { label: 'Skills',        value: skills?.length         ?? 0, icon: Zap,          to: '/admin/skills',        color: 'purple' },
    { label: 'Experiências',  value: experiences?.length    ?? 0, icon: Briefcase,    to: '/admin/experiences',   color: 'blue' },
    { label: 'Educação',      value: educations?.length     ?? 0, icon: GraduationCap,to: '/admin/educations',   color: 'purple' },
    { label: 'Certificações', value: certifications?.length ?? 0, icon: Award,        to: '/admin/certifications',color: 'blue' },
    { label: 'Testemunhos',   value: testimonials?.length   ?? 0, icon: Star,         to: '/admin/testimonials',  color: 'purple' },
    { label: 'Contatos',      value: contacts?.length       ?? 0, icon: MessageSquare,to: '/admin/contacts',      color: 'blue',
      badge: newCount?.count },
  ]

  const recentContacts = contacts?.slice(0, 5) ?? []

  const quickActions = [
    { label: 'Editar perfil',          to: '/admin/profile' },
    { label: 'Adicionar projeto',       to: '/admin/projects' },
    { label: 'Adicionar skill',         to: '/admin/skills' },
    { label: 'Adicionar experiência',   to: '/admin/experiences' },
    { label: 'Adicionar certificação',  to: '/admin/certifications' },
    { label: 'Ver mensagens novas',     to: '/admin/contacts' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Visão geral do seu portfólio profissional</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Link key={stat.label} to={stat.to}
            className="card-glass p-4 hover:border-brand-500/40 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center',
                stat.color === 'blue' ? 'bg-brand-500/15 text-brand-400' : 'bg-accent-500/15 text-accent-400')}>
                <stat.icon size={17} />
              </div>
              {stat.badge && stat.badge > 0 && (
                <span className="bg-brand-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {stat.badge}
                </span>
              )}
            </div>
            <div className="font-display text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-slate-500 text-xs mt-0.5">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions + Recent contacts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-glass p-6">
          <h2 className="font-display font-bold text-white mb-4 flex items-center gap-2 text-sm">
            <ArrowRight size={15} className="text-brand-400" /> Ações Rápidas
          </h2>
          <div className="space-y-1">
            {quickActions.map(item => (
              <Link key={item.to} to={item.to}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white text-sm transition-all group">
                {item.label}
                <ArrowRight size={13} className="text-slate-700 group-hover:text-brand-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        <div className="card-glass p-6">
          <h2 className="font-display font-bold text-white mb-4 flex items-center gap-2 text-sm">
            <MessageSquare size={15} className="text-brand-400" /> Mensagens Recentes
          </h2>
          {recentContacts.length === 0 ? (
            <p className="text-slate-600 text-sm text-center py-8">Nenhuma mensagem ainda.</p>
          ) : (
            <div className="space-y-3">
              {recentContacts.map(c => (
                <Link to="/admin/contacts" key={c.id} className="flex items-start gap-3 hover:bg-white/3 rounded-xl p-1.5 transition-colors">
                  <div className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs',
                    c.status === 'new' ? 'bg-brand-500/20 text-brand-400' : 'bg-white/5 text-slate-500'
                  )}>
                    {c.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs font-semibold truncate">{c.name}</span>
                      {c.status === 'new' && <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />}
                    </div>
                    <p className="text-slate-500 text-xs truncate">{c.subject ?? c.message.slice(0, 50)}</p>
                    <p className="text-slate-700 text-xs flex items-center gap-1 mt-0.5">
                      <Clock size={9} />
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString('pt-BR') : '—'}
                    </p>
                  </div>
                  <span className={clsx('text-xs flex-shrink-0 font-medium capitalize', statusColor(c.status))}>
                    {c.status === 'new' ? 'Nova' : c.status === 'read' ? 'Lida' : c.status === 'replied' ? 'Respondida' : 'Arquivada'}
                  </span>
                </Link>
              ))}
              <Link to="/admin/contacts" className="block text-center text-brand-400 hover:text-brand-300 text-xs pt-1 transition-colors">
                Ver todas as mensagens →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Featured projects preview */}
      {projects && projects.filter(p => p.featured).length > 0 && (
        <div>
          <h2 className="font-display font-bold text-white mb-4 text-sm flex items-center gap-2">
            <FolderKanban size={15} className="text-brand-400" /> Projetos em Destaque
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {projects.filter(p => p.featured).slice(0, 3).map(p => (
              <div key={p.id} className="card-glass p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={clsx('w-2 h-2 rounded-full',
                    p.status === 'completed' ? 'bg-emerald-400' :
                    p.status === 'in_progress' ? 'bg-amber-400' : 'bg-slate-500')} />
                  <span className="text-xs text-slate-500 capitalize">{p.status?.replace('_', ' ')}</span>
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{p.title}</h3>
                <p className="text-slate-500 text-xs line-clamp-2">{p.shortDesc}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.tags?.slice(0, 3).map(t => (
                    <span key={t} className="text-xs text-brand-400 bg-brand-500/10 border border-brand-500/20 rounded px-1.5 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
