import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApiService } from '../../services/api'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import type { Testimonial } from '../../types'
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react'
import clsx from 'clsx'

export default function AdminTestimonials() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState<Testimonial | null | 'new'>(null)
  const { register, handleSubmit, reset } = useForm<Partial<Testimonial>>()

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: adminApiService.getTestimonials,
  })

  const open = (t: Testimonial | 'new') => { setEditing(t); reset(t === 'new' ? { rating: 5 } : t) }
  const close = () => { setEditing(null); reset() }

  const save = useMutation({
    mutationFn: (data: Partial<Testimonial>) =>
      editing === 'new'
        ? adminApiService.createTestimonial(data)
        : adminApiService.updateTestimonial((editing as Testimonial).id, data),
    onSuccess: () => { toast.success('Salvo!'); qc.invalidateQueries({ queryKey: ['admin-testimonials'] }); close() },
    onError: () => toast.error('Erro ao salvar.'),
  })

  const del = useMutation({
    mutationFn: adminApiService.deleteTestimonial,
    onSuccess: () => { toast.success('Removido!'); qc.invalidateQueries({ queryKey: ['admin-testimonials'] }) },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Testemunhos</h1>
          <p className="text-slate-400 text-sm mt-1">{testimonials.length} depoimento(s)</p>
        </div>
        <button onClick={() => open('new')} className="btn-primary text-sm py-2 px-4">
          <Plus size={16} /> Novo Testemunho
        </button>
      </div>

      {isLoading ? (
        <div className="card-glass h-48 animate-pulse" />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className={clsx('card-glass p-5 space-y-3', t.featured && 'border-brand-500/30')}>
              {t.featured && (
                <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-semibold">
                  <Star size={11} className="fill-amber-400" /> Destaque
                </span>
              )}
              <p className="text-slate-300 text-sm italic leading-relaxed">"{t.content}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-xs flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}{t.company ? ` · ${t.company}` : ''}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => open(t)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => { if (confirm('Remover?')) del.mutate(t.id) }}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {testimonials.length === 0 && (
            <div className="col-span-2 text-center py-16 text-slate-600">Nenhum testemunho cadastrado.</div>
          )}
        </div>
      )}

      {editing !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-glass w-full max-w-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">
                {editing === 'new' ? 'Novo Testemunho' : 'Editar Testemunho'}
              </h2>
              <button onClick={close}><X size={20} className="text-slate-400 hover:text-white" /></button>
            </div>
            <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Nome *</label>
                  <input {...register('name', { required: true })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Cargo *</label>
                  <input {...register('role', { required: true })} className="input-field" placeholder="CTO, Dev Sênior..." />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Empresa</label>
                <input {...register('company')} className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Depoimento *</label>
                <textarea {...register('content', { required: true })} rows={4} className="input-field resize-none"
                  placeholder="O que a pessoa disse sobre você..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">URL do Avatar</label>
                  <input {...register('avatarUrl')} className="input-field" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Avaliação (1-5)</label>
                  <select {...register('rating', { valueAsNumber: true })} className="input-field">
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} estrela{n>1?'s':''}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="feat" {...register('featured')} className="accent-brand-500" />
                  <label htmlFor="feat" className="text-sm text-slate-300">Mostrar em destaque?</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="actv" {...register('active')} defaultChecked className="accent-brand-500" />
                  <label htmlFor="actv" className="text-sm text-slate-300">Ativo?</label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
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
