import { TbCheck } from 'react-icons/tb'

type LearnListProps = {
  title: string
  items: readonly string[]
}

/** Bloco "O que você vai ver": título + lista em 2 colunas com divisórias. */
export function LearnList({ title, items }: LearnListProps) {
  return (
    <div>
      <p className="border-b border-heading/10 pb-2 text-label font-bold tracking-label uppercase">{title}</p>
      <ul className="grid sm:grid-cols-2 sm:gap-x-8">
        {items.map((point) => (
          <li
            key={point}
            className="flex items-start gap-3 border-b border-heading/10 py-3 text-body leading-snug short:py-2.5"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary"
            >
              <TbCheck className="size-3.5 stroke-[3] text-white" />
            </span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  )
}
