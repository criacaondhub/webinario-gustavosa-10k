import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { TbChevronDown, TbX } from 'react-icons/tb'
import { CONFIG, CONTENT } from '@/config/content'
import { PRIVACY } from '@/config/privacy'
import { ctaClass } from '@/components/ui/CtaButton'
import { LeadModalContext } from '@/lib/lead-modal'
import { cn } from '@/lib/utils'

const { form } = CONTENT

type Values = {
  name: string
  email: string
  whatsapp: string
  instagram: string
  graduated: string
  clinic: string
  specialty: string
  revenue: string
  consent: boolean
}
type Field = keyof Values
type Errors = Partial<Record<Field, string>>

const EMPTY: Values = { name: '', email: '', whatsapp: '', instagram: '', graduated: '', clinic: '', specialty: '', revenue: '', consent: false }
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

/** (11) 91234-5678 */
function maskWhatsapp(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d && `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function maskInstagram(value: string) {
  const handle = value.replace(/[@\s]/g, '')
  return handle && `@${handle}`
}

function validate(v: Values): Errors {
  const e: Errors = {}
  if (!v.name.trim()) e.name = form.errors.required
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = v.email.trim() ? form.errors.email : form.errors.required
  const phone = v.whatsapp.replace(/\D/g, '')
  if (phone.length < 10) e.whatsapp = phone ? form.errors.whatsapp : form.errors.required
  if (!/^@[A-Za-z0-9._]{1,30}$/.test(v.instagram)) e.instagram = v.instagram ? form.errors.instagram : form.errors.required
  if (!v.graduated) e.graduated = form.errors.choice
  if (!v.clinic) e.clinic = form.errors.choice
  if (!v.specialty.trim()) e.specialty = form.errors.required
  if (!v.revenue) e.revenue = form.errors.choice
  if (!v.consent) e.consent = form.consent.error
  return e
}

/** Envia para a API (api/server.mjs → POST /api/inscricao). `honeypot` = campo invisível que só robôs preenchem. */
async function send(values: Values, honeypot: string) {
  const params = new URLSearchParams(window.location.search)
  const payload: Record<string, string | boolean> = {
    nome: values.name.trim(),
    email: values.email.trim(),
    whatsapp: values.whatsapp,
    instagram: values.instagram,
    formado_medicina: values.graduated,
    clinica_propria: values.clinic,
    especialidade: values.specialty.trim(),
    faturamento: values.revenue,
    pagina: window.location.href,
    consentimento: values.consent,
    politica_versao: PRIVACY.version,
    empresa: honeypot,
  }
  UTM_KEYS.forEach((key) => (payload[key] = params.get(key) ?? ''))

  const res = await fetch(CONFIG.FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

const inputClass =
  'h-12 w-full rounded-lg border border-heading/20 bg-heading/[0.03] px-md text-body text-heading placeholder:text-heading/40 transition-colors focus:border-accent focus:outline-2 focus:outline-offset-0 focus:outline-accent/25 aria-invalid:border-red-700'

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const uid = useId()
  const id = (field: string) => `${uid}-${field}`

  const show = useCallback(() => {
    setStatus('idle')
    dialogRef.current?.showModal()
    dialogRef.current?.focus() // foco no painel, sem anel de foco no botão fechar
    setOpen(true)
  }, [])

  const close = () => dialogRef.current?.close()

  // Voltar da página de obrigado restaura a página do cache (bfcache): libera o botão de envio
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => e.persisted && setStatus('idle')
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])

  // Trava a rolagem da página com o pop-up aberto
  useEffect(() => {
    if (!open) return
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const update = <K extends Field>(field: K, value: Values[K]) => {
    const next = { ...values, [field]: value }
    setValues(next)
    if (submitted) setErrors(validate(next))
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    const found = validate(values)
    setErrors(found)
    const first = (Object.keys(found) as Field[])[0]
    if (first) {
      dialogRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    setStatus('sending')
    const honeypot = new FormData(event.currentTarget).get('empresa')
    try {
      await send(values, typeof honeypot === 'string' ? honeypot : '')
    } catch {
      setStatus('error')
      return
    }
    window.fbq?.('track', 'Lead')
    window.location.assign(CONFIG.THANK_YOU_URL)
  }

  const errorFor = (field: Field) =>
    errors[field] ? (
      <p id={id(`${field}-error`)} className="mt-xs text-label text-red-700">
        {errors[field]}
      </p>
    ) : null

  const a11y = (field: Field) => ({
    name: field,
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? id(`${field}-error`) : undefined,
  })

  const textField = (field: 'name' | 'email' | 'whatsapp' | 'instagram' | 'specialty', props: { type?: string; inputMode?: 'email' | 'tel' | 'text'; autoComplete?: string; placeholder?: string; mask?: (v: string) => string }) => (
    <div>
      <label htmlFor={id(field)} className="mb-xs block text-meta font-semibold text-heading">
        {form.fields[field]}
      </label>
      <input
        id={id(field)}
        type={props.type ?? 'text'}
        inputMode={props.inputMode}
        autoComplete={props.autoComplete}
        placeholder={props.placeholder}
        value={values[field]}
        onChange={(e) => update(field, props.mask ? props.mask(e.target.value) : e.target.value)}
        className={inputClass}
        {...a11y(field)}
      />
      {errorFor(field)}
    </div>
  )

  const choiceField = (field: 'graduated' | 'clinic') => (
    <fieldset aria-describedby={errors[field] ? id(`${field}-error`) : undefined}>
      <legend className="mb-xs text-meta font-semibold text-heading">{form.fields[field]}</legend>
      <div className="flex flex-wrap gap-xs">
        {form.options[field].map((option) => (
          <label
            key={option}
            className="flex min-h-11 cursor-pointer items-center gap-xs rounded-lg border border-heading/20 bg-heading/[0.03] px-md py-xs text-meta text-heading transition-colors has-checked:border-accent has-checked:bg-accent/10 has-focus-visible:outline-2 has-focus-visible:outline-accent/40"
          >
            <input
              type="radio"
              name={field}
              value={option}
              checked={values[field] === option}
              onChange={() => update(field, option)}
              className="size-4 accent-accent"
            />
            {option}
          </label>
        ))}
      </div>
      {errorFor(field)}
    </fieldset>
  )

  return (
    <LeadModalContext.Provider value={show}>
      {children}

      <dialog
        ref={dialogRef}
        aria-labelledby={id('title')}
        tabIndex={-1}
        data-lenis-prevent
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2*var(--spacing-gutter))] max-w-[34rem] overflow-y-auto overscroll-contain rounded-2xl bg-background p-0 font-form text-text shadow-[0_24px_60px_-20px_rgb(40_55_74/0.45)] outline-none [scrollbar-width:thin] backdrop:bg-heading/60 backdrop:backdrop-blur-sm"
      >
        <div className="relative px-gutter py-xl sm:px-xl">
          <button
            type="button"
            onClick={close}
            aria-label={form.close}
            className="absolute top-sm right-sm grid size-11 place-items-center rounded-full text-heading transition-colors hover:bg-heading/10 focus-visible:outline-2 focus-visible:outline-accent"
          >
            <TbX aria-hidden="true" className="size-5" />
          </button>

          <h2 id={id('title')} className="pr-xl text-statement font-bold text-balance text-heading">
            {form.title}
          </h2>

          <p className="mt-xs mb-lg text-meta text-pretty">{form.subtitle}</p>

          <form noValidate onSubmit={onSubmit} className="grid gap-md">
            {textField('name', { autoComplete: 'name' })}
            {textField('email', { type: 'email', inputMode: 'email', autoComplete: 'email', placeholder: 'voce@email.com' })}
            <div className="grid gap-md sm:grid-cols-2">
              {textField('whatsapp', { type: 'tel', inputMode: 'tel', autoComplete: 'tel-national', placeholder: '(11) 91234-5678', mask: maskWhatsapp })}
              {textField('instagram', { autoComplete: 'off', placeholder: '@seuperfil', mask: maskInstagram })}
            </div>
            {choiceField('graduated')}
            {choiceField('clinic')}
            {textField('specialty', { placeholder: 'Ex.: Dermatologia' })}

            <div>
              <label htmlFor={id('revenue')} className="mb-xs block text-meta font-semibold text-heading">
                {form.fields.revenue}
              </label>
              <div className="relative">
                <select
                  id={id('revenue')}
                  value={values.revenue}
                  onChange={(e) => update('revenue', e.target.value)}
                  className={cn(inputClass, 'appearance-none pr-xl', !values.revenue && 'text-heading/40')}
                  {...a11y('revenue')}
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  {form.options.revenue.map((option) => (
                    <option key={option} value={option} className="text-heading">
                      {option}
                    </option>
                  ))}
                </select>
                <TbChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-md size-5 -translate-y-1/2 text-heading" />
              </div>
              {errorFor('revenue')}
            </div>

            <div>
              <label className="flex cursor-pointer items-start gap-sm text-meta text-pretty text-heading">
                <input
                  type="checkbox"
                  checked={values.consent}
                  onChange={(e) => update('consent', e.target.checked)}
                  className="mt-[3px] size-5 shrink-0 cursor-pointer accent-accent"
                  {...a11y('consent')}
                />
                <span>
                  {form.consent.before}
                  <a
                    href={CONFIG.PRIVACY_URL}
                    target="_blank"
                    rel="noopener"
                    className="font-semibold text-accent underline underline-offset-2 hover:text-accent-hover"
                  >
                    {form.consent.link}
                  </a>
                  {form.consent.after}
                </span>
              </label>
              {errorFor('consent')}
            </div>

            {/* Honeypot: fora da tela e da navegação por teclado — só robôs preenchem */}
            <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
              <label>
                Empresa
                <input type="text" name="empresa" tabIndex={-1} autoComplete="off" defaultValue="" />
              </label>
            </div>

            {status === 'error' && (
              <p role="alert" className="text-meta text-red-700">
                {form.errors.submit}
              </p>
            )}

            <button type="submit" disabled={status === 'sending'} className={cn(ctaClass, 'mt-xs max-w-none font-form justify-center disabled:cursor-wait disabled:opacity-70')}>
              {status === 'sending' ? form.sending : form.submit}
            </button>
          </form>
        </div>
      </dialog>
    </LeadModalContext.Provider>
  )
}
