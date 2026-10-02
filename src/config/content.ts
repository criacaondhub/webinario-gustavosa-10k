export const CONFIG = {
  // ⚠️ PENDENTE — preencher antes do deploy
  GROUP_URL: '⚠️ PENDENTE', // link do grupo de WhatsApp (destino de todos os CTAs)
  CONTACT_EMAIL: '⚠️ PENDENTE',
  DOMAIN: '⚠️ PENDENTE',
  EVENT_DATE: '[DATA]', // ⚠️ PENDENTE — ex.: "06 de Outubro"

  COMPANY_NAME: 'Dr. Gustavo Sá',
  EVENT_NAME: 'Protocolo 10K',
  EVENT_TIME: '19h00',
  EVENT_PLATFORM: 'Google Meet',
} as const

/** Valores ainda não preenchidos começam com ⚠️ */
export const isPending = (value: string) => value === '#' || value.startsWith('⚠️')

export type MediaAsset = {
  file: string
  alt: string
  label: string
  size: string
  ratio: string
}

export const ASSETS = {
  logo: {
    positive: 'assets/logo-positivo.svg',
    negative: 'assets/logo-negativo.svg',
    alt: 'Protocolo 10K',
    width: 842.81,
    height: 149.71,
  },
  portrait: {
    file: 'assets/gustavo-retrato.webp',
    alt: 'Dr. Gustavo Sá',
    label: 'Retrato do especialista',
    size: '1200 × 1600 px',
    ratio: '3:4 (vertical)',
  },
  speaker: {
    file: 'assets/gustavo-ambiente.webp',
    alt: 'Dr. Gustavo Sá em ambiente profissional',
    label: 'Foto em ambiente profissional',
    size: '1200 × 1400 px',
    ratio: '6:7 (vertical)',
  },
} as const

/** bold = negrito navy · accent = negrito amarelo do projeto */
export type HeadlinePart = { text: string; emphasis?: 'bold' | 'accent' }

export const CONTENT = {
  hero: {
    date: [
      { icon: 'calendar', text: CONFIG.EVENT_DATE },
      { icon: 'clock', text: CONFIG.EVENT_TIME },
      { icon: 'video', text: `Sala fechada no ${CONFIG.EVENT_PLATFORM}` },
    ],
    headline: [
      { text: 'Aprenda em um ' },
      { text: 'passo a passo', emphasis: 'bold' },
      { text: ' como ganhar ' },
      { text: '10 mil seguidores', emphasis: 'accent' },
      { text: ' até o fim do ano', emphasis: 'bold' },
      { text: ', mesmo que hoje quase ninguém veja seus posts.' },
    ] as HeadlinePart[],
    intro:
      'Numa sala fechada e ao vivo, eu mostro de onde tiro as pautas de todo dia, quais formatos uso e como você replica isso no seu perfil a partir do dia seguinte.',
    cta: 'QUERO ENTRAR NO GRUPO DO WEBINÁRIO',
    portraitNote: { name: 'Dr. Gustavo Sá', role: 'Nutrólogo', reach: '280 mil seguidores' },
  },
} as const
