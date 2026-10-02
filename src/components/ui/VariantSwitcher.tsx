import type { LearnVariant } from '@/components/ui/LearnList'
import { cn } from '@/lib/utils'

type VariantSwitcherProps = {
  value: LearnVariant
  onChange: (value: LearnVariant) => void
}

/** Seletor temporário (só em desenvolvimento) para o cliente comparar as opções. Remover após a decisão. */
export function VariantSwitcher({ value, onChange }: VariantSwitcherProps) {
  const options: { id: LearnVariant; label: string }[] = [
    { id: 'a', label: 'Opção A' },
    { id: 'b', label: 'Opção B' },
  ]
  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full bg-heading p-1 text-meta font-bold text-white shadow-lg">
      <span className="px-3">Bullets:</span>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className={cn('min-h-11 rounded-full px-4', value === o.id ? 'bg-accent text-heading' : 'hover:bg-white/10')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
