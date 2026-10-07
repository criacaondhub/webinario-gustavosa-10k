export const CONFIG = {
  GROUP_URL: 'https://chat.whatsapp.com/CYDohqRxTJQGYCaaMTarBv', // grupo de WhatsApp do webinário
  FORM_ENDPOINT: `${import.meta.env.BASE_URL}api/inscricao`, // API própria (pasta api/) → Postgres; leads no /dash
  THANK_YOU_URL: `${import.meta.env.BASE_URL}obrigado/`, // destino depois do envio do formulário — obrigado/index.html (relativo: funciona no localhost e em produção)
  PRIVACY_URL: `${import.meta.env.BASE_URL}politica-de-privacidade/`, // politica-de-privacidade/index.html
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
    file: asset('banner-hero_V2.webp'), // banner full do Hero — arquivo fornecido pelo cliente (2304×1296)
    width: 2304,
    height: 1296,
    mobile: { file: asset('banner-hero-mobile_V2.webp'), width: 1080, height: 747 }, // abaixo de 640px — arquivo do cliente
    alt: 'Dr. Gustavo Sá sorrindo, de braços cruzados',
  },
  thankYouBanner: {
    file: asset('banner-hero_Obrigado.webp'), // fundo da página de obrigado — arquivo do cliente (2304×1296)
    width: 2304,
    height: 1296,
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
      { text: 'Aprenda como ganhar ' },
      { text: '10 mil seguidores', emphasis: 'accent' },
      { text: ' até o fim do ano', emphasis: 'accent' },
      { text: ' mesmo que você tenha pouco tempo, poucos seguidores e até mesmo, pouca familiaridade com a produção de conteúdo.' },
    ] as HeadlinePart[],
    intro:
      'Vou te mostrar como o segredo por trás de conteúdos que engajam, geram demanda qualificada e seguidores engajados. Tudo isso em uma aula fechada e exclusiva para médicos.',
    cta: 'Quero participar do Webinário',
    progress: { value: 78, label: '78% das vagas já foram preenchidas' },
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
  form: {
    title: 'Garanta sua vaga no webinário',
    subtitle: 'Preencha os dados abaixo para participar da aula fechada.',
    fields: {
      name: 'Nome',
      email: 'E-mail',
      whatsapp: 'WhatsApp',
      instagram: '@ do Instagram',
      graduated: 'Você é formado em medicina?',
      clinic: 'Você possui clínica própria?',
      specialty: 'Qual a sua especialidade?',
      revenue: 'Qual a média do seu faturamento mensal?',
    },
    options: {
      graduated: ['Sim', 'Não, ainda estou cursando'],
      clinic: ['Sim', 'Não'],
      revenue: [
        'Menos de R$30k',
        'Entre R$30k a R$40k',
        'Entre R$40k a R$75k',
        'Entre R$75k a R$100k',
        'Entre R$100k a R$150k',
        'Mais de R$150k',
      ],
    },
    errors: {
      required: 'Campo obrigatório.',
      email: 'Informe um e-mail válido.',
      whatsapp: 'Informe o WhatsApp com DDD.',
      instagram: 'Informe um @ válido.',
      choice: 'Escolha uma opção.',
      submit: 'Não conseguimos enviar agora. Confira sua conexão e tente de novo.',
    },
    consent: {
      before: 'Li e concordo com a ',
      link: 'Política de Privacidade',
      after: ' e autorizo o contato por e-mail e WhatsApp sobre o webinário e conteúdos do Dr. Gustavo Sá.',
      error: 'Para se inscrever, aceite a Política de Privacidade.',
    },
    submit: 'Quero participar do Webinário',
    sending: 'Enviando…',
    close: 'Fechar',
  },
  thankYou: {
    headline: [
      { text: 'Você conseguiu garantir uma das vagas limitadas no nosso Webinário Exclusivo para aprender a como ganhar ' },
      { text: '10 mil seguidores até o final do ano', emphasis: 'accent' },
      { text: '.' },
    ] as HeadlinePart[],
    intro: ['Clique no botão abaixo e entre no Grupo Vip para', 'ter acesso a todas as informações e o link da aula.'], // quebra de linha a partir do tablet
    introHighlight: 'Grupo Vip', // negrito azul (accent) dentro do H2
    cta: 'ENTRAR NO GRUPO VIP DO WHATSAPP',
  },
  footer: {
    info: `${CONFIG.EVENT_DATE} · ${CONFIG.EVENT_TIME} · ${CONFIG.EVENT_PLATFORM}`,
    privacy: 'Política de Privacidade',
    credit: { prefix: 'Desenvolvido por: ', name: 'Nova Dimensão', url: 'https://med.novadimensaohub.com.br' },
  },
} as const
