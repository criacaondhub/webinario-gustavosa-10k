import { useState, type FormEvent } from 'react'
import { TbAlertCircle, TbEye, TbEyeOff, TbLoader2 } from 'react-icons/tb'
import { DashError, dashApi } from '@/lib/dash-api'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/Logo'
import { card, inputClass } from '@/components/dash/ui'

type DashLoginProps = {
  notice?: string
  onSuccess: () => void
}

export function DashLogin({ notice, onSuccess }: DashLoginProps) {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user.trim() || !password) return setError('Preencha usuário e senha.')

    setSending(true)
    setError(null)
    try {
      await dashApi.login(user, password)
      onSuccess()
    } catch (err) {
      const status = err instanceof DashError ? err.status : 0
      setError(
        status === 401
          ? 'Usuário ou senha incorretos.'
          : status === 429
            ? 'Muitas tentativas seguidas. Aguarde 15 minutos e tente de novo.'
            : status === 503
              ? 'O painel ainda não foi configurado no servidor.'
              : 'Não foi possível conectar. Verifique sua conexão e tente de novo.',
      )
      setSending(false)
    }
  }

  const message = error ?? notice

  return (
    <main className="grid min-h-svh place-items-center px-gutter py-section">
      <div className={cn(card, 'w-full max-w-[24rem] p-xl')}>
        <Logo className="w-48" />

        <h1 className="mt-xl text-[1.5rem] font-semibold tracking-tight text-heading">Acesso restrito</h1>
        <p className="mt-1 text-[0.875rem] text-heading/70">Painel de inscrições do webinário.</p>

        <form noValidate onSubmit={handleSubmit} className="mt-xl flex flex-col gap-md">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="dash-user" className="text-[0.875rem] font-medium text-heading">
              Usuário
            </label>
            <input
              id="dash-user"
              autoFocus
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={user}
              onChange={(e) => setUser(e.target.value)}
              aria-invalid={Boolean(error)}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="dash-password" className="text-[0.875rem] font-medium text-heading">
              Senha
            </label>
            <div className="relative">
              <input
                id="dash-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(error)}
                className={cn(inputClass, 'pr-11 [&::-ms-reveal]:hidden')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute inset-y-0 right-0 grid w-11 cursor-pointer place-items-center rounded-r-lg text-heading/60 transition-colors duration-150 hover:text-heading focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
              >
                {showPassword ? <TbEyeOff className="size-5" /> : <TbEye className="size-5" />}
              </button>
            </div>
          </div>

          <div aria-live="polite" className="min-h-5">
            {message && (
              <p className="flex items-start gap-2 text-[0.875rem] text-red-700">
                <TbAlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                {message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={sending}
            aria-busy={sending}
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-md font-semibold text-light transition-colors duration-150 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heading disabled:cursor-wait disabled:opacity-70"
          >
            {sending && <TbLoader2 aria-hidden="true" className="size-5 animate-spin" />}
            Entrar
          </button>
        </form>
      </div>
    </main>
  )
}
