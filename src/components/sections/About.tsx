import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ASSETS, CONTENT } from '@/config/content'
import { CtaButton } from '@/components/ui/CtaButton'
import { MediaFrame } from '@/components/ui/MediaFrame'

const EASE = [0.16, 1, 0.3, 1] as const
const PRINT_CLASS = 'block h-auto w-full rounded-2xl shadow-[0_20px_40px_-20px_rgb(40_55_74/0.5)]'

export function About() {
  const reduce = useReducedMotion()
  const { about } = CONTENT
  const { metrics, profile } = ASSETS.proof

  const container: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
  }
  const item: Variants = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  }

  return (
    <section className="overflow-x-clip bg-background-section">
      {/* Bloco 1 — foto (com o print das métricas flutuando no canto) + bio */}
      <div className="mx-auto grid w-full max-w-page lg:grid-cols-[0.8fr_1.2fr]">
        {/* Foto encosta na borda esquerda da viewport e fica fixa enquanto a bio rola no desktop */}
        <motion.div
          initial={{ opacity: reduce ? 1 : 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative lg:sticky lg:top-0 lg:min-w-0 lg:self-start lg:-ml-[max(0px,(100vw-var(--container-page))/2)] lg:w-[calc(100%+max(0px,(100vw-var(--container-page))/2))]"
        >
          <MediaFrame asset={ASSETS.speaker} className="aspect-square w-full lg:max-h-svh" />
          <figure className="relative z-10 mr-gutter ml-auto -mt-24 w-[62%] max-w-[20rem] lg:absolute lg:right-[-2.5rem] lg:bottom-[-3rem] lg:m-0 lg:w-[46%]">
            <img
              src={metrics.file}
              width={metrics.width}
              height={metrics.height}
              alt={metrics.alt}
              loading="lazy"
              className={`${PRINT_CLASS} border-4 border-background-section`}
            />
          </figure>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.1 }}
          className="min-w-0 self-center px-gutter pt-lg pb-section lg:py-section-lg lg:pr-gutter-lg lg:pl-[clamp(4rem,6vw,5.5rem)]"
        >
          <motion.h2 variants={item} className="mb-[clamp(1.25rem,2.5vw,1.75rem)]">
            <span className="block text-statement">{about.label}</span>{' '}
            <span className="mt-xs block text-headline font-bold text-balance text-heading">{about.name}</span>
          </motion.h2>

          <motion.p variants={item} className="mb-lg max-w-[40ch] text-statement font-bold text-balance text-accent">
            {about.lead}
          </motion.p>

          {about.bio.map((paragraph) => (
            <motion.p key={paragraph} variants={item} className="mb-md max-w-[62ch] text-body text-pretty">
              {paragraph}
            </motion.p>
          ))}
        </motion.div>
      </div>

      {/* Bloco 2 — print do perfil + frase de fechamento + CTA */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto w-full max-w-page px-gutter lg:px-gutter-lg"
      >
        <div className="flex flex-col items-center border-t border-heading/15 py-section text-center lg:py-section-lg">
          <motion.img
            variants={item}
            src={profile.file}
            width={profile.width}
            height={profile.height}
            alt={profile.alt}
            loading="lazy"
            className={`${PRINT_CLASS} mb-[clamp(1.75rem,3vw,2.5rem)] max-w-[34rem]`}
          />

          <motion.h2 variants={item} className="mb-[clamp(1.75rem,3vw,2.5rem)] max-w-[30ch] text-headline font-bold text-balance text-heading">
            {about.closing}
          </motion.h2>

          <motion.div variants={item} className="flex w-full flex-col items-center">
            <CtaButton label={about.cta} className="whitespace-normal text-balance text-center" />
            <p className="mt-sm text-meta font-bold">{about.ctaNote}</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
