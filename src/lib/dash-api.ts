// Cliente do /dash — a sessão vive num cookie HttpOnly emitido pela API (api/lib/auth.mjs)

const api = (path: string) => `${import.meta.env.BASE_URL}api/${path}`

export type Lead = {
  id: string
  nome: string
  email: string
  whatsapp: string
  instagram: string
  formado_medicina: string
  clinica_propria: string
  especialidade: string
  faturamento: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  pagina: string | null
  consentimento_em: string
  politica_versao: string
  criado_em: string
}

/** Contagem por valor de uma coluna; valor null = vazio (ex.: chegou sem UTM) */
export type Breakdown = { valor: string | null; total: number }[]

export type LeadsResponse = {
  items: Lead[]
  total: number
  page: number
  per: number
  stats: { total: number; hoje: number; ultimos_7_dias: number; formados: number; com_clinica: number }
  /** Últimos 14 dias, do mais antigo ao mais recente (dia = AAAA-MM-DD, fuso de Brasília) */
  por_dia: { dia: string; total: number }[]
  faturamento: Breakdown
  formado: Breakdown
  clinica: Breakdown
  fontes: Breakdown
}

export type Filters = { q: string; faturamento: string; formado: string; clinica: string; fonte: string }
export type LeadsQuery = Filters & { page: number }

/** Filtro de fonte para "chegou sem UTM" (espelha SEM_UTM em api/lib/leads.mjs) */
export const SEM_UTM = '__sem_utm'

export class DashError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { credentials: 'same-origin', ...init })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new DashError(res.status, data.error ?? `Erro ${res.status}`)
  return data as T
}

const json = (body: unknown): RequestInit => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

function toParams(query: Partial<LeadsQuery>) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) if (value) params.set(key, String(value))
  return params.toString()
}

export const dashApi = {
  me: () => request<{ ok: true }>(api('auth/me')),
  login: (user: string, password: string) => request<{ ok: true }>(api('auth/login'), json({ user, password })),
  logout: () => request<{ ok: true }>(api('auth/logout'), { method: 'POST' }),
  leads: (query: LeadsQuery) => request<LeadsResponse>(`${api('leads')}?${toParams(query)}`),
  remove: (id: string) => request<{ ok: true }>(api(`leads/${encodeURIComponent(id)}`), { method: 'DELETE' }),
  csvUrl: (filters: Filters) => `${api('leads.csv')}?${toParams(filters)}`,
}

// ─── Formatação ──────────────────────────────────────────────────────────────

const dateFormat = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
const timeFormat = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })
const dayFormat = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' })
const weekdayFormat = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', timeZone: 'UTC' })

export const formatDate = (iso: string) => dateFormat.format(new Date(iso))
export const formatTime = (iso: string) => timeFormat.format(new Date(iso))
/** "2026-10-07" → "07/10" (o dia já vem no fuso de Brasília: formata em UTC para não deslocar) */
export const formatDay = (day: string) => dayFormat.format(new Date(`${day}T00:00:00Z`))
export const formatWeekday = (day: string) => weekdayFormat.format(new Date(`${day}T00:00:00Z`)).replace('.', '')

/** 11987654321 → (11) 98765-4321 · 1133334444 → (11) 3333-4444 */
export function formatPhone(digits: string) {
  const d = digits.replace(/\D/g, '')
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return digits
}

export const whatsappLink = (digits: string) => `https://wa.me/55${digits.replace(/\D/g, '')}`
export const instagramLink = (handle: string) => `https://instagram.com/${handle.replace(/^@/, '')}`
