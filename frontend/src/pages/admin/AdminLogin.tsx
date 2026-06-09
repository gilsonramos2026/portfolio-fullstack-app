import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApiService } from '../../services/api'
import { Code2, Lock, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const [key, setKey] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
        try {
      localStorage.setItem('admin_key', key)
      // Test o token administrativo
      await adminApiService.countNewContacts()
      navigate('/admin')
    } catch {
      // SOLUÇÃO: Removido o '(err)' que o ESLint estava acusando como não utilizado!
      localStorage.removeItem('admin_key')
      setError('Chave inválida. Verifique e tente novamente.')
    } finally {
      setLoading(false)
    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-surface-950">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 mb-4">
            <Code2 size={28} className="text-brand-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-slate-500 text-sm mt-1">Portfólio Profissional</p>
        </div>

        <form onSubmit={handleLogin} className="card-glass p-8 space-y-5">
          <div>
            <label className="block text-sm text-slate-400 mb-2 flex items-center gap-1.5 selection:bg-transparent">
              <Lock size={13} /> Chave de Acesso
            </label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="Digite sua chave admin..."
                className="input-field pr-10"
                required
              />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                aria-label={show ? "Ocultar chave" : "Mostrar chave"}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm animate-in">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? 'Verificando...' : 'Entrar'}
          </button>

          <p className="text-center text-xs text-slate-600">
            Configure a chave em <code className="text-slate-500">secret-key</code> no seu application.yml do backend.
          </p>
        </form>
      </div>
    </div>
  )
}

