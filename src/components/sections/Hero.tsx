import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { TbCalendarEvent, TbClock, TbVideo } from 'react-icons/tb'
import { ASSETS, CONTENT } from '@/config/content'
import { CtaButton } from '@/components/ui/CtaButton'
import { Logo } from '@/components/ui/Logo'

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
      {/* Banner full: fundo da seção no desktop; no mobile vira imagem no topo com fade para o fundo */}
      <div className="relative xl:absolute xl:inset-0 xl:-z-10">
        <picture>
          <source media="(min-width: 640px)" srcSet={ASSETS.banner.file} width={ASSETS.banner.width} height={ASSETS.banner.height} />
          <img
            src={ASSETS.banner.mobile.file}
            width={ASSETS.banner.mobile.width}
            height={ASSETS.banner.mobile.height}
            alt={ASSETS.banner.alt}
            fetchPriority="high"
            className="block h-auto w-full sm:aspect-[16/9] sm:object-cover sm:object-[85%_center] xl:aspect-auto xl:size-full"
          />
        </picture>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-background to-transparent xl:hidden" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="shown"
        className="mx-auto grid w-full max-w-page xl:min-h-screen xl:grid-cols-[1.12fr_0.88fr]"
      >
        <div className="min-w-0 px-gutter pt-[clamp(1.75rem,4vw,3rem)] pb-section text-center xl:pt-[clamp(2.5rem,5vw,4.5rem)] xl:pr-[clamp(2rem,4vw,3.5rem)] xl:pb-section-lg xl:pl-gutter-lg xl:text-left">
          <motion.div variants={item}>
            <Logo className="mx-auto w-[clamp(12rem,24vw,19rem)] xl:mx-0" />
          </motion.div>

          <motion.ul
            variants={item}
            className="mt-md mb-[clamp(2rem,4vw,3rem)] flex flex-wrap items-center justify-center gap-x-sm gap-y-xs border-y border-heading/15 py-sm text-meta xl:justify-start xl:gap-x-xl"
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

          <motion.p variants={item} className="mx-auto mb-[clamp(1.75rem,3vw,2.5rem)] max-w-[54ch] text-lead tracking-[-0.02em] text-pretty xl:mx-0">
            {hero.intro}
          </motion.p>

          <motion.div variants={item} className="flex justify-center xl:justify-start">
            <CtaButton label={hero.cta} />
          </motion.div>

          <motion.p variants={item} className="mx-auto mt-md max-w-[48ch] text-meta text-pretty xl:mx-0">
            {hero.micro[0]}
            <br />
            {hero.micro[1]}
          </motion.p>

        </div>

        <motion.div
          variants={item}
          className="relative hidden xl:block"
        >
          <div className="glass absolute bottom-xl left-0 rounded-2xl px-lg py-md">
            <p className="text-body font-bold text-heading">{hero.portraitNote.name}</p>
            <p className="text-meta">
              {hero.portraitNote.role} · {hero.portraitNote.reach}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
