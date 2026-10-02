import { TbCheck } from 'react-icons/tb'
import { cn } from '@/lib/utils'

export type LearnVariant = 'a' | 'b'

type LearnListProps = {
  title: string
  items: readonly string[]
  variant: LearnVariant
}

function Check({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary', className)}
    >
      <TbCheck className="size-3.5 stroke-[3] text-white" />
    </span>
  )
}

/** Bloco "O que você vai ver". Duas opções em avaliação pelo cliente. */
export function LearnList({ title, items, variant }: LearnListProps) {
  if (variant === 'a') {
    // Opção A — faixa dourada de largura total + lista limpa com divisórias
    return (
      <div>
        <p className="rounded-md bg-accent px-4 py-2 text-label font-bold tracking-label text-heading uppercase">
          {title}
        </p>
        <ul className="grid sm:grid-cols-2 sm:gap-x-8">
          {items.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 border-b border-heading/10 py-3 text-body leading-snug short:py-2.5"
            >
              <Check className="mt-0.5" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // Opção B — etiqueta dourada + cartões com filete dourado à esquerda
  return (
    <div>
      <p className="mb-3 inline-block rounded-md bg-accent px-3 py-1.5 text-label font-bold tracking-label text-heading uppercase">
        {title}
      </p>
      <ul className="grid gap-2.5 sm:grid-cols-2 sm:gap-3 short:gap-2">
        {items.map((point) => (
          <li
            key={point}
            className="flex items-start gap-3 rounded-lg border-l-4 border-accent bg-white px-4 py-3 text-body leading-snug shadow-[0_6px_20px_-12px_rgb(14_42_71/0.35)] short:py-2.5"
          >
            <Check className="mt-0.5" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  )
}
