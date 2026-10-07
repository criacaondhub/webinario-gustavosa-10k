import { CONFIG } from '@/config/content'

/**
 * Política de Privacidade (LGPD — Lei nº 13.709/2018) — página /protocolo-10k/politica-de-privacidade/
 *
 * `version` é gravada junto com cada inscrição (prova do consentimento). Ao mudar o texto da política,
 * atualize `version` e `updatedAt` — as inscrições novas passam a registrar a nova versão.
 *
 * Valores que começarem com ⚠️ aparecem destacados na página (pendentes de revisão).
 */
export const PRIVACY = {
  version: '2026-10-07',
  updatedAt: '7 de outubro de 2026',

  controller: {
    name: 'Dr. Gustavo Sá',
    legalName: 'Dr. Gustavo Sá',
    document: 'CRM 218406-SP',
    address: 'Av. Santo Amaro, 3432 — Brooklin, São Paulo/SP',
  },
  /** Encarregado pelo tratamento de dados pessoais (DPO) — canal para o titular exercer os direitos */
  dpo: {
    name: 'Julio dos Santos Lara',
    email: 'julio@novadimensaodigital.com.br',
  },
  /** Prazo de guarda dos dados de inscrição */
  retention: '24 (vinte e quatro) meses contados da inscrição',
} as const

/** Trecho de texto; `strong` = negrito */
export type PolicyText = string | { strong: string }
export type PolicyBlock = { p: PolicyText[] } | { list: PolicyText[][] }
export type PolicySection = { id: string; title: string; blocks: PolicyBlock[] }

const { controller, dpo } = PRIVACY

export const POLICY_INTRO: PolicyText[] = [
  'Esta Política de Privacidade explica como os dados pessoais informados na inscrição do webinário ',
  { strong: CONFIG.EVENT_NAME },
  ` são coletados, usados, armazenados e protegidos, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018). Ao se inscrever, você declara que leu e compreendeu este documento.`,
]

export const POLICY_SECTIONS: PolicySection[] = [
  {
    id: 'controlador',
    title: '1. Quem é o responsável pelos seus dados',
    blocks: [
      {
        p: [
          'O controlador dos dados pessoais tratados nesta página é ',
          // Controlador pessoa física: só o nome (sem razão social repetida) e o registro profissional (CRM)
          { strong: controller.legalName === controller.name ? controller.name : `${controller.name} — ${controller.legalName}` },
          `, médico inscrito sob o registro ${controller.document}, com endereço profissional em ${controller.address}.`,
        ],
      },
      {
        p: [
          'O encarregado pelo tratamento de dados pessoais (DPO) é ',
          { strong: dpo.name },
          `, que pode ser contatado pelo e-mail `,
          { strong: dpo.email },
          '.',
        ],
      },
    ],
  },
  {
    id: 'dados-coletados',
    title: '2. Quais dados coletamos',
    blocks: [
      { p: ['Coletamos apenas os dados necessários para a sua inscrição e para o contato sobre o webinário:'] },
      {
        list: [
          [{ strong: 'Dados de identificação e contato: ' }, 'nome, e-mail, número de WhatsApp e perfil do Instagram.'],
          [
            { strong: 'Dados profissionais: ' },
            'se você é formado em medicina, se possui clínica própria, sua especialidade e a faixa de faturamento mensal.',
          ],
          [
            { strong: 'Dados técnicos da inscrição: ' },
            'data e hora do envio, página de origem, parâmetros de campanha (UTM) e tipo de navegador/dispositivo.',
          ],
          [
            { strong: 'Registro do consentimento: ' },
            'data e hora em que você aceitou esta política e a versão aceita.',
          ],
        ],
      },
      {
        p: [
          'Não coletamos dados pessoais sensíveis (como dados de saúde, origem racial ou étnica, convicção religiosa ou opinião política), nem dados de pacientes.',
        ],
      },
    ],
  },
  {
    id: 'finalidades',
    title: '3. Para que usamos seus dados',
    blocks: [
      {
        list: [
          ['Confirmar a sua inscrição e garantir a sua vaga no webinário.'],
          ['Enviar o link de acesso, lembretes e avisos sobre a aula por e-mail e WhatsApp.'],
          ['Entender o perfil do público (especialidade, estágio da carreira e porte do consultório) para adequar o conteúdo.'],
          [
            'Enviar, com o seu consentimento, conteúdos, convites e ofertas relacionados aos produtos e serviços educacionais do Dr. Gustavo Sá.',
          ],
          ['Medir o desempenho das campanhas de divulgação (de qual canal a inscrição veio).'],
          ['Prevenir fraudes, envios automatizados (robôs) e garantir a segurança da página.'],
        ],
      },
    ],
  },
  {
    id: 'bases-legais',
    title: '4. Bases legais',
    blocks: [
      { p: ['Tratamos seus dados com fundamento nas seguintes bases legais do art. 7º da LGPD:'] },
      {
        list: [
          [{ strong: 'Consentimento (inciso I): ' }, 'para o cadastro e o envio de comunicações sobre o webinário e conteúdos relacionados.'],
          [
            { strong: 'Procedimentos preliminares a pedido do titular (inciso V): ' },
            'para viabilizar a sua participação no evento em que você se inscreveu.',
          ],
          [
            { strong: 'Legítimo interesse (inciso IX): ' },
            'para medir campanhas e manter a segurança da página, sempre respeitando os seus direitos e expectativas.',
          ],
          [{ strong: 'Cumprimento de obrigação legal (inciso II): ' }, 'quando a lei exigir a guarda ou a apresentação de registros.'],
        ],
      },
    ],
  },
  {
    id: 'compartilhamento',
    title: '5. Com quem compartilhamos',
    blocks: [
      {
        p: [
          { strong: 'Não vendemos nem alugamos seus dados pessoais. ' },
          'Eles podem ser acessados apenas por quem precisa deles para as finalidades acima:',
        ],
      },
      {
        list: [
          ['Equipe do Dr. Gustavo Sá responsável pelo atendimento e pela organização do webinário.'],
          [
            'Prestadores de serviço que atuam como operadores, sob dever de confidencialidade: hospedagem e infraestrutura do servidor, e a agência Nova Dimensão, responsável pelo desenvolvimento e pela manutenção técnica da página.',
          ],
          [
            'Plataformas usadas no evento — Google (Google Meet) e Meta (WhatsApp) — conforme as políticas de privacidade próprias, quando você acessa a sala ou entra no grupo.',
          ],
          ['Autoridades públicas, quando houver obrigação legal ou ordem judicial.'],
        ],
      },
    ],
  },
  {
    id: 'transferencia-internacional',
    title: '6. Transferência internacional',
    blocks: [
      {
        p: [
          'Algumas plataformas citadas (Google e Meta) podem armazenar dados em servidores fora do Brasil. Nesses casos, a transferência ocorre nas hipóteses do art. 33 da LGPD, com empresas que adotam padrões de proteção compatíveis com a lei brasileira.',
        ],
      },
    ],
  },
  {
    id: 'seguranca',
    title: '7. Como protegemos seus dados',
    blocks: [
      {
        list: [
          ['Conexão criptografada (HTTPS) em todas as páginas e no envio do formulário.'],
          ['Banco de dados em rede interna, sem acesso pela internet.'],
          ['Acesso aos dados restrito a pessoas autorizadas, com usuário e senha.'],
          ['Cópias de segurança periódicas, com descarte automático das antigas.'],
        ],
      },
      {
        p: [
          'Nenhum sistema é totalmente imune a incidentes. Se ocorrer um incidente de segurança que possa gerar risco ou dano relevante, comunicaremos os titulares afetados e a Autoridade Nacional de Proteção de Dados (ANPD), conforme o art. 48 da LGPD.',
        ],
      },
    ],
  },
  {
    id: 'retencao',
    title: '8. Por quanto tempo guardamos',
    blocks: [
      {
        p: [
          `Os dados de inscrição são mantidos pelo prazo de ${PRIVACY.retention}, ou até que você revogue o consentimento ou peça a exclusão — o que ocorrer primeiro. Depois disso, são excluídos ou anonimizados, salvo quando a guarda for exigida por lei.`,
        ],
      },
    ],
  },
  {
    id: 'direitos',
    title: '9. Seus direitos',
    blocks: [
      { p: ['Nos termos do art. 18 da LGPD, você pode, a qualquer momento e gratuitamente:'] },
      {
        list: [
          ['Confirmar se tratamos seus dados e acessá-los.'],
          ['Corrigir dados incompletos, inexatos ou desatualizados.'],
          ['Pedir a anonimização, o bloqueio ou a eliminação de dados desnecessários ou tratados em desconformidade com a lei.'],
          ['Pedir a portabilidade dos dados a outro fornecedor.'],
          ['Pedir a eliminação dos dados tratados com base no seu consentimento.'],
          ['Saber com quais entidades compartilhamos seus dados.'],
          ['Ser informado sobre a possibilidade de não dar o consentimento e sobre as consequências da negativa.'],
          ['Revogar o consentimento.'],
          ['Opor-se a tratamento realizado em desconformidade com a lei.'],
        ],
      },
      {
        p: [
          'Para exercer qualquer um desses direitos, envie um e-mail para ',
          { strong: dpo.email },
          '. Podemos pedir informações para confirmar a sua identidade antes de atender ao pedido. Responderemos em até 15 (quinze) dias. Você também pode apresentar reclamação à ANPD (www.gov.br/anpd).',
        ],
      },
    ],
  },
  {
    id: 'consentimento',
    title: '10. Como revogar o consentimento',
    blocks: [
      {
        p: [
          'Você pode retirar o consentimento a qualquer momento, pelo e-mail do encarregado ou respondendo a qualquer mensagem nossa pedindo para não receber mais comunicações. A revogação não afeta o tratamento feito antes dela. Sem o consentimento, não conseguiremos enviar o link e os avisos do webinário.',
        ],
      },
    ],
  },
  {
    id: 'cookies',
    title: '11. Cookies e tecnologias semelhantes',
    blocks: [
      {
        p: [
          'A página de inscrição não usa cookies de publicidade. Fontes tipográficas são carregadas do Google Fonts, o que envia ao Google dados técnicos da conexão (como o endereço IP). Se passarmos a usar ferramentas de medição de anúncios (como o Pixel da Meta), esta política será atualizada antes.',
        ],
      },
    ],
  },
  {
    id: 'menores',
    title: '12. Público',
    blocks: [
      {
        p: [
          'O webinário é destinado a médicos e estudantes de medicina maiores de 18 anos. Não coletamos intencionalmente dados de crianças ou adolescentes.',
        ],
      },
    ],
  },
  {
    id: 'alteracoes',
    title: '13. Alterações desta política',
    blocks: [
      {
        p: [
          'Esta política pode ser atualizada para refletir mudanças legais ou no tratamento dos dados. A versão vigente estará sempre nesta página, com a data da última atualização. Mudanças relevantes que dependam de novo consentimento serão comunicadas antes de entrar em vigor.',
        ],
      },
    ],
  },
]
