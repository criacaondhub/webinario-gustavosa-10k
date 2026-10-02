import { Fragment } from 'react'
import { TbArrowUpRight } from 'react-icons/tb'
import { CONFIG, isPending } from '@/config/content'
import { cn } from '@/lib/utils'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

type CtaButtonProps = {
  label: string
  /** Quebra o rótulo em linhas no mobile */
  lines?: readonly string[]
  className?: string
}

const base =
  'group inline-flex min-h-14 w-full max-w-md items-center justify-center gap-3 rounded-lg bg-accent px-7 py-4 font-sans text-cta font-bold uppercase tracking-[0.02em] text-heading shadow-[0_10px_30px_-10px_rgb(242_165_65/0.7)] transition-transform duration-200 ease-out will-change-transform hover:scale-[1.04] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-heading sm:w-auto sm:max-w-none'

export function CtaButton({ label, lines, className }: CtaButtonProps) {
  const text = (
    <span className="text-center sm:text-left">
      {lines
        ? lines.map((line, i) => (
            <Fragment key={line}>
              {i > 0 && (
                <>
                  <br className="sm:hidden" />
                  <span className="hidden sm:inline"> </span>
                </>
              )}
              {line}
            </Fragment>
          ))
        : label}
    </span>
  )
  const icon = (
    <TbArrowUpRight
      aria-hidden="true"
      className="size-5 shrink-0 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
    />
  )

  if (isPending(CONFIG.GROUP_URL)) {
    return (
      <button type="button" aria-label={label} className={cn(base, className)}>
        {text}
        {icon}
      </button>
    )
  }

  return (
    <a
      href={CONFIG.GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (abre o WhatsApp em nova aba)`}
      onClick={() => window.fbq?.('track', 'Lead')}
      className={cn(base, className)}
    >
      {text}
      {icon}
    </a>
  )
}
