import { CONFIG, CONTENT } from '@/config/content'
import { Logo } from '@/components/ui/Logo'

export function Footer() {
  const { info, privacy, credit } = CONTENT.footer

  return (
    <footer className="bg-accent text-light">
      <div className="mx-auto grid w-full max-w-page gap-lg px-gutter py-section text-center lg:grid-cols-3 lg:items-center lg:gap-xl lg:px-gutter-lg lg:text-left">
        <Logo variant="negative" className="mx-auto w-[13rem] lg:mx-0" />

        <p className="text-meta text-light/75 lg:text-center">
          {credit.prefix}
          <a
            href={credit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-sm font-bold text-light underline underline-offset-4 transition-colors duration-200 ease-out hover:text-light/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light"
          >
            {credit.name}
          </a>
        </p>

        <div className="text-meta text-light/75 lg:text-right">
          <p>{info}</p>
          <a
            href={CONFIG.PRIVACY_URL}
            className="inline-flex min-h-11 items-center rounded-sm text-light underline underline-offset-4 transition-colors duration-200 ease-out hover:text-light/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light"
          >
            {privacy}
          </a>
        </div>
      </div>
    </footer>
  )
}
