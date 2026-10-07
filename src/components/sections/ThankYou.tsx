import { Fragment } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { TbCalendarEvent, TbClock, TbVideo } from 'react-icons/tb'
import { ASSETS, CONFIG, CONTENT } from '@/config/content'
import { CtaButton } from '@/components/ui/CtaButton'
import { Logo } from '@/components/ui/Logo'

const EASE = [0.16, 1, 0.3, 1] as const
const ICONS = { calendar: TbCalendarEvent, clock: TbClock, video: TbVideo }

export function ThankYou() {
  const reduce = useReducedMotion()
  const { thankYou, hero } = CONTENT

  const container: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: 0.05 } },
  }
  const item: Variants = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  }

  return (
    <motion.main
      variants={container}
      initial="hidden"
      animate="shown"
      className="relative isolate flex min-h-svh flex-col justify-center overflow-x-clip px-gutter py-section text-center xl:px-gutter-lg"
    >
      <img
        src={ASSETS.thankYouBanner.file}
        width={ASSETS.thankYouBanner.width}
        height={ASSETS.thankYouBanner.height}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 -z-10 size-full object-cover object-left"
      />

      {/* Logo do produto e, abaixo, as informações do evento — bloco inteiro centralizado na vertical */}
      <header className="mx-auto w-full max-w-[40rem]">
        <motion.div variants={item}>
          <Logo className="mx-auto w-[clamp(12rem,24vw,19rem)]" />
        </motion.div>

        <motion.ul
          variants={item}
          className="mt-md flex flex-wrap items-center justify-center gap-x-sm gap-y-xs border-y border-heading/15 py-sm text-meta xl:gap-x-xl"
        >
          {hero.date.map(({ icon, text }) => {
            const Icon = ICONS[icon]
            return (
              <li key={text} className="flex shrink-0 items-center gap-xs whitespace-nowrap">
                <Icon aria-hidden="true" className="size-[18px] shrink-0 text-accent" />
                {text}
              </li>
            )
          })}
        </motion.ul>
      </header>

      <div className="mx-auto mt-[clamp(2rem,4vw,3rem)] flex w-full max-w-[62rem] flex-col items-center">
        <motion.h1 variants={item} className="mb-lg text-display leading-[1.2] text-balance text-heading">
          {thankYou.headline.map(({ text, emphasis }) =>
            emphasis ? (
              <span key={text} className={emphasis === 'accent' ? 'font-bold text-accent' : 'highlight'}>
                {text}
              </span>
            ) : (
              text
            ),
          )}
        </motion.h1>

        <motion.h2 variants={item} className="mb-[clamp(1.75rem,3vw,2.5rem)] max-w-[54ch] text-lead tracking-[-0.02em] text-pretty md:max-w-none">
          {thankYou.intro[0].split(thankYou.introHighlight).map((part, i) => (
            <Fragment key={part}>
              {i > 0 && <strong className="font-bold text-accent">{thankYou.introHighlight}</strong>}
              {part}
            </Fragment>
          ))}
          <br className="max-md:hidden" /> {thankYou.intro[1]}
        </motion.h2>

        <motion.div variants={item} className="flex w-full justify-center">
          <CtaButton label={thankYou.cta} href={CONFIG.GROUP_URL} variant="whatsapp" />
        </motion.div>
      </div>
    </motion.main>
  )
}
