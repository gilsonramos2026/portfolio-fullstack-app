import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApiService } from '../../services/api'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import type { Experience } from '../../types'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

export default function AdminExperiences() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState<Experience | null | 'new'>(null)
  const { register, handleSubmit, reset } = useForm<Partial<Experience> & { techInput?: string }>()

  // Captura a chave de token local para validar as chamadas ao back-end Java
  const getAdminKey = () => localStorage.getItem('admin_key') || ''

  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ['admin-experiences'],
    // CORREÇÃO: Passa a chave administrativa na consulta protegida
    queryFn: () => adminApiService.getExperiences(getAdminKey()),
  })

  const open = (e: Experience | 'new') => {
    setEditing(e)
    reset(e === 'new' ? {} : { ...e, techInput: [...(e.technologies ?? [])].join(', ') })
  }
  const close = () => { setEditing(null); reset() }

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      const key = getAdminKey()
      const payload = { ...data, technologies: data.techInput?.split(',').map((t: string) => t.trim()).filter(Boolean) }
      delete payload.techInput
      
      // CORREÇÃO: Repassa o token administrativo (key) exigido nos métodos do Axios/Java
      return editing === 'new'
        ? adminApiService.createExperience(key, payload)
        : adminApiService.updateExperience(key, (editing as Experience).id, payload)
    },
    onSuccess: () => { 
      toast.success('Salvo!')
      qc.invalidateQueries({ queryKey: ['admin-experiences'] })
      close() 
    },
    onError: () => toast.error('Erro ao salvar. Verifique as credenciais.'),
  })

  const del = useMutation({
    // CORREÇÃO: Injeta a chave admin e o ID correspondente da experiência
    mutationFn: (id: number) => adminApiService.deleteExperience(getAdminKey(), id),
    onSuccess: () => { 
      toast.success('Removido!')
      qc.invalidateQueries({ queryKey: ['admin-experiences'] }) 
    },
    onError: () => toast.error('Erro ao remover.'),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Experiências</h1>
          <p className="text-slate-400 text-sm mt-1">{experiences.length} cargo(s) e histórico(s) listado(s)</p>
        </div>
        <button onClick={() => open('new')} className="btn-primary text-sm py-2 px-4"><Plus size={16} /> Nova Experiência</button>
      </div>

      {isLoading ? <div className="card-glass h-48 animate-pulse" /> : (
        <div className="card-glass overflow-hidden">
          <table className="w-full admin-table">
            <thead><tr><th>Empresa</th><th>Cargo</th><th>Período</th><th>Atual</th><th>Ações</th></tr></thead>
            <tbody>
              {experiences.map(e => (
                <tr key={e.id}>
                  <td className="font-medium text-white px-4 py-3">{e.company}</td>
                  <td className="px-4 py-3">{e.role}</td>
                  <td className="text-xs px-4 py-3 text-slate-400">{e.startedAt} → {e.current ? 'Atual' : (e.endedAt ?? '?')}</td>
                  <td className="px-4 py-3 text-center">{e.current ? '✅' : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => open(e)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" aria-label="Editar"><Pencil size={14} /></button>
                      <button onClick={() => { if (confirm('Deseja realmente remover esta experiência profissional?')) del.mutate(e.id) }} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" aria-label="Excluir"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {experiences.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-slate-600">Nenhuma experiência cadastrada.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL DE EDIÇÃO / CRIAÇÃO */}
      {editing !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-glass w-full max-w-lg max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">{editing === 'new' ? 'Nova Experiência' : 'Editar Experiência'}</h2>
              <button onClick={close} aria-label="Fechar modal"><X size={20} className="text-slate-400 hover:text-white" /></button>
            </div>
            <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="space-y-4">
              <div><label className="block text-sm text-slate-400 mb-1.5">Empresa *</label><input {...register('company', { required: true })} className="input-field" placeholder="Empresa LTDA" /></div>
              <div><label className="block text-sm text-slate-400 mb-1.5">Cargo *</label><input {...register('role', { required: true })} className="input-field" placeholder="Engenheiro de Software" /></div>
              <div><label className="block text-sm text-slate-400 mb-1.5">Descrição *</label><textarea {...register('description', { required: true })} rows={4} className="input-field resize-none" placeholder="Responsabilidades, projetos entregues, arquiteturas projetadas..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-slate-400 mb-1.5">Início *</label><input type="date" {...register('startedAt', { required: true })} className="input-field" /></div>
                <div><label className="block text-sm text-slate-400 mb-1.5">Fim</label><input type="date" {...register('endedAt')} className="input-field" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-slate-400 mb-1.5">Local</label><input {...register('location')} className="input-field" placeholder="São Paulo, Remoto..." /></div>
                <div><label className="block text-sm text-slate-400 mb-1.5">Tipo de Contrato</label>
                  <select {...register('type')} className="input-field">
                    <option value="full_time">CLT / Full-time</option>
                    <option value="part_time">Part-time</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Estágio</option>
                  </select>
                </div>
              </div>
              <div><label className="block text-sm text-slate-400 mb-1.5">Tecnologias (separadas por vírgula)</label><input {...register('techInput')} className="input-field" placeholder="Java, Spring Boot, React, PostgreSQL" /></div>
              <div className="flex items-center gap-2 pt-1"><input type="checkbox" id="cur" {...register('current')} className="accent-brand-500 w-4 h-4 rounded border-white/10 bg-white/5" /><label htmlFor="cur" className="text-sm text-slate-300 font-medium selection:bg-transparent">Emprego atual?</label></div>
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button type="submit" disabled={saveMutation.isPending} className="btn-primary flex-1 justify-center">{saveMutation.isPending ? 'Salvando...' : 'Salvar'}</button>
                <button type="button" onClick={close} className="btn-outline px-4 py-2">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
