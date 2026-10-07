// Classes compartilhadas do /dash (paleta da LP: fundo creme, grafite e azul do projeto)

export const card = 'rounded-2xl border border-heading/10 bg-white/55'

export const toolbarButton =
  'inline-flex h-11 min-w-11 cursor-pointer items-center justify-center gap-xs rounded-lg border border-heading/20 px-sm text-[0.875rem] font-medium text-heading transition-colors duration-150 hover:border-heading/40 hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 lg:h-10 lg:min-w-10'

export const inputClass =
  'h-11 w-full rounded-lg border border-heading/20 bg-white/60 px-sm text-[0.9375rem] text-heading outline-none transition-colors duration-150 placeholder:text-heading/45 hover:border-heading/40 focus:border-accent focus:ring-2 focus:ring-accent/20 aria-invalid:border-red-700'

export const number = new Intl.NumberFormat('pt-BR')
export const percent = (part: number, total: number) => (total ? `${Math.round((part / total) * 100)}%` : '—')
