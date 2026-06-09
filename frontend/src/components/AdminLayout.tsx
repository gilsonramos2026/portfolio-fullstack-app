import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminApiService } from '../../services/api'
import {
  LayoutDashboard, FolderKanban, Zap, Briefcase,
  GraduationCap, Award, Star, MessageSquare, User,
  LogOut, Code2, Bell
} from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { to: '/admin',                label: 'Dashboard',     icon: LayoutDashboard, end: true },
  { to: '/admin/profile',        label: 'Perfil',        icon: User },
  { to: '/admin/projects',       label: 'Projetos',      icon: FolderKanban },
  { to: '/admin/skills',         label: 'Skills',        icon: Zap },
  { to: '/admin/experiences',    label: 'Experiências',  icon: Briefcase },
  { to: '/admin/educations',     label: 'Educação',      icon: GraduationCap },
  { to: '/admin/certifications', label: 'Certificações', icon: Award },
  { to: '/admin/testimonials',   label: 'Testemunhos',   icon: Star },
  { to: '/admin/contacts',       label: 'Contatos',      icon: MessageSquare, badge: true },
]

export default function AdminLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    const key = localStorage.getItem('admin_key')
    if (!key) navigate('/admin/login')
  }, [navigate])

  const { data: newCount } = useQuery({
    queryKey: ['contacts-count'],
    queryFn: adminApiService.countNewContacts,
    refetchInterval: 30000,
  })

  const logout = () => {
    localStorage.removeItem('admin_key')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-surface-950">
      {/* SIDEBAR */}
      <aside className="w-64 flex-shrink-0 bg-surface-900 border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
              <Code2 size={14} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-sm">Admin Panel</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )
              }
            >
              <item.icon size={16} />
              <span>{item.label}</span>
              {item.badge && newCount && newCount.count > 0 && (
                <span className="ml-auto bg-brand-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {newCount.count}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <NavLink to="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-brand-400 transition-all">
            <Code2 size={14} />
            Ver site público ↗
          </NavLink>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-surface-900 border-b border-white/10 flex items-center justify-between px-8 flex-shrink-0">
          <p className="text-slate-400 text-sm">Painel Administrativo</p>
          <div className="flex items-center gap-4">
            {newCount && newCount.count > 0 && (
              <NavLink to="/admin/contacts"
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors">
                <Bell size={13} />
                {newCount.count} mensagem{newCount.count > 1 ? 's' : ''} nova{newCount.count > 1 ? 's' : ''}
              </NavLink>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
