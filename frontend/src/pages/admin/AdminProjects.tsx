import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApiService } from '../../services/api'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import type { Project } from '../../types'
import { Plus, Pencil, Trash2, X, Github, ExternalLink } from 'lucide-react'

type FormData = Partial<Project> & { tagsInput?: string }

export default function AdminProjects() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState<Project | null | 'new'>(null)

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: adminApiService.getProjects,
  })

  const { register, handleSubmit, reset } = useForm<FormData>()

  const openNew = () => {
    setEditing('new')
    reset({})
  }

  const openEdit = (p: Project) => {
    setEditing(p)
    reset({ ...p, tagsInput: p.tags?.join(', ') })
  }

  const closeForm = () => { setEditing(null); reset() }

  const saveMutation = useMutation({
    mutationFn: (data: FormData) => {
      const payload = { ...data, tags: data.tagsInput?.split(',').map(t => t.trim()).filter(Boolean) }
      delete payload.tagsInput
      return editing === 'new'
        ? adminApiService.createProject(payload)
        : adminApiService.updateProject((editing as Project).id, payload)
    },
    onSuccess: () => {
      toast.success('Projeto salvo!')
      qc.invalidateQueries({ queryKey: ['admin-projects'] })
      closeForm()
    },
    onError: () => toast.error('Erro ao salvar.'),
  })

  const deleteMutation = useMutation({
    mutationFn: adminApiService.deleteProject,
    onSuccess: () => {
      toast.success('Projeto removido!')
      qc.invalidateQueries({ queryKey: ['admin-projects'] })
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Projetos</h1>
          <p className="text-slate-400 text-sm mt-1">{projects.length} projeto(s) cadastrado(s)</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm py-2 px-4">
          <Plus size={16} /> Novo Projeto
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="card-glass h-48 animate-pulse" />
      ) : (
        <div className="card-glass overflow-hidden">
          <table className="w-full admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Status</th>
                <th>Destaque</th>
                <th>Tags</th>
                <th>Links</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id}>
                  <td className="font-medium text-white">{p.title}</td>
                  <td>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      p.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' :
                      p.status === 'in_progress' ? 'bg-amber-500/15 text-amber-400' :
                      'bg-slate-500/15 text-slate-400'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>{p.featured ? '⭐' : '—'}</td>
                  <td className="text-xs text-slate-500">{p.tags?.slice(0, 3).join(', ')}</td>
                  <td>
                    <div className="flex gap-2">
                      {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white"><Github size={14} /></a>}
                      {p.demoUrl && <a href={p.demoUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-brand-400"><ExternalLink size={14} /></a>}
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => { if (confirm('Remover projeto?')) deleteMutation.mutate(p.id) }}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-slate-600">Nenhum projeto. Crie o primeiro!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {editing !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-glass w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">
                {editing === 'new' ? 'Novo Projeto' : 'Editar Projeto'}
              </h2>
              <button onClick={closeForm} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Título *</label>
                <input {...register('title', { required: true })} className="input-field" placeholder="Nome do projeto" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Descrição curta *</label>
                <input {...register('shortDesc', { required: true })} className="input-field" placeholder="Resumo em 1 frase" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Descrição completa *</label>
                <textarea {...register('description', { required: true })} rows={4} className="input-field resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">URL Thumbnail</label>
                  <input {...register('thumbnailUrl')} className="input-field" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">URL Demo</label>
                  <input {...register('demoUrl')} className="input-field" placeholder="https://..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">GitHub URL</label>
                  <input {...register('githubUrl')} className="input-field" placeholder="https://github.com/..." />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Status</label>
                  <select {...register('status')} className="input-field">
                    <option value="completed">Concluído</option>
                    <option value="in_progress">Em andamento</option>
                    <option value="archived">Arquivado</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Início</label>
                  <input type="date" {...register('startedAt')} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Término</label>
                  <input type="date" {...register('finishedAt')} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Tags (separadas por vírgula)</label>
                <input {...register('tagsInput')} className="input-field" placeholder="React, TypeScript, Spring Boot" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="featured" {...register('featured')} className="w-4 h-4 accent-brand-500" />
                <label htmlFor="featured" className="text-sm text-slate-300">Projeto em destaque?</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saveMutation.isPending} className="btn-primary flex-1 justify-center">
                  {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
                </button>
                <button type="button" onClick={closeForm} className="btn-outline px-4 py-2">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
