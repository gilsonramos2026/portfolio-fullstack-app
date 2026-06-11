import { Outlet, NavLink, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { publicApi } from '../../services/api'
import { Menu, X, Github, Linkedin, Mail, Code2 } from 'lucide-react'
import clsx from 'clsx'

export default function PublicLayout() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: publicApi.getProfile,
  })

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { to: '/', label: 'Início' },
    { to: '/projects', label: 'Projetos' },
    { to: '/about', label: 'Sobre' },
    { to: '/contact', label: 'Contato' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      <header
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-surface-900/90 backdrop-blur-md border-b border-white/10 shadow-xl'
            : 'bg-transparent'
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center group-hover:bg-brand-400 transition-colors">
              <Code2 size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">
              {profile?.name?.split(' ')[0] ?? 'Dev'}
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  clsx('nav-link text-sm pb-1', isActive && 'text-white after:w-full')
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Social + CTA */}
          <div className="hidden md:flex items-center gap-3">
            {profile?.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noreferrer"
                className="p-2 text-slate-400 hover:text-white transition-colors">
                <Github size={18} />
              </a>
            )}
            {profile?.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer"
                className="p-2 text-slate-400 hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
            )}
            <Link to="/contact" className="btn-primary text-sm py-2 px-4">
              <Mail size={15} />
              Falar comigo
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-surface-900/95 backdrop-blur-md border-b border-white/10 px-6 py-4 flex flex-col gap-3">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  clsx('text-sm font-medium py-2', isActive ? 'text-white' : 'text-slate-400')
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} {profile?.name ?? 'Portfólio'} · Feito com ☕ e muito código
          </div>
          <div className="flex items-center gap-4">
            {profile?.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noreferrer"
                className="text-slate-500 hover:text-white transition-colors"><Github size={18} /></a>
            )}
            {profile?.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer"
                className="text-slate-500 hover:text-white transition-colors"><Linkedin size={18} /></a>
            )}
            {profile?.email && (
              <a href={`mailto:${profile.email}`}
                className="text-slate-500 hover:text-white transition-colors"><Mail size={18} /></a>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
