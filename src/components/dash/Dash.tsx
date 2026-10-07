import { useCallback, useEffect, useState } from 'react'
import { dashApi } from '@/lib/dash-api'
import { DashLeads } from '@/components/dash/DashLeads'
import { DashLogin } from '@/components/dash/DashLogin'

/** /dash — painel interno de inscrições (uso da agência e do cliente) */
export function Dash() {
  const [state, setState] = useState<'checking' | 'login' | 'in'>('checking')
  const [notice, setNotice] = useState<string>()

  useEffect(() => {
    dashApi
      .me()
      .then(() => setState('in'))
      .catch(() => setState('login'))
  }, [])

  const handleLogout = useCallback((message?: string) => {
    setNotice(message)
    setState('login')
  }, [])

  if (state === 'checking') return <div className="min-h-svh" aria-busy="true" />
  if (state === 'login') return <DashLogin notice={notice} onSuccess={() => setState('in')} />
  return <DashLeads onLogout={handleLogout} />
}
