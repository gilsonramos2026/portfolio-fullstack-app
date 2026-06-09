import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApiService } from '../../services/api'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import type { Skill } from '../../types'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import clsx from 'clsx'

const CATEGORIES = ['frontend', 'backend', 'devops', 'database', 'tools', 'soft']

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Front-end',
  backend: 'Back-end',
  devops: 'DevOps / Infra',
  database: 'Banco de Dados',
  tools: 'Ferramentas / Ferramental',
  soft: 'Soft Skills'
}

export default function AdminSkills() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState<Skill | null | 'new'>(null)
  const { register, handleSubmit, reset } = useForm<Partial<Skill>>()

  // Captura a chave de token local para validar as chamadas ao back-end Java
  const getAdminKey = () => localStorage.getItem('admin_key') || ''

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ['admin-skills'],
    // CORREÇÃO: Passa a chave administrativa na consulta protegida
    queryFn: () => adminApiService.getSkills(getAdminKey()),
  })

  const grouped = skills.reduce((acc, s) => {
    acc[s.category] = [...(acc[s.category] || []), s]
    return acc
  }, {} as Record<string, Skill[]>)

  const openNew = () => { setEditing('new'); reset({ category: 'frontend', proficiency: 80, sortOrder: 0 }) }
  const openEdit = (s: Skill) => { setEditing(s); reset(s) }
  const close = () => { setEditing(null); reset() }

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Skill>) => {
      const key = getAdminKey()
      // CORREÇÃO: Repassa o token administrativo (key) exigido nos métodos do Axios/Java
      return editing === 'new'
        ? adminApiService.createSkill(key, data)
        : adminApiService.updateSkill(key, (editing as Skill).id, data)
    },
    onSuccess: () => { 
      toast.success('Skill salva!')
      qc.invalidateQueries({ queryKey: ['admin-skills'] })
      close() 
    },
    onError: () => toast.error('Erro ao salvar. Verifique as credenciais.'),
  })

  const deleteMutation = useMutation({
    // CORREÇÃO: Injeta a chave admin e o ID correspondente da skill
    mutationFn: (id: number) => adminApiService.deleteSkill(getAdminKey(), id),
    onSuccess: () => { 
      toast.success('Skill removida!')
      qc.invalidateQueries({ queryKey: ['admin-skills'] }) 
    },
    onError: () => toast.error('Erro ao remover.'),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Skills</h1>
          <p className="text-slate-400 text-sm mt-1">{skills.length} habilidade(s) cadastrada(s)</p>
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
                <h3 className="font-semibold text-white text-sm font-display tracking-wide">
                  {CATEGORY_LABELS[category] ?? category.toUpperCase()}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full admin-table">
                  <thead>
                    <tr>
                      <th className="px-6 py-3">Nome</th>
                      <th className="px-6 py-3">Proficiência</th>
                      <th className="px-6 py-3">Ícone</th>
                      <th className="px-6 py-3">Ordem</th>
                      <th className="px-6 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catSkills.map(s => (
                      <tr key={s.id}>
                        <td className="font-medium text-white px-6 py-3.5">{s.name}</td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                              <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                                style={{ width: `${s.proficiency}%` }} />
                            </div>
                            <span className="text-xs text-slate-400 font-semibold">{s.proficiency}%</span>
                          </div>
                        </td>
                        <td className="text-slate-400 text-xs px-6 py-3.5">{s.iconName ?? '—'}</td>
                        <td className="text-sm px-6 py-3.5 text-slate-400">{s.sortOrder}</td>
                        <td className="px-6 py-3.5">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(s)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" aria-label="Editar"><Pencil size={14} /></button>
                            <button onClick={() => { if (confirm('Deseja realmente remover esta habilidade do portfólio?')) deleteMutation.mutate(s.id) }}
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" aria-label="Excluir"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          {skills.length === 0 && (
            <div className="text-center py-16 card-glass text-slate-600">Nenhuma habilidade técnica listada ainda.</div>
          )}
        </div>
      )}

      {/* MODAL DE EDIÇÃO / CRIAÇÃO */}
      {editing !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-glass w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">
                {editing === 'new' ? 'Nova Skill' : 'Editar Skill'}
              </h2>
              <button onClick={close} aria-label="Fechar modal"><X size={20} className="text-slate-400 hover:text-white transition-colors" /></button>
            </div>
            <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Nome da Tecnologia *</label>
                <input {...register('name', { required: true })} className="input-field" placeholder="React, Java, Docker..." />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Categoria *</label>
                <select {...register('category', { required: true })} className="input-field">
                  {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c] ?? c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Proficiência (1–100) *</label>
                <input type="number" min={1} max={100} {...register('proficiency', { required: true, valueAsNumber: true })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Nome do Ícone (React Icons / Devicon)</label>
                <input {...register('iconName')} className="input-field" placeholder="react, typescript, nodejs..." />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Ordem de Exibição</label>
                <input type="number" {...register('sortOrder', { valueAsNumber: true })} className="input-field" placeholder="0" />
              </div>
              <div className="flex gap-3 pt-4 border-t border-white/5">
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
