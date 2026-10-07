/**
 * Recebe o formulário do pop-up da LP Protocolo 10K e grava uma linha por inscrição.
 *
 * Como publicar:
 * 1. Crie uma Planilha Google → Extensões → Apps Script → cole este arquivo.
 * 2. Implantar → Nova implantação → Tipo: App da Web
 *    - Executar como: Eu
 *    - Quem pode acessar: Qualquer pessoa
 * 3. Copie a URL do App da Web (termina em /exec) e cole em CONFIG.FORM_ENDPOINT (src/config/content.ts).
 * Ao alterar este script, publique uma NOVA versão da implantação (Gerenciar implantações → Editar → Nova versão).
 */

const SHEET_NAME = 'Inscrições'

const COLUMNS = [
  ['data', 'Data'],
  ['nome', 'Nome'],
  ['email', 'E-mail'],
  ['whatsapp', 'WhatsApp'],
  ['instagram', 'Instagram'],
  ['formado_medicina', 'Formado em medicina?'],
  ['clinica_propria', 'Clínica própria?'],
  ['especialidade', 'Especialidade'],
  ['faturamento', 'Faturamento mensal'],
  ['utm_source', 'utm_source'],
  ['utm_medium', 'utm_medium'],
  ['utm_campaign', 'utm_campaign'],
  ['utm_content', 'utm_content'],
  ['utm_term', 'utm_term'],
  ['pagina', 'Página'],
]

function doPost(e) {
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME)

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS.map(([, header]) => header))
      sheet.setFrozenRows(1)
    }

    const params = e.parameter || {}
    const row = COLUMNS.map(([key]) => {
      if (key === 'data') return new Date()
      // Prefixo ' evita que a planilha interprete o valor como fórmula
      const value = String(params[key] || '')
      return /^[=+\-@]/.test(value) ? "'" + value : value
    })
    sheet.appendRow(row)

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON)
  } finally {
    lock.releaseLock()
  }
}
