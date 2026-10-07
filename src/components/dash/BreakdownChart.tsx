import { cn } from '@/lib/utils'
import { number, percent } from '@/components/dash/ui'

export type BreakdownRow = { value: string; label: string; total: number }

type BreakdownChartProps = {
  title: string
  rows: BreakdownRow[]
  /** Valor do filtro ativo ('' = nenhum) — clicar numa linha filtra a lista */
  active: string
  onSelect: (value: string) => void
  empty?: string
}

/** Distribuição por categoria em barras horizontais; cada linha também é o filtro da lista */
export function BreakdownChart({ title, rows, active, onSelect, empty = 'Sem dados ainda.' }: BreakdownChartProps) {
  const total = rows.reduce((sum, r) => sum + r.total, 0)
  const max = Math.max(1, ...rows.map((r) => r.total))

  return (
    <section aria-label={title}>
      <h2 className="text-[0.9375rem] font-semibold text-heading">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-sm text-[0.875rem] text-heading/65">{empty}</p>
      ) : (
        <ul className="mt-sm flex flex-col gap-0.5">
          {rows.map((row) => {
            const selected = active === row.value
            return (
              <li key={row.value}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelect(selected ? '' : row.value)}
                  title={selected ? 'Remover filtro' : 'Filtrar a lista por este valor'}
                  className={cn(
                    'w-full cursor-pointer rounded-lg px-xs py-1.5 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-accent',
                    selected ? 'bg-accent/10 ring-1 ring-accent/40' : 'hover:bg-heading/5',
                  )}
                >
                  <span className="flex items-baseline justify-between gap-sm text-[0.8125rem]">
                    <span className={cn('min-w-0 truncate text-heading', selected && 'font-semibold')}>{row.label}</span>
                    <span className="shrink-0 text-heading/70 tabular-nums">
                      <span className="font-semibold text-heading">{number.format(row.total)}</span> · {percent(row.total, total)}
                    </span>
                  </span>
                  <span aria-hidden="true" className="mt-1 block h-1.5 rounded-full bg-heading/8">
                    <span
                      className="block h-full rounded-full bg-accent"
                      style={{ width: `${Math.max((row.total / max) * 100, row.total ? 2 : 0)}%` }}
                    />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
