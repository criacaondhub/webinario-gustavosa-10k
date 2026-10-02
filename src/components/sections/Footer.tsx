import { CONTENT } from '@/config/content'
import { Logo } from '@/components/ui/Logo'

export function Footer() {
  const { info, credit } = CONTENT.footer

  return (
    <footer className="bg-heading text-white">
      <div className="mx-auto grid w-full max-w-page gap-lg px-gutter py-section text-center lg:grid-cols-3 lg:items-center lg:gap-xl lg:px-gutter-lg lg:text-left">
        <Logo variant="negative" className="mx-auto w-[11.5rem] lg:mx-0" />

        <p className="text-meta text-white/75 lg:text-center">
          {credit.prefix}
          <a
            href={credit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm font-bold text-accent underline-offset-4 transition-colors duration-200 ease-out hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {credit.name}
          </a>
        </p>

        <p className="text-meta text-white/75 lg:text-right">{info}</p>
      </div>
    </footer>
  )
}
