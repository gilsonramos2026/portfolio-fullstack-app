import React, { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApiService, publicApi } from '../../services/api'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import type { Profile } from '../../types'
import { Save, User } from 'lucide-react'
// SOLUÇÃO: 'clsx' removido completamente do topo para satisfazer o ESLint!

export default function AdminProfile() {
  const qc = useQueryClient()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: publicApi.getProfile,
  })

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<Partial<Profile>>()

  useEffect(() => {
    if (profile) reset(profile)
  }, [profile, reset])

  const save = useMutation({
    // CORREÇÃO: Chamada limpa sem o argumento 'key' redundante, já que o Axios faz isso sozinho pelo interceptor!
    mutationFn: (data: Partial<Profile>) => adminApiService.updateProfile(data),
    onSuccess: () => {
      toast.success('Perfil atualizado!')
      qc.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: () => toast.error('Erro ao salvar. Verifique sua conexão.'),
  })

  if (isLoading) return <div className="card-glass h-64 animate-pulse rounded-2xl" />

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Editar Perfil</h1>
        <p className="text-slate-400 text-sm mt-1">Dados exibidos no portfólio público</p>
      </div>

      <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-6">
        <div className="card-glass p-6 space-y-4">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <User size={16} className="text-brand-400" /> Identidade
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Nome completo *</label>
              <input {...register('name', { required: true })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Título profissional *</label>
              <input {...register('title', { required: true })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Tagline</label>
            <input {...register('tagline')} className="input-field" placeholder="Frase de impacto profissional" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Bio *</label>
            <textarea {...register('bio', { required: true })} rows={5} className="input-field resize-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Anos de experiência</label>
              <input type="number" min={0} max={60} {...register('yearsExp', { valueAsNumber: true })} className="input-field" />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="available" {...register('available')} className="w-4 h-4 accent-brand-500 rounded border-white/10 bg-white/5" />
              <label htmlFor="available" className="text-sm text-slate-300 font-medium select-none">Disponível para projetos</label>
            </div>
          </div>
        </div>

        <div className="card-glass p-6 space-y-4">
          <h2 className="font-semibold text-white">Contato</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">E-mail *</label>
              <input type="email" {...register('email', { required: true })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Telefone</label>
              <input {...register('phone')} className="input-field" placeholder="+55 11 99999-9999" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Localização</label>
            <input {...register('location')} className="input-field" placeholder="São Paulo, SP - Brasil" />
          </div>
        </div>

        <div className="card-glass p-6 space-y-4">
          <h2 className="font-semibold text-white">Links e Mídias</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">URL do Avatar</label>
              <input {...register('avatarUrl')} className="input-field" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">URL do Currículo (PDF)</label>
              <input {...register('resumeUrl')} className="input-field" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">GitHub</label>
              <input {...register('githubUrl')} className="input-field" placeholder="https://github.com..." />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">LinkedIn</label>
              <input {...register('linkedinUrl')} className="input-field" placeholder="https://linkedin.com..." />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Twitter / X</label>
              <input {...register('twitterUrl')} className="input-field" placeholder="https://x.com..." />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Website pessoal</label>
              <input {...register('websiteUrl')} className="input-field" placeholder="https://..." />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={save.isPending} className="btn-primary">
            <Save size={16} />
            {save.isPending ? 'Salvando...' : 'Salvar alterações'}
          </button>
          {isDirty && (
            <button type="button" onClick={() => reset(profile ?? {})} className="btn-outline">
              Descartar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
