import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { publicApi } from '../../services/api'
import toast from 'react-hot-toast'
import type { ContactForm } from '../../types'
import { Mail, Phone, MapPin, Github, Linkedin, Send, Loader2 } from 'lucide-react'

export default function ContactPage() {
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: publicApi.getProfile })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>()

  const mutation = useMutation({
    mutationFn: publicApi.sendContact,
    onSuccess: () => {
      toast.success('Mensagem enviada! Responderei em breve 🚀')
      reset()
    },
    onError: () => toast.error('Erro ao enviar mensagem. Tente novamente.'),
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="mb-12">
        <h1 className="section-title">Entre em Contato</h1>
        <p className="section-subtitle">Vamos conversar sobre seu próximo projeto</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        {/* Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card-glass p-6 space-y-5">
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/25 transition-colors">
                  <Mail size={18} className="text-brand-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">E-mail</p>
                  <p className="text-slate-200 text-sm group-hover:text-brand-300 transition-colors">{profile.email}</p>
                </div>
              </a>
            )}
            {profile?.phone && (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-brand-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Telefone</p>
                  <p className="text-slate-200 text-sm">{profile.phone}</p>
                </div>
              </div>
            )}
            {profile?.location && (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-brand-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Localização</p>
                  <p className="text-slate-200 text-sm">{profile.location}</p>
                </div>
              </div>
            )}
          </div>

          <div className="card-glass p-6 space-y-3">
            <p className="text-slate-400 text-sm font-medium">Redes Sociais</p>
            {profile?.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-colors">
                <Github size={17} /> GitHub
              </a>
            )}
            {profile?.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-colors">
                <Linkedin size={17} /> LinkedIn
              </a>
            )}
          </div>

          {profile?.available && (
            <div className="card-glass p-5 border-emerald-500/25">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-sm font-semibold">Disponível para projetos</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Estou disponível para trabalhos freelance, projetos de longo prazo e oportunidades CLT/PJ.
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
          <div className="card-glass p-8">
            <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Nome *</label>
                  <input
                    {...register('name', { required: 'Nome obrigatório' })}
                    placeholder="Seu nome"
                    className="input-field"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">E-mail *</label>
                  <input
                    type="email"
                    {...register('email', { required: 'E-mail obrigatório' })}
                    placeholder="seu@email.com"
                    className="input-field"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Assunto</label>
                  <input
                    {...register('subject')}
                    placeholder="Sobre o projeto..."
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Telefone</label>
                  <input
                    {...register('phone')}
                    placeholder="+55 11 99999-9999"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Mensagem *</label>
                <textarea
                  {...register('message', { required: 'Mensagem obrigatória', minLength: { value: 10, message: 'Mínimo 10 caracteres' } })}
                  placeholder="Conte sobre seu projeto, prazo, orçamento..."
                  rows={6}
                  className="input-field resize-none"
                />
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="btn-primary w-full justify-center"
              >
                {mutation.isPending ? (
                  <><Loader2 size={16} className="animate-spin" /> Enviando...</>
                ) : (
                  <><Send size={16} /> Enviar mensagem</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
