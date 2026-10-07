import { TbArrowUpRight } from 'react-icons/tb'
import { useLeadModal } from '@/lib/lead-modal'
import { cn } from '@/lib/utils'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

type CtaButtonProps = {
  label: string
  /** Com href vira link externo (nova aba); sem href abre o pop-up de inscrição */
  href?: string
  className?: string
}

export const ctaClass =
  'group inline-flex min-h-[60px] w-full max-w-[27rem] items-center justify-center gap-[20px] whitespace-nowrap rounded-lg bg-accent px-sm py-md sm:px-lg font-sans text-[clamp(0.75rem,3.4vw,1rem)] sm:text-cta font-bold uppercase tracking-[0.02em] text-light shadow-[0_10px_30px_-10px_rgb(30_63_168/0.45)] transition-transform duration-200 ease-out will-change-transform hover:scale-[1.04] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-heading'

export function CtaButton({ label, href, className }: CtaButtonProps) {
  const openLeadModal = useLeadModal()
  const content = (
    <>
      <span>{label}</span>
      <TbArrowUpRight
        aria-hidden="true"
        className="size-5 shrink-0 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (abre em nova aba)`} className={cn(ctaClass, className)}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" aria-haspopup="dialog" onClick={openLeadModal} className={cn(ctaClass, className)}>
      {content}
    </button>
  )
}
