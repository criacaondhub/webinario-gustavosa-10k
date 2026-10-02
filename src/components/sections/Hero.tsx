import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { TbCalendarEvent, TbCheck, TbClock, TbVideo } from 'react-icons/tb'
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
        <div className="absolute -top-40 -left-40 size-[36rem] rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 size-[28rem] rounded-full bg-heading/[0.06] blur-3xl" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="shown"
        className="mx-auto grid w-full max-w-page lg:min-h-screen lg:grid-cols-[1.12fr_0.88fr]"
      >
        <div className="min-w-0 px-gutter pt-[clamp(1.75rem,4vw,3rem)] pb-section text-center lg:pt-10 short:pt-6 lg:pr-[clamp(2rem,4vw,3.5rem)] lg:pb-16 lg:pl-gutter-lg lg:text-left">
          <motion.div variants={item}>
            <Logo className="mx-auto w-[clamp(11.5rem,22vw,16rem)] short:w-52 lg:mx-0" />
          </motion.div>

          <motion.ul
            variants={item}
            className="mt-6 mb-[clamp(2rem,4vw,3rem)] lg:mt-5 lg:mb-8 short:mt-4 short:mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-y border-heading/15 py-3 text-meta lg:justify-start lg:gap-x-10"
          >
            {hero.date.map(({ icon, text }) => {
              const Icon = ICONS[icon]
              return (
                <li key={text} className="flex shrink-0 items-center gap-2 whitespace-nowrap">
                  <Icon aria-hidden="true" className="size-[18px] shrink-0 text-accent-hover" />
                  {text}
                </li>
              )
            })}
          </motion.ul>

          <motion.h1 variants={item} className="mb-6 lg:mb-5 text-display short:text-[2.625rem] text-balance text-heading">
            {hero.headline.map(({ text, highlight }) =>
              highlight ? (
                <span key={text} className="highlight">
                  {text}
                </span>
              ) : (
                text
              ),
            )}
          </motion.h1>

          <motion.p variants={item} className="mx-auto mb-8 max-w-[54ch] text-lead lg:mb-6 lg:max-w-[60ch] text-pretty lg:mx-0">
            {hero.intro}
          </motion.p>

          <motion.div variants={item} className="glass mx-auto mb-10 max-w-2xl rounded-2xl p-6 text-left lg:mx-0 lg:mb-8 short:mb-6 short:p-5">
            <p className="mb-4 lg:mb-3 text-label font-bold tracking-label uppercase">{hero.learnTitle}</p>
            <ul className="grid gap-3 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4">
              {hero.learn.map((point) => (
                <li key={point} className="flex gap-3 text-body lg:leading-snug">
                  <span
                    aria-hidden="true"
                    className="mt-1 lg:mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary"
                  >
                    <TbCheck className="size-3.5 stroke-[3] text-white" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={item} className="flex flex-col items-center gap-x-5 gap-y-3 sm:flex-row sm:justify-center lg:justify-start">
            <CtaButton label={hero.cta} lines={hero.ctaLines} />
            <p className="flex items-center gap-2 text-meta font-bold">
              <span aria-hidden="true" className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2.5 rounded-full bg-accent-hover" />
              </span>
              {hero.scarcity}
            </p>
          </motion.div>

        </div>

        <motion.div
          variants={item}
          className="hidden lg:grid lg:min-h-0 lg:min-w-0 lg:w-[calc(100%+max(0px,(100vw-var(--container-page))/2))]"
        >
          <MediaFrame asset={ASSETS.portrait} priority className="h-full">
            <div className="glass absolute bottom-8 left-8 rounded-2xl px-5 py-4">
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
