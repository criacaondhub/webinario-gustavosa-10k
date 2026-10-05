export const CONFIG = {
  // ⚠️ PENDENTE — preencher antes do deploy
  GROUP_URL: 'https://chat.whatsapp.com/CYDohqRxTJQGYCaaMTarBv', // grupo de WhatsApp (destino de todos os CTAs)
  DOMAIN: 'https://dr.gustavosa.com.br/protocolo-10k', // espelhado em .env.production (VITE_SITE_URL) e no base do vite.config.ts
  EVENT_DATE: '20 de Outubro',

  COMPANY_NAME: 'Dr. Gustavo Sá',
  EVENT_NAME: 'Protocolo 10K',
  EVENT_TIME: '19h30',
  EVENT_PLATFORM: 'Google Meet',
} as const

/** Caminho de um arquivo de public/assets já com a subpasta de publicação (/protocolo-10k/) */
const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`

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
    positive: asset('logo-protocolo-horizontal.svg'),
    negative: asset('logo-protocolo-horizontal-negativo.svg'), // gerado do horizontal com as duas cores em #f0ede4 (rodapé azul)
    alt: 'Protocolo 10K',
    width: 560.58,
    height: 68.29,
  },
  banner: {
    file: asset('banner-hero.webp'), // banner full do Hero — arquivo fornecido pelo cliente (2304×1296)
    width: 2304,
    height: 1296,
    mobile: { file: asset('banner-hero-mobile.webp'), width: 1080, height: 747 }, // abaixo de 640px — arquivo do cliente
    alt: 'Dr. Gustavo Sá sorrindo, de braços cruzados',
  },
  speaker: {
    file: asset('Imagem-02.webp'),
    alt: 'Dr. Gustavo Sá em ambiente profissional',
    label: 'Foto em ambiente profissional',
    size: '1200 × 1400 px',
    ratio: '6:7 (vertical)',
  },
} as const

/** bold = negrito grafite · accent = negrito azul do projeto */
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
    micro: ['Sem formulário, sem e-mail, sem enrolação.', 'O botão te leva direto pro grupo fechado do webinário.'],
    portraitNote: { name: 'Dr. Gustavo Sá', role: 'Nutrólogo', reach: '280 mil seguidores' },
  },
  about: {
    label: 'QUEM VAI TE MOSTRAR ISSO:',
    name: 'Dr. Gustavo Sá',
    bio: [
      'Nutrólogo e CEO do Instituto LongLife, chegou a 280 mil seguidores falando do que passa pelo consultório dele, das canetas à rotina do dia.',
    ],
    closing: 'O que ele faz no próprio perfil todo dia, aberto pra você nesse webinário.',
    cta: 'QUERO MINHA VAGA NA SALA',
  },
  footer: {
    info: `${CONFIG.EVENT_DATE} · ${CONFIG.EVENT_TIME} · ${CONFIG.EVENT_PLATFORM}`,
    credit: { prefix: 'Desenvolvido por: ', name: 'Nova Dimensão', url: 'https://med.novadimensaohub.com.br' },
  },
} as const
