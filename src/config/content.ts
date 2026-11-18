export const CONFIG = {
  GROUP_URL: 'https://chat.whatsapp.com/CYDohqRxTJQGYCaaMTarBv', // grupo de WhatsApp do webinário
  FORM_ENDPOINT: `${import.meta.env.BASE_URL}api/inscricao`, // API própria (pasta api/) → Postgres; leads no /dash
  THANK_YOU_URL: `${import.meta.env.BASE_URL}obrigado/`, // destino depois do envio do formulário — obrigado/index.html (relativo: funciona no localhost e em produção)
  PRIVACY_URL: `${import.meta.env.BASE_URL}politica-de-privacidade/`, // politica-de-privacidade/index.html
  DOMAIN: 'https://dr.gustavosa.com.br/protocolo-10k', // espelhado em .env.production (VITE_SITE_URL) e no base do vite.config.ts
  EVENT_DATE: '25 de Novembro',

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
    file: asset('section-2-dr-gustavo.webp'), // foto da dobra 2 — arquivo do cliente (2400×2400)
    alt: 'Dr. Gustavo Sá sorrindo, sentado à mesa do consultório',
    label: 'Foto em ambiente profissional',
    size: '2400 × 2400 px',
    ratio: '1:1 (quadrada)',
  },
  proof: {
    metrics: { file: asset('metrica-dr-gustavo.webp'), width: 736, height: 852, alt: 'Painel do Instagram do Dr. Gustavo Sá nos últimos 30 dias: 298.068 seguidores, +10.862 seguidores líquidos e curva de crescimento em novembro' },
    profile: { file: asset('perfil-dr-gustavo.webp'), width: 564, height: 248, alt: 'Perfil @drgustavosa no Instagram: 3.046 posts e 298 mil seguidores' },
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
      { text: 'Aprenda como ' },
      { text: 'ganhar 10 mil seguidores', emphasis: 'accent' },
      { text: ' em ' },
      { text: 'menos de 90 dias,', emphasis: 'accent' },
      { text: ' mesmo que você tenha ' },
      { text: 'pouco tempo, poucos seguidores', emphasis: 'accent' },
      { text: ' e até mesmo, ' },
      { text: 'pouca familiaridade com a produção de conteúdo.', emphasis: 'accent' },
    ] as HeadlinePart[],
    intro: [
      { text: 'Vou te mostrar os ' },
      { text: 'mecanismos', emphasis: 'bold' },
      { text: ' por trás de conteúdos que engajam, geram demanda qualificada e seguidores engajados. Tudo isso em uma ' },
      { text: 'Imersão Fechada', emphasis: 'bold' },
      { text: ' e exclusiva para médicos.' },
    ] as HeadlinePart[],
    cta: 'CLIQUE PARA GARANTIR UMA DAS VAGAS LIMITADAS',
    progress: { value: 39, label: '39% das vagas já foram preenchidas' },
    portraitNote: { name: 'Dr. Gustavo Sá', role: 'Nutrólogo', reach: '298 mil seguidores' },
  },
  about: {
    label: 'QUEM VAI TE MOSTRAR ISSO:',
    name: 'Dr. Gustavo Sá',
    lead: 'O médico que foi pioneiro no Mounjaro no Brasil e construiu uma clínica de R$ 15 milhões por ano do zero.',
    bio: [
      'Nutrólogo, CEO do Instituto LongLife, pós-graduado em Nutrologia e Psiquiatria pelo Hospital Albert Einstein, com passagem pelo Trinity College Dublin e MBA pela Link School of Business.',
      'Palestrante em instituições como Harvard, Yale e Trinity College. Homenageado pela Assembleia Legislativa de São Paulo com a Medalha de Honra ao Mérito Legislativo em 2025.',
      'Quando quase ninguém no Brasil falava em Mounjaro, ele já acompanhava pacientes com o medicamento. Pioneiro na prática, assim como está sendo no peptídeo.',
      'Mais de 50 milhões faturados nos últimos 12 meses. Mais de 298 mil seguidores, referência no Brasil sobre nutrologia.',
      'Foi essa vivência de clínica, de protocolo, de resultado real que deu origem a essa imersão. Não é teoria. É o que ele faz todo dia, aberto pra você pela primeira vez.',
    ],
    closing: 'O que eu fiz para chegar em 298 mil seguidores, pela primeira vez será revelado para médicos que querem crescer.',
    cta: 'GARANTIR MINHA VAGA NA IMERSÃO',
    ctaNote: '100% gratuito e AO VIVO',
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
      { text: '10 mil seguidores', emphasis: 'accent' },
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
