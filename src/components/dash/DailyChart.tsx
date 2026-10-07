import { useState } from 'react'
import { formatDay, formatWeekday, type LeadsResponse } from '@/lib/dash-api'
import { cn } from '@/lib/utils'
import { number } from '@/components/dash/ui'

const plural = (n: number) => `${number.format(n)} ${n === 1 ? 'inscrição' : 'inscrições'}`

/** Inscrições por dia (últimos 14 dias) — uma série, barras verticais com tooltip no hover/foco */
export function DailyChart({ days }: { days: LeadsResponse['por_dia'] }) {
  const [active, setActive] = useState<number | null>(null)
  const max = Math.max(1, ...days.map((d) => d.total))
  const period = days.reduce((sum, d) => sum + d.total, 0)

  return (
    <figure>
      <figcaption className="flex items-baseline justify-between gap-md">
        <span className="text-[0.9375rem] font-semibold text-heading">Inscrições por dia</span>
        <span className="text-[0.8125rem] text-heading/65 tabular-nums">
          {plural(period)} em {days.length} dias
        </span>
      </figcaption>

      <div className="relative mt-lg">
        {/* Escala: só o topo, recessiva */}
        <span className="absolute -top-5 left-0 text-[0.75rem] text-heading/55 tabular-nums">{number.format(max)}</span>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 border-t border-dashed border-heading/10" />

        <div className="flex h-40 items-end gap-1 border-b border-heading/25" onMouseLeave={() => setActive(null)}>
          {days.map((d, i) => (
            <div
              key={d.dia}
              tabIndex={0}
              aria-label={`${formatDay(d.dia)}: ${plural(d.total)}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group relative flex h-full flex-1 cursor-default items-end rounded-t-sm outline-none focus-visible:bg-accent/5"
            >
              <div
                className={cn(
                  'w-full rounded-t-[4px] bg-accent transition-opacity duration-150',
                  active !== null && active !== i && 'opacity-45',
                )}
                style={{ height: d.total ? `${Math.max((d.total / max) * 100, 2)}%` : 0 }}
              />
              {active === i && (
                <div
                  role="tooltip"
                  className={cn(
                    'absolute bottom-full z-10 mb-xs whitespace-nowrap rounded-lg bg-heading px-sm py-1.5 text-[0.8125rem] text-light shadow-lg',
                    i < 3 ? 'left-0' : i > days.length - 4 ? 'right-0' : 'left-1/2 -translate-x-1/2',
                  )}
                >
                  <span className="capitalize">{formatWeekday(d.dia)}</span>, {formatDay(d.dia)}
                  <span className="block font-semibold tabular-nums">{plural(d.total)}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div aria-hidden="true" className="mt-1.5 flex gap-1 text-[0.6875rem] text-heading/55 tabular-nums">
          {days.map((d, i) => (
            // No mobile, um rótulo a cada dois dias (sempre o de hoje)
            <span
              key={d.dia}
              className={cn('flex min-w-0 flex-1 justify-center whitespace-nowrap', (days.length - 1 - i) % 2 === 1 && 'max-sm:invisible')}
            >
              {formatDay(d.dia)}
            </span>
          ))}
        </div>
      </div>
    </figure>
  )
}
