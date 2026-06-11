import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApiService } from '../../services/api'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import type { Skill } from '../../types'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const CATEGORIES = ['frontend','backend','devops','database','tools','soft']

export default function AdminSkills() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState<Skill | null | 'new'>(null)
  const { register, handleSubmit, reset } = useForm<Partial<Skill>>()

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ['admin-skills'],
    queryFn: adminApiService.getSkills,
  })

  const grouped = skills.reduce((acc, s) => {
    acc[s.category] = [...(acc[s.category] || []), s]
    return acc
  }, {} as Record<string, Skill[]>)

  const openNew = () => { setEditing('new'); reset({}) }
  const openEdit = (s: Skill) => { setEditing(s); reset(s) }
  const close = () => { setEditing(null); reset() }

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Skill>) =>
      editing === 'new'
        ? adminApiService.createSkill(data)
        : adminApiService.updateSkill((editing as Skill).id, data),
    onSuccess: () => { toast.success('Skill salva!'); qc.invalidateQueries({ queryKey: ['admin-skills'] }); close() },
    onError: () => toast.error('Erro ao salvar.'),
  })

  const deleteMutation = useMutation({
    mutationFn: adminApiService.deleteSkill,
    onSuccess: () => { toast.success('Skill removida!'); qc.invalidateQueries({ queryKey: ['admin-skills'] }) },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Skills</h1>
          <p className="text-slate-400 text-sm mt-1">{skills.length} habilidade(s)</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm py-2 px-4">
          <Plus size={16} /> Nova Skill
        </button>
      </div>

      {isLoading ? <div className="card-glass h-48 animate-pulse" /> : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, catSkills]) => (
            <div key={category} className="card-glass overflow-hidden">
              <div className="px-6 py-3 border-b border-white/10 bg-white/3">
                <h3 className="font-semibold text-white text-sm capitalize">{category}</h3>
              </div>
              <table className="w-full admin-table">
                <thead><tr><th>Nome</th><th>Proficiência</th><th>Ícone</th><th>Ordem</th><th>Ações</th></tr></thead>
                <tbody>
                  {catSkills.map(s => (
                    <tr key={s.id}>
                      <td className="font-medium text-white">{s.name}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-white/10 w-24">
                            <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                              style={{ width: `${s.proficiency}%` }} />
                          </div>
                          <span className="text-xs text-slate-500">{s.proficiency}%</span>
                        </div>
                      </td>
                      <td className="text-slate-500 text-sm">{s.iconName ?? '—'}</td>
                      <td>{s.sortOrder}</td>
                      <td>
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(s)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"><Pencil size={14} /></button>
                          <button onClick={() => { if (confirm('Remover?')) deleteMutation.mutate(s.id) }}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {editing !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-glass w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">
                {editing === 'new' ? 'Nova Skill' : 'Editar Skill'}
              </h2>
              <button onClick={close}><X size={20} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Nome *</label>
                <input {...register('name', { required: true })} className="input-field" placeholder="React" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Categoria *</label>
                <select {...register('category', { required: true })} className="input-field">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Proficiência (1–100) *</label>
                <input type="number" min={1} max={100} {...register('proficiency', { required: true, valueAsNumber: true })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Nome do ícone (devicon)</label>
                <input {...register('iconName')} className="input-field" placeholder="react, typescript..." />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Ordem</label>
                <input type="number" {...register('sortOrder', { valueAsNumber: true })} className="input-field" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saveMutation.isPending} className="btn-primary flex-1 justify-center">
                  {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
                </button>
                <button type="button" onClick={close} className="btn-outline px-4 py-2">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
