import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApiService } from '../../services/api'
import toast from 'react-hot-toast'
import type { Contact } from '../../types'
import { Mail, Clock, X } from 'lucide-react'
import clsx from 'clsx'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:     { label: 'Nova',      color: 'text-brand-400 bg-brand-500/15 border-brand-500/25' },
  read:    { label: 'Lida',      color: 'text-slate-400 bg-white/5 border-white/10' },
  replied: { label: 'Respondida', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/25' },
  archived:{ label: 'Arquivada', color: 'text-slate-600 bg-white/3 border-white/5' },
}

export default function AdminContacts() {
  const qc = useQueryClient()
  const [filter, setFilter] = useState<string | undefined>(undefined)
  const [selected, setSelected] = useState<Contact | null>(null)



  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['admin-contacts', filter],
    // CORREÇÃO: Passa a chave admin no contrato do método getContacts()
    queryFn: () => adminApiService.getContacts(filter),
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      // CORREÇÃO: Passa a chave admin no contrato de atualização de status do Java
      adminApiService.updateContactStatus( id, status),
    onSuccess: () => {
      toast.success('Status atualizado!')
      qc.invalidateQueries({ queryKey: ['admin-contacts'] })
      qc.invalidateQueries({ queryKey: ['contacts-count'] })
    },
    onError: () => toast.error('Erro ao atualizar status.'),
  })

  const filters = ['new', 'read', 'replied', 'archived']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Mensagens de Contato</h1>
        <p className="text-slate-400 text-sm mt-1">{contacts.length} mensagem(ns)</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter(undefined)}
          className={clsx('px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
            !filter ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white bg-white/5')}>
          Todas
        </button>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={clsx('px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              filter === f ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white bg-white/5')}>
            {STATUS_LABELS[f].label}
          </button>
        ))}
      </div>

      {isLoading ? <div className="card-glass h-48 animate-pulse" /> : (
        <div className="space-y-3">
          {contacts.map(c => (
            <div key={c.id}
              className={clsx('card-glass p-5 cursor-pointer hover:border-brand-500/40',
                c.status === 'new' && 'border-brand-500/20')}
              onClick={() => { setSelected(c); if (c.status === 'new') updateStatus.mutate({ id: c.id, status: 'read' }) }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={clsx('w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm',
                    c.status === 'new' ? 'bg-brand-500/20 text-brand-400' : 'bg-white/5 text-slate-400')}>
                    {c.name ? c.name[0] : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{c.name}</span>
                      {c.status === 'new' && <span className="w-2 h-2 rounded-full bg-brand-400" />}
                    </div>
                    <p className="text-slate-500 text-xs">{c.email}</p>
                    <p className="text-slate-400 text-sm mt-1 truncate">{c.subject ?? c.message.slice(0, 80)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={clsx('text-xs px-2 py-0.5 rounded-full border', STATUS_LABELS[c.status ?? 'new'].color)}>
                    {STATUS_LABELS[c.status ?? 'new'].label}
                  </span>
                  <span className="text-slate-600 text-xs flex items-center gap-1">
                    <Clock size={10} />
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString('pt-BR') : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {contacts.length === 0 && (
            <div className="text-center py-16 text-slate-600">Nenhuma mensagem{filter ? ' com esse filtro' : ''}.</div>
          )}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-glass w-full max-w-xl p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-white">{selected.name}</h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><Mail size={13} />{selected.email}</span>
                  {selected.phone && <span>{selected.phone}</span>}
                </div>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Fechar"><X size={20} className="text-slate-400 hover:text-white" /></button>
            </div>

            {selected.subject && (
              <div>
                <p className="text-xs text-slate-500 mb-1">Assunto</p>
                <p className="text-white font-medium">{selected.subject}</p>
              </div>
            )}

            <div>
              <p className="text-xs text-slate-500 mb-1">Mensagem</p>
              <div className="bg-white/5 rounded-xl p-4 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-2">Alterar status</p>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(STATUS_LABELS).map(([status, info]) => (
                  <button key={status}
                    onClick={() => { updateStatus.mutate({ id: selected.id, status }); setSelected({ ...selected, status }) }}
                    className={clsx('text-xs px-3 py-1.5 rounded-lg border font-medium transition-all',
                      selected.status === status ? info.color : 'text-slate-500 border-white/10 hover:border-white/20')}>
                    {info.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/5">
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject ?? ''}`}
                className="btn-primary text-sm py-2 px-4 flex items-center justify-center gap-2 flex-1">
                <Mail size={14} /> Responder por E-mail
              </a>
              <button onClick={() => setSelected(null)} className="btn-outline text-sm py-2 px-4">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
