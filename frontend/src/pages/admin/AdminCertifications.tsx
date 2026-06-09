import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApiService } from '../../services/api'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import type { Certification } from '../../types'
import { Plus, Pencil, Trash2, X, Award } from 'lucide-react'

export default function AdminCertifications() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState<Certification | null | 'new'>(null)
  const { register, handleSubmit, reset } = useForm<Partial<Certification>>()

  const { data: certs = [], isLoading } = useQuery({
    queryKey: ['admin-certs'],
    queryFn: adminApiService.getCertifications,
  })

  const open = (c: Certification | 'new') => { setEditing(c); reset(c === 'new' ? {} : c) }
  const close = () => { setEditing(null); reset() }

  const save = useMutation({
    mutationFn: (data: Partial<Certification>) =>
      editing === 'new'
        ? adminApiService.createCertification(data)
        : adminApiService.updateCertification((editing as Certification).id, data),
    onSuccess: () => { toast.success('Salvo!'); qc.invalidateQueries({ queryKey: ['admin-certs'] }); close() },
    onError: () => toast.error('Erro ao salvar.'),
  })

  const del = useMutation({
    mutationFn: adminApiService.deleteCertification,
    onSuccess: () => { toast.success('Removida!'); qc.invalidateQueries({ queryKey: ['admin-certs'] }) },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Certificações</h1>
        <button onClick={() => open('new')} className="btn-primary text-sm py-2 px-4"><Plus size={16} /> Nova</button>
      </div>

      {isLoading ? <div className="card-glass h-48 animate-pulse" /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map((c) => (
            <div key={c.id} className="card-glass p-5 space-y-3">
              <div className="flex items-start gap-3">
                <Award size={18} className="text-brand-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm leading-snug">{c.name}</h3>
                  <p className="text-brand-400/80 text-xs mt-0.5">{c.issuer}</p>
                  <p className="text-slate-500 text-xs">{c.issuedAt}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => open(c)} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"><Pencil size={14} /></button>
                <button onClick={() => { if (confirm('Remover?')) del.mutate(c.id) }} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {certs.length === 0 && (
            <div className="col-span-3 text-center py-16 text-slate-600">Nenhuma certificação cadastrada.</div>
          )}
        </div>
      )}

      {editing !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-glass w-full max-w-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">{editing === 'new' ? 'Nova Certificação' : 'Editar Certificação'}</h2>
              <button onClick={close}><X size={20} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-4">
              <div><label className="block text-sm text-slate-400 mb-1">Nome *</label><input {...register('name', { required: true })} className="input-field" placeholder="AWS Certified Developer" /></div>
              <div><label className="block text-sm text-slate-400 mb-1">Emissor *</label><input {...register('issuer', { required: true })} className="input-field" placeholder="Amazon Web Services" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-slate-400 mb-1">Data de Emissão *</label><input type="date" {...register('issuedAt', { required: true })} className="input-field" /></div>
                <div><label className="block text-sm text-slate-400 mb-1">Data de Expiração</label><input type="date" {...register('expiresAt')} className="input-field" /></div>
              </div>
              <div><label className="block text-sm text-slate-400 mb-1">ID da Credencial</label><input {...register('credentialId')} className="input-field" /></div>
              <div><label className="block text-sm text-slate-400 mb-1">URL da Credencial</label><input {...register('credentialUrl')} className="input-field" placeholder="https://..." /></div>
              <div><label className="block text-sm text-slate-400 mb-1">URL da Imagem/Badge</label><input {...register('imageUrl')} className="input-field" placeholder="https://..." /></div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={save.isPending} className="btn-primary flex-1 justify-center">{save.isPending ? 'Salvando...' : 'Salvar'}</button>
                <button type="button" onClick={close} className="btn-outline px-4 py-2">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
