import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApiService } from '../../services/api'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import type { Education } from '../../types'
import { Plus, Pencil, Trash2, X, GraduationCap } from 'lucide-react'

export default function AdminEducations() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState<Education | null | 'new'>(null)
  const { register, handleSubmit, reset } = useForm<Partial<Education>>()


  const { data: educations = [], isLoading } = useQuery({
    queryKey: ['admin-educations'],
    queryFn: adminApiService.getEducations, // Chamada direta e limpa como referência da função
  })

  const open = (e: Education | 'new') => { setEditing(e); reset(e === 'new' ? {} : e) }
  const close = () => { setEditing(null); reset() }

   // CORREÇÃO: Limpeza de argumentos extras na mutação de salvar/atualizar
  const save = useMutation({
    mutationFn: (data: Partial<Education>) =>
      editing === 'new'
        ? adminApiService.createEducation(data) // Passa apenas o payload 'data'
        : adminApiService.updateEducation((editing as Education).id, data), // Passa apenas o id e o payload 'data'
    onSuccess: () => { 
      toast.success('Salvo!')
      qc.invalidateQueries({ queryKey: ['admin-educations'] })
      close() 
    },
    onError: () => toast.error('Erro ao salvar.'),
  })

  // CORREÇÃO: Limpeza de argumentos extras na mutação de deletar
  const del = useMutation({
    mutationFn: adminApiService.deleteEducation, // Passa diretamente a referência do método que aceita apenas o ID
    onSuccess: () => { 
      toast.success('Removido!')
      qc.invalidateQueries({ queryKey: ['admin-educations'] }) 
    },
    onError: () => toast.error('Erro ao remover.'),
  })


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Educação</h1>
          <p className="text-slate-400 text-sm mt-1">{educations.length} formação(ões) cadastrada(s)</p>
        </div>
        <button onClick={() => open('new')} className="btn-primary text-sm py-2 px-4">
          <Plus size={16} /> Nova Formação
        </button>
      </div>

      {isLoading ? (
        <div className="card-glass h-48 animate-pulse" />
      ) : (
        <div className="space-y-4">
          {educations.map((edu) => (
            <div key={edu.id} className="card-glass p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center flex-shrink-0">
                <GraduationCap size={18} className="text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white">{edu.degree}</h3>
                <p className="text-brand-400 text-sm font-medium">{edu.institution}</p>
                {edu.fieldOfStudy && <p className="text-slate-500 text-sm mt-0.5">{edu.fieldOfStudy}</p>}
                <p className="text-slate-600 text-xs mt-1.5 flex items-center gap-1">
                  <span>{edu.startedAt}</span> 
                  <span>→</span> 
                  <span className={clsx(edu.current && 'text-brand-400 font-medium')}>{edu.current ? 'Cursando' : (edu.endedAt ?? '?')}</span>
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0 border-l border-white/5 pl-4 ml-2">
                <button onClick={() => open(edu)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" aria-label="Editar">
                  <Pencil size={14} />
                </button>
                <button onClick={() => { if (confirm('Deseja realmente remover este registro educacional?')) del.mutate(edu.id) }}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" aria-label="Remover">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {educations.length === 0 && (
            <div className="text-center py-16 text-slate-600">Nenhuma formação cadastrada.</div>
          )}
        </div>
      )}

      {/* MODAL DE EDIÇÃO / CRIAÇÃO */}
      {editing !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-glass w-full max-w-lg max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">
                {editing === 'new' ? 'Nova Formação' : 'Editar Formação'}
              </h2>
              <button onClick={close} aria-label="Fechar modal"><X size={20} className="text-slate-400 hover:text-white" /></button>
            </div>
            <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Instituição *</label>
                <input {...register('institution', { required: true })} className="input-field" placeholder="USP, FIAP, Alura..." />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Grau / Título *</label>
                <input {...register('degree', { required: true })} className="input-field" placeholder="Bacharel, Tecnólogo, MBA..." />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Área de Estudo</label>
                <input {...register('fieldOfStudy')} className="input-field" placeholder="Ciência da Computação..." />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Descrição</label>
                <textarea {...register('description')} rows={3} className="input-field resize-none" placeholder="Detalhes do curso, conquistas, projetos acadêmicos..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Início *</label>
                  <input type="date" {...register('startedAt', { required: true })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Conclusão</label>
                  <input type="date" {...register('endedAt')} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Logo / Ícone URL</label>
                <input {...register('logoUrl')} className="input-field" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Nota / Conceito</label>
                <input {...register('grade')} className="input-field" placeholder="9.5, A, Excelente..." />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="cur" {...register('current')} className="accent-brand-500 w-4 h-4 rounded border-white/10 bg-white/5" />
                <label htmlFor="cur" className="text-sm text-slate-300 font-medium selection:bg-transparent">Cursando atualmente?</label>
              </div>
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button type="submit" disabled={save.isPending} className="btn-primary flex-1 justify-center">
                  {save.isPending ? 'Salvando...' : 'Salvar'}
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
