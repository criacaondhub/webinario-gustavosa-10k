import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { TbCalendarEvent, TbClock, TbVideo } from 'react-icons/tb'
import { ASSETS, CONTENT } from '@/config/content'
import { CtaButton } from '@/components/ui/CtaButton'
import { Logo } from '@/components/ui/Logo'
import { MediaFrame } from '@/components/ui/MediaFrame'

const EASE = [0.16, 1, 0.3, 1] as const
const ICONS = { calendar: TbCalendarEvent, clock: TbClock, video: TbVideo }

export function Hero() {
  const reduce = useReducedMotion()
  const { hero } = CONTENT

  const container: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: 0.05 } },
  }
  const item: Variants = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  }

  return (
    <section className="relative isolate overflow-x-clip">
      {/* Brilhos de fundo — dão profundidade ao glassmorphism */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/3 size-[28rem] rounded-full bg-heading/[0.06] blur-3xl" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="shown"
        className="mx-auto grid w-full max-w-page lg:min-h-screen lg:grid-cols-[1.12fr_0.88fr]"
      >
        <div className="min-w-0 px-gutter pt-[clamp(1.75rem,4vw,3rem)] pb-section text-center lg:pt-[clamp(2.5rem,5vw,4.5rem)] lg:pr-[clamp(2rem,4vw,3.5rem)] lg:pb-section-lg lg:pl-gutter-lg lg:text-left">
          <motion.div variants={item}>
            <Logo className="mx-auto w-[clamp(11.5rem,26vw,20rem)] lg:mx-0" />
          </motion.div>

          <motion.ul
            variants={item}
            className="mt-md mb-[clamp(2rem,4vw,3rem)] flex flex-wrap items-center justify-center gap-x-sm gap-y-xs border-y border-heading/15 py-sm text-meta lg:justify-start lg:gap-x-xl"
          >
            {hero.date.map(({ icon, text }) => {
              const Icon = ICONS[icon]
              return (
                <li key={text} className="flex shrink-0 items-center gap-xs whitespace-nowrap">
                  <Icon aria-hidden="true" className="size-[18px] shrink-0 text-accent-hover" />
                  {text}
                </li>
              )
            })}
          </motion.ul>

          <motion.h1 variants={item} className="mb-lg text-display text-balance text-heading">
            {hero.headline.map(({ text, emphasis }) =>
              emphasis ? (
                <span key={text} className={emphasis === 'accent' ? 'font-bold text-accent' : 'highlight'}>
                  {text}
                </span>
              ) : (
                text
              ),
            )}
          </motion.h1>

          <motion.p variants={item} className="mx-auto mb-[clamp(1.75rem,3vw,2.5rem)] max-w-[54ch] text-lead tracking-[-0.02em] text-pretty lg:mx-0">
            {hero.intro}
          </motion.p>

          <motion.div variants={item} className="flex justify-center lg:justify-start">
            <CtaButton label={hero.cta} />
          </motion.div>

        </div>

        <motion.div
          variants={item}
          className="hidden lg:grid lg:min-h-0 lg:min-w-0 lg:w-[calc(100%+max(0px,(100vw-var(--container-page))/2))]"
        >
          <MediaFrame asset={ASSETS.portrait} priority className="h-full">
            <div className="glass absolute bottom-xl left-xl rounded-2xl px-lg py-md">
              <p className="text-body font-bold text-heading">{hero.portraitNote.name}</p>
              <p className="text-meta">
                {hero.portraitNote.role} · {hero.portraitNote.reach}
              </p>
            </div>
          </MediaFrame>
        </motion.div>
      </motion.div>
    </section>
  )
}
