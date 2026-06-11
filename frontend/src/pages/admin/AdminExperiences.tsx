// AdminExperiences.tsx
import { useState } from 'react'
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

  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ['admin-experiences'],
    queryFn: adminApiService.getExperiences,
  })

  const open = (e: Experience | 'new') => {
    setEditing(e)
    reset(e === 'new' ? {} : { ...e, techInput: [...(e.technologies ?? [])].join(', ') })
  }
  const close = () => { setEditing(null); reset() }

  // Se o seu tipo Experience já existe, usamos ele:
const saveMutation = useMutation({
  mutationFn: (data: Partial<Experience> & { techInput?: string }) => {
    // Agora o TypeScript sabe exatamente o que está entrando
    const payload = { 
      ...data, 
      technologies: data.techInput?.split(',').map((t: string) => t.trim()).filter(Boolean) 
    }
    delete payload.techInput
    
    return editing === 'new'
      ? adminApiService.createExperience(payload as Experience)
      : adminApiService.updateExperience((editing as Experience).id, payload as Experience)
  },
  onSuccess: () => { 
    toast.success('Salvo!'); 
    qc.invalidateQueries({ queryKey: ['admin-experiences'] }); 
    close(); 
  },
  onError: () => toast.error('Erro ao salvar.'),
})

  const del = useMutation({
    mutationFn: adminApiService.deleteExperience,
    onSuccess: () => { toast.success('Removido!'); qc.invalidateQueries({ queryKey: ['admin-experiences'] }) },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Experiências</h1>
        <button onClick={() => open('new')} className="btn-primary text-sm py-2 px-4"><Plus size={16} /> Nova</button>
      </div>

      {isLoading ? <div className="card-glass h-48 animate-pulse" /> : (
        <div className="card-glass overflow-hidden">
          <table className="w-full admin-table">
            <thead><tr><th>Empresa</th><th>Cargo</th><th>Período</th><th>Atual</th><th>Ações</th></tr></thead>
            <tbody>
              {experiences.map(e => (
                <tr key={e.id}>
                  <td className="font-medium text-white">{e.company}</td>
                  <td>{e.role}</td>
                  <td className="text-xs">{e.startedAt} → {e.current ? 'Atual' : (e.endedAt ?? '?')}</td>
                  <td>{e.current ? '✅' : '—'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => open(e)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"><Pencil size={14} /></button>
                      <button onClick={() => { if (confirm('Remover?')) del.mutate(e.id) }} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {experiences.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-slate-600">Nenhuma experiência cadastrada.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {editing !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-glass w-full max-w-lg max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">{editing === 'new' ? 'Nova Experiência' : 'Editar Experiência'}</h2>
              <button onClick={close}><X size={20} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="space-y-4">
              <div><label className="block text-sm text-slate-400 mb-1">Empresa *</label><input {...register('company', { required: true })} className="input-field" /></div>
              <div><label className="block text-sm text-slate-400 mb-1">Cargo *</label><input {...register('role', { required: true })} className="input-field" /></div>
              <div><label className="block text-sm text-slate-400 mb-1">Descrição *</label><textarea {...register('description', { required: true })} rows={3} className="input-field resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-slate-400 mb-1">Início *</label><input type="date" {...register('startedAt', { required: true })} className="input-field" /></div>
                <div><label className="block text-sm text-slate-400 mb-1">Fim</label><input type="date" {...register('endedAt')} className="input-field" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-slate-400 mb-1">Local</label><input {...register('location')} className="input-field" /></div>
                <div><label className="block text-sm text-slate-400 mb-1">Tipo</label>
                  <select {...register('type')} className="input-field">
                    <option value="full_time">CLT / Full-time</option>
                    <option value="part_time">Part-time</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Estágio</option>
                  </select>
                </div>
              </div>
              <div><label className="block text-sm text-slate-400 mb-1">Tecnologias (separadas por vírgula)</label><input {...register('techInput')} className="input-field" placeholder="Java, Spring Boot, React" /></div>
              <div className="flex items-center gap-2"><input type="checkbox" id="cur" {...register('current')} className="accent-brand-500" /><label htmlFor="cur" className="text-sm text-slate-300">Emprego atual?</label></div>
              <div className="flex gap-3 pt-2">
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
