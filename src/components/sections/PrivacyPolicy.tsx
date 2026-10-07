import { Fragment } from 'react'
import { TbArrowLeft } from 'react-icons/tb'
import { isPending } from '@/config/content'
import { POLICY_INTRO, POLICY_SECTIONS, PRIVACY, type PolicyText } from '@/config/privacy'
import { Logo } from '@/components/ui/Logo'

/** Trecho da política; valores ainda não preenchidos (⚠️) aparecem destacados para revisão */
function Text({ parts }: { parts: PolicyText[] }) {
  return parts.map((part, i) => {
    const value = typeof part === 'string' ? part : part.strong
    const pending = isPending(value.trim())
    const content = pending ? <mark className="rounded-sm bg-amber-200 px-1 text-heading">{value}</mark> : value
    return <Fragment key={i}>{typeof part === 'string' ? content : <strong className="font-semibold text-heading">{content}</strong>}</Fragment>
  })
}

export function PrivacyPolicy() {
  return (
    <main className="px-gutter py-section lg:px-gutter-lg lg:py-section-lg">
      <article className="mx-auto w-full max-w-[46rem]">
        <a
          href={import.meta.env.BASE_URL}
          className="mb-xl inline-flex min-h-11 items-center gap-xs rounded-sm text-meta text-heading underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <TbArrowLeft aria-hidden="true" className="size-4" />
          Voltar para a página do webinário
        </a>

        <Logo className="w-[clamp(11rem,20vw,15rem)]" />

        <h1 className="mt-xl text-headline font-bold text-balance text-heading">Política de Privacidade</h1>
        <p className="mt-xs font-form text-meta text-heading/70">Última atualização: {PRIVACY.updatedAt}</p>

        <div className="mt-lg font-form text-body text-pretty">
          <p>
            <Text parts={POLICY_INTRO} />
          </p>

          <nav aria-label="Seções da política" className="mt-xl rounded-2xl border border-heading/15 p-lg">
            <p className="mb-sm text-label font-bold uppercase tracking-label text-heading">Nesta página</p>
            <ol className="grid gap-x-lg gap-y-xs text-meta sm:grid-cols-2">
              {POLICY_SECTIONS.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-accent underline-offset-4 hover:underline">
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {POLICY_SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="mt-xl scroll-mt-lg">
              <h2 className="mb-md font-sans text-statement font-bold text-balance text-heading">{section.title}</h2>
              {section.blocks.map((block, i) =>
                'p' in block ? (
                  <p key={i} className="mb-md">
                    <Text parts={block.p} />
                  </p>
                ) : (
                  <ul key={i} className="mb-md grid list-disc gap-xs pl-lg marker:text-accent">
                    {block.list.map((item, j) => (
                      <li key={j}>
                        <Text parts={item} />
                      </li>
                    ))}
                  </ul>
                ),
              )}
            </section>
          ))}
        </div>
      </article>
    </main>
  )
}
