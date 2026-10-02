import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ASSETS, CONTENT } from '@/config/content'
import { CtaButton } from '@/components/ui/CtaButton'
import { MediaFrame } from '@/components/ui/MediaFrame'

const EASE = [0.16, 1, 0.3, 1] as const

export function About() {
  const reduce = useReducedMotion()
  const { about } = CONTENT

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
      <div className="mx-auto grid w-full max-w-page lg:grid-cols-[0.8fr_1.2fr]">
        {/* Foto encosta na borda esquerda da viewport no desktop */}
        <motion.div
          initial={{ opacity: reduce ? 1 : 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="lg:grid lg:min-h-0 lg:min-w-0 lg:-ml-[max(0px,(100vw-var(--container-page))/2)] lg:w-[calc(100%+max(0px,(100vw-var(--container-page))/2))]"
        >
          <MediaFrame asset={ASSETS.speaker} className="aspect-[6/7] w-full" />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.2 }}
          className="min-w-0 self-center px-gutter py-section lg:py-section-lg lg:pr-gutter-lg lg:pl-[clamp(2rem,4vw,3.5rem)]"
        >
          <motion.h2 variants={item} className="mb-[clamp(1.5rem,3vw,2.25rem)]">
            <span className="block text-statement">{about.label}</span>{' '}
            <span className="mt-xs block text-headline font-bold text-balance text-heading">{about.name}</span>
          </motion.h2>

          {about.bio.map((paragraph) => (
            <motion.p key={paragraph} variants={item} className="mb-md max-w-[62ch] text-body text-pretty">
              {paragraph}
            </motion.p>
          ))}

          <motion.p
            variants={item}
            className="mt-[clamp(2rem,3.5vw,2.75rem)] mb-[clamp(1.75rem,3vw,2.5rem)] max-w-[46ch] border-t border-heading/15 pt-lg text-statement text-balance text-heading"
          >
            {about.closing}
          </motion.p>

          <motion.div variants={item}>
            <CtaButton label={about.cta} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
