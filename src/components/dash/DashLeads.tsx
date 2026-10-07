import { useEffect, useState, type ReactNode } from 'react'
import {
  TbBrandInstagram,
  TbBrandWhatsapp,
  TbChevronLeft,
  TbChevronRight,
  TbDownload,
  TbLogout,
  TbMail,
  TbRefresh,
  TbSearch,
  TbTrash,
  TbX,
} from 'react-icons/tb'
import { CONTENT } from '@/config/content'
import {
  DashError,
  SEM_UTM,
  dashApi,
  formatDate,
  formatPhone,
  formatTime,
  instagramLink,
  whatsappLink,
  type Breakdown,
  type Filters,
  type Lead,
  type LeadsResponse,
} from '@/lib/dash-api'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/Logo'
import { BreakdownChart, type BreakdownRow } from '@/components/dash/BreakdownChart'
import { DailyChart } from '@/components/dash/DailyChart'
import { card, number, percent, toolbarButton } from '@/components/dash/ui'

type DashLeadsProps = {
  onLogout: (notice?: string) => void
}

const NO_FILTERS: Filters = { q: '', faturamento: '', formado: '', clinica: '', fonte: '' }

/** Faixas de faturamento na ordem do formulário (da menor para a maior), não por contagem */
const REVENUE_ORDER: readonly string[] = CONTENT.form.options.revenue

const toRows = (breakdown: Breakdown, emptyLabel = '—'): BreakdownRow[] =>
  breakdown.map((b) => ({ value: b.valor ?? SEM_UTM, label: b.valor ?? emptyLabel, total: b.total }))

const revenueRows = (breakdown: Breakdown) =>
  toRows(breakdown).sort((a, b) => {
    const ia = REVENUE_ORDER.indexOf(a.value)
    const ib = REVENUE_ORDER.indexOf(b.value)
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib)
  })

export function DashLeads({ onLogout }: DashLeadsProps) {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Filters>(NO_FILTERS)
  const [page, setPage] = useState(1)
  const [data, setData] = useState<LeadsResponse | null>(null)
  const [loadedKey, setLoadedKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reload, setReload] = useState(0)

  // Busca com espera de 300ms para não consultar a cada tecla
  useEffect(() => {
    const t = window.setTimeout(() => {
      setFilters((f) => (f.q === search.trim() ? f : { ...f, q: search.trim() }))
      setPage(1)
    }, 300)
    return () => window.clearTimeout(t)
  }, [search])

  // Carregando = a última resposta recebida não corresponde aos filtros atuais
  const requestKey = JSON.stringify([page, filters, reload])
  const loading = loadedKey !== requestKey

  useEffect(() => {
    let cancelled = false
    dashApi
      .leads({ page, ...filters })
      .then((res) => {
        if (cancelled) return
        setData(res)
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof DashError && err.status === 401) return onLogout('Sua sessão expirou. Entre de novo.')
        setError('Não foi possível carregar as inscrições. Tente atualizar.')
      })
      .finally(() => !cancelled && setLoadedKey(requestKey))
    return () => {
      cancelled = true
    }
  }, [page, filters, requestKey, onLogout])

  const logout = async () => {
    await dashApi.logout().catch(() => {})
    onLogout()
  }

  const setFilter = (key: Exclude<keyof Filters, 'q'>) => (value: string) => {
    setFilters((f) => ({ ...f, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setSearch('')
    setFilters(NO_FILTERS)
    setPage(1)
  }

  // Exclusão definitiva — usada para atender pedidos do titular (LGPD, art. 18)
  const removeLead = async (lead: Lead) => {
    const ok = window.confirm(
      `Excluir definitivamente a inscrição de ${lead.nome} (${lead.email})?\n\nUse para atender pedidos de exclusão de dados (LGPD). Não dá para desfazer.`,
    )
    if (!ok) return
    try {
      await dashApi.remove(lead.id)
      setReload((n) => n + 1)
    } catch (err) {
      if (err instanceof DashError && err.status === 401) return onLogout('Sua sessão expirou. Entre de novo.')
      window.alert('Não foi possível excluir. Tente de novo.')
    }
  }

  const filtered = Object.values(filters).some(Boolean)
  const pages = data ? Math.max(1, Math.ceil(data.total / data.per)) : 1
  const from = data && data.total ? (data.page - 1) * data.per + 1 : 0
  const to = data ? Math.min(data.page * data.per, data.total) : 0
  const stats = data?.stats

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-20 border-b border-heading/10 bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-md px-gutter lg:px-gutter-lg">
          <div className="flex items-center gap-md">
            <Logo className="w-40" />
            <span className="hidden h-5 w-px bg-heading/20 sm:block" aria-hidden="true" />
            <span className="hidden text-[0.875rem] font-medium text-heading/70 sm:block">Painel de inscrições</span>
          </div>
          <button type="button" onClick={logout} className={toolbarButton}>
            <TbLogout aria-hidden="true" className="size-4" />
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-page px-gutter py-xl lg:px-gutter-lg lg:py-10">
        <div className="flex flex-wrap items-end justify-between gap-md">
          <h1 className="text-[1.75rem] font-semibold tracking-tight text-heading">Inscrições</h1>
          <div className="flex gap-xs">
            <button
              type="button"
              onClick={() => setReload((n) => n + 1)}
              disabled={loading}
              className={toolbarButton}
              aria-label="Atualizar"
            >
              <TbRefresh aria-hidden="true" className={cn('size-4', loading && 'animate-spin')} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
            <a
              href={dashApi.csvUrl(filters)}
              download
              className={cn(toolbarButton, !data?.total && 'pointer-events-none opacity-40')}
              aria-disabled={!data?.total}
            >
              <TbDownload aria-hidden="true" className="size-4" />
              Exportar CSV
            </a>
          </div>
        </div>

        {/* Números do topo */}
        <dl className="mt-lg grid grid-cols-2 gap-sm lg:grid-cols-5">
          <Stat label="Total de inscrições" value={stats && number.format(stats.total)} />
          <Stat label="Hoje" value={stats && number.format(stats.hoje)} />
          <Stat label="Últimos 7 dias" value={stats && number.format(stats.ultimos_7_dias)} />
          <Stat
            label="Formados em medicina"
            value={stats && percent(stats.formados, stats.total)}
            detail={stats && `${number.format(stats.formados)} de ${number.format(stats.total)}`}
          />
          <Stat
            label="Com clínica própria"
            value={stats && percent(stats.com_clinica, stats.total)}
            detail={stats && `${number.format(stats.com_clinica)} de ${number.format(stats.total)}`}
            className="col-span-2 lg:col-span-1"
          />
        </dl>

        {data && (
          <div className="mt-sm grid gap-sm lg:grid-cols-[1.4fr_1fr]">
            <div className={cn(card, 'min-w-0 p-lg pt-xl')}>
              <DailyChart days={data.por_dia} />
            </div>
            <div className={cn(card, 'min-w-0 p-lg')}>
              <BreakdownChart
                title="Faturamento mensal"
                rows={revenueRows(data.faturamento)}
                active={filters.faturamento}
                onSelect={setFilter('faturamento')}
              />
            </div>
          </div>
        )}

        {data && (
          <div className="mt-sm grid gap-sm md:grid-cols-3">
            <div className={cn(card, 'min-w-0 p-lg')}>
              <BreakdownChart
                title="Origem (utm_source)"
                rows={toRows(data.fontes, 'Sem UTM')}
                active={filters.fonte}
                onSelect={setFilter('fonte')}
              />
            </div>
            <div className={cn(card, 'min-w-0 p-lg')}>
              <BreakdownChart
                title="Formado em medicina?"
                rows={toRows(data.formado)}
                active={filters.formado}
                onSelect={setFilter('formado')}
              />
            </div>
            <div className={cn(card, 'min-w-0 p-lg')}>
              <BreakdownChart
                title="Clínica própria?"
                rows={toRows(data.clinica)}
                active={filters.clinica}
                onSelect={setFilter('clinica')}
              />
            </div>
          </div>
        )}

        {/* Lista */}
        <section aria-labelledby="lista-titulo" className="mt-xl">
          <div className="flex flex-wrap items-center justify-between gap-sm">
            <h2 id="lista-titulo" className="text-[1.125rem] font-semibold text-heading">
              Lista de inscritos
            </h2>
            {filtered && (
              <button type="button" onClick={clearFilters} className={toolbarButton}>
                <TbX aria-hidden="true" className="size-4" />
                Limpar filtros
              </button>
            )}
          </div>

          <div className="relative mt-sm max-w-[28rem]">
            <TbSearch aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-heading/55" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar nome, contato, especialidade ou campanha"
              aria-label="Buscar inscrições"
              className="h-11 w-full rounded-lg border border-heading/20 bg-white/60 pr-11 pl-9 text-[0.875rem] text-heading outline-none transition-colors duration-150 placeholder:text-heading/45 hover:border-heading/40 focus:border-accent focus:ring-2 focus:ring-accent/20 lg:h-10 [&::-webkit-search-cancel-button]:hidden"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Limpar busca"
                className="absolute top-1/2 right-0 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-heading/55 hover:text-heading lg:size-10"
              >
                <TbX className="size-4" />
              </button>
            )}
          </div>

          <div className={cn(card, 'mt-sm overflow-hidden')}>
            {error ? (
              <div className="px-lg py-16 text-center">
                <p className="text-[0.875rem] text-red-700">{error}</p>
                <button type="button" onClick={() => setReload((n) => n + 1)} className={cn(toolbarButton, 'mt-md')}>
                  <TbRefresh aria-hidden="true" className="size-4" />
                  Tentar de novo
                </button>
              </div>
            ) : loading && !data ? (
              <SkeletonRows />
            ) : data && data.items.length === 0 ? (
              <EmptyState filtered={filtered} onClear={clearFilters} />
            ) : (
              data && <LeadsTable items={data.items} dimmed={loading} onDelete={removeLead} />
            )}
          </div>

          {data && data.total > 0 && (
            <nav aria-label="Paginação" className="mt-sm flex items-center justify-between gap-md text-[0.875rem] text-heading/70">
              <p className="tabular-nums">
                {from}–{to} de {number.format(data.total)}
              </p>
              <div className="flex gap-xs">
                <button
                  type="button"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page <= 1 || loading}
                  className={toolbarButton}
                  aria-label="Página anterior"
                >
                  <TbChevronLeft aria-hidden="true" className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= pages || loading}
                  className={toolbarButton}
                  aria-label="Próxima página"
                >
                  <TbChevronRight aria-hidden="true" className="size-4" />
                </button>
              </div>
            </nav>
          )}
        </section>
      </main>
    </div>
  )
}

function Stat({ label, value, detail, className }: { label: string; value?: string; detail?: string; className?: string }) {
  return (
    <div className={cn(card, 'px-md py-sm lg:px-lg lg:py-md', className)}>
      <dt className="text-[0.8125rem] text-heading/70">{label}</dt>
      <dd className="mt-1 text-[1.75rem] leading-tight font-semibold text-heading tabular-nums">
        {value ?? <span className="inline-block h-7 w-12 animate-pulse rounded-sm bg-heading/10 align-middle" />}
      </dd>
      {detail && <dd className="text-[0.75rem] text-heading/60 tabular-nums">{detail}</dd>}
    </div>
  )
}

/** utm_source em destaque; medium · campaign abaixo */
function UtmOrigin({ lead }: { lead: Lead }) {
  if (!lead.utm_source && !lead.utm_medium && !lead.utm_campaign) return <span className="text-heading/55">Sem UTM</span>
  const detail = [lead.utm_medium, lead.utm_campaign, lead.utm_content].filter(Boolean).join(' · ')
  return (
    <span className="break-words">
      <span className="text-heading">{lead.utm_source ?? '—'}</span>
      {detail && <span className="block text-heading/60">{detail}</span>}
    </span>
  )
}

/** Formado? / Clínica própria? como selos curtos */
function ProfileBadges({ lead }: { lead: Lead }) {
  const badge = 'inline-block rounded-sm border px-1.5 py-px text-[0.75rem] font-medium'
  const graduated = lead.formado_medicina === 'Sim'
  const clinic = lead.clinica_propria === 'Sim'
  return (
    <span className="mt-1.5 flex flex-wrap gap-1">
      <span className={cn(badge, graduated ? 'border-accent/40 text-accent' : 'border-heading/20 text-heading/65')}>
        {graduated ? 'Formado' : 'Cursando'}
      </span>
      <span className={cn(badge, clinic ? 'border-accent/40 text-accent' : 'border-heading/20 text-heading/65')}>
        {clinic ? 'Com clínica' : 'Sem clínica'}
      </span>
    </span>
  )
}

function DeleteButton({ lead, onDelete }: { lead: Lead; onDelete: (lead: Lead) => void }) {
  return (
    <button
      type="button"
      onClick={() => onDelete(lead)}
      aria-label={`Excluir inscrição de ${lead.nome}`}
      title="Excluir inscrição (pedido do titular — LGPD)"
      className="grid size-11 cursor-pointer place-items-center rounded-lg text-heading/50 transition-colors duration-150 hover:bg-red-700/10 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-red-700 lg:size-9"
    >
      <TbTrash aria-hidden="true" className="size-4" />
    </button>
  )
}

function LeadsTable({ items, dimmed, onDelete }: { items: Lead[]; dimmed: boolean; onDelete: (lead: Lead) => void }) {
  return (
    <div className={cn('transition-opacity duration-150', dimmed && 'opacity-50')}>
      {/* Desktop: tabela */}
      <table className="hidden w-full text-left text-[0.875rem] lg:table">
        <thead className="border-b border-heading/10 bg-heading/[0.03] text-[0.75rem] font-medium tracking-wide text-heading/65 uppercase">
          <tr>
            <th scope="col" className="px-md py-sm font-medium">Data</th>
            <th scope="col" className="px-md py-sm font-medium">Inscrito</th>
            <th scope="col" className="px-md py-sm font-medium">Contato</th>
            <th scope="col" className="px-md py-sm font-medium">Faturamento</th>
            <th scope="col" className="px-md py-sm font-medium">Origem</th>
            <th scope="col" className="w-12 px-xs py-sm"><span className="sr-only">Ações</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-heading/10">
          {items.map((lead) => (
            <tr key={lead.id} className="align-top transition-colors duration-150 hover:bg-white/50">
              <td className="px-md py-md whitespace-nowrap tabular-nums">
                <span className="text-heading">{formatDate(lead.criado_em)}</span>
                <span className="block text-heading/60">{formatTime(lead.criado_em)}</span>
              </td>
              <td className="px-md py-md">
                <span className="font-semibold text-heading">{lead.nome}</span>
                <span className="block text-heading/65">{lead.especialidade}</span>
                <ProfileBadges lead={lead} />
              </td>
              <td className="px-md py-md">
                <ContactLinks lead={lead} />
              </td>
              <td className="px-md py-md text-heading">{lead.faturamento}</td>
              <td className="px-md py-md">
                <UtmOrigin lead={lead} />
              </td>
              <td className="px-xs py-sm">
                <DeleteButton lead={lead} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: lista empilhada */}
      <ul className="divide-y divide-heading/10 lg:hidden">
        {items.map((lead) => (
          <li key={lead.id} className="flex flex-col gap-sm px-md py-md text-[0.875rem]">
            <div className="flex items-start justify-between gap-sm">
              <div className="min-w-0">
                <p className="font-semibold text-heading">{lead.nome}</p>
                <p className="text-heading/65">{lead.especialidade}</p>
                <ProfileBadges lead={lead} />
              </div>
              <div className="flex shrink-0 items-start gap-1">
                <p className="text-right text-heading/60 tabular-nums">
                  {formatDate(lead.criado_em)}
                  <span className="block">{formatTime(lead.criado_em)}</span>
                </p>
                <DeleteButton lead={lead} onDelete={onDelete} />
              </div>
            </div>
            <ContactLinks lead={lead} />
            <dl className="grid grid-cols-2 gap-sm">
              <div>
                <dt className="text-[0.75rem] text-heading/60">Faturamento</dt>
                <dd className="text-heading">{lead.faturamento}</dd>
              </div>
              <div>
                <dt className="text-[0.75rem] text-heading/60">Origem</dt>
                <dd>
                  <UtmOrigin lead={lead} />
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ContactLinks({ lead }: { lead: Lead }) {
  const link =
    'inline-flex min-h-11 items-center gap-xs rounded-sm text-heading underline-offset-4 transition-colors duration-150 hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-accent lg:min-h-7'
  return (
    <div className="flex flex-col">
      <a href={whatsappLink(lead.whatsapp)} target="_blank" rel="noopener noreferrer" className={cn(link, 'tabular-nums')}>
        <TbBrandWhatsapp aria-hidden="true" className="size-4 shrink-0 text-heading/55" />
        {formatPhone(lead.whatsapp)}
      </a>
      <a href={`mailto:${lead.email}`} className={cn(link, 'break-all')}>
        <TbMail aria-hidden="true" className="size-4 shrink-0 text-heading/55" />
        {lead.email}
      </a>
      <a href={instagramLink(lead.instagram)} target="_blank" rel="noopener noreferrer" className={link}>
        <TbBrandInstagram aria-hidden="true" className="size-4 shrink-0 text-heading/55" />
        {lead.instagram}
      </a>
    </div>
  )
}

function SkeletonRows() {
  return (
    <div aria-busy="true" aria-label="Carregando inscrições" className="divide-y divide-heading/10">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex animate-pulse gap-lg px-md py-5">
          <div className="h-4 w-16 rounded-sm bg-heading/10" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-4 w-1/3 rounded-sm bg-heading/10" />
            <div className="h-3 w-1/4 rounded-sm bg-heading/10" />
          </div>
          <div className="hidden h-4 w-1/5 rounded-sm bg-heading/10 lg:block" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ filtered, onClear }: { filtered: boolean; onClear: () => void }): ReactNode {
  return (
    <div className="px-lg py-16 text-center">
      {filtered ? (
        <>
          <p className="font-semibold text-heading">Nenhuma inscrição com esses filtros</p>
          <p className="mt-1 text-[0.875rem] text-heading/65">Tente outro termo de busca ou outro filtro.</p>
          <button type="button" onClick={onClear} className={cn(toolbarButton, 'mt-md')}>
            <TbX aria-hidden="true" className="size-4" />
            Limpar filtros
          </button>
        </>
      ) : (
        <>
          <p className="font-semibold text-heading">Nenhuma inscrição ainda</p>
          <p className="mx-auto mt-1 max-w-[24rem] text-[0.875rem] text-heading/65">
            Assim que alguém preencher o formulário da página, a inscrição aparece aqui — com contato, especialidade e
            faturamento.
          </p>
        </>
      )}
    </div>
  )
}
