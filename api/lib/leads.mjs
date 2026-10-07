// Consultas do /dash sobre a tabela inscricoes

const COLUMNS = `id, nome, email, whatsapp, instagram, formado_medicina, clinica_propria, especialidade, faturamento,
  utm_source, utm_medium, utm_campaign, utm_content, utm_term, pagina, consentimento_em, politica_versao, criado_em`

const TZ = 'America/Sao_Paulo'

/** Valor do filtro de fonte que significa "chegou sem UTM" */
export const SEM_UTM = '__sem_utm'

/** Dias exibidos no gráfico de inscrições por dia */
const CHART_DAYS = 14

/** Monta o WHERE a partir da busca livre e dos filtros (faturamento, formado, clínica, fonte). */
function buildFilter({ q, faturamento, formado, clinica, fonte }) {
  const where = []
  const params = []

  const term = (q ?? '').trim().slice(0, 100)
  if (term) {
    params.push(`%${term}%`)
    // Telefone só com 4+ dígitos: um termo como "E2E" não pode virar busca por "%2%" no WhatsApp
    const digits = term.replace(/\D/g, '')
    const phoneClause = digits.length >= 4 ? ` OR whatsapp LIKE $${params.push(`%${digits}%`)}` : ''
    where.push(
      `(nome ILIKE $1 OR email ILIKE $1 OR instagram ILIKE $1 OR especialidade ILIKE $1` +
        ` OR utm_source ILIKE $1 OR utm_campaign ILIKE $1${phoneClause})`,
    )
  }

  const exact = (column, value) => value && where.push(`${column} = $${params.push(String(value).slice(0, 120))}`)
  exact('faturamento', faturamento)
  exact('formado_medicina', formado)
  exact('clinica_propria', clinica)
  if (fonte === SEM_UTM) where.push('utm_source IS NULL')
  else exact('utm_source', fonte)

  return { sql: where.length ? `WHERE ${where.join(' AND ')}` : '', params }
}

const breakdown = (pool, column) =>
  pool.query(`SELECT ${column} AS valor, count(*)::int AS total FROM inscricoes GROUP BY 1 ORDER BY total DESC, 1`)

export async function listLeads(pool, query) {
  const per = Math.min(Math.max(Number(query.per) || 25, 1), 100)
  const page = Math.max(Number(query.page) || 1, 1)
  const { sql, params } = buildFilter(query)

  const [rows, count, stats, perDay, faturamento, formado, clinica, fontes] = await Promise.all([
    pool.query(
      `SELECT ${COLUMNS} FROM inscricoes ${sql} ORDER BY criado_em DESC LIMIT ${per} OFFSET ${(page - 1) * per}`,
      params,
    ),
    pool.query(`SELECT count(*)::int AS total FROM inscricoes ${sql}`, params),
    pool.query(`
      SELECT
        count(*)::int AS total,
        count(*) FILTER (WHERE (criado_em AT TIME ZONE '${TZ}')::date = (now() AT TIME ZONE '${TZ}')::date)::int AS hoje,
        count(*) FILTER (WHERE criado_em >= now() - interval '7 days')::int AS ultimos_7_dias,
        count(*) FILTER (WHERE formado_medicina = 'Sim')::int AS formados,
        count(*) FILTER (WHERE clinica_propria = 'Sim')::int AS com_clinica
      FROM inscricoes`),
    // Série contínua (dias sem inscrição = 0) dos últimos CHART_DAYS dias, no fuso de Brasília
    pool.query(`
      SELECT to_char(d, 'YYYY-MM-DD') AS dia, count(i.id)::int AS total
      FROM generate_series(
        (now() AT TIME ZONE '${TZ}')::date - ${CHART_DAYS - 1},
        (now() AT TIME ZONE '${TZ}')::date,
        interval '1 day'
      ) AS d
      LEFT JOIN inscricoes i ON (i.criado_em AT TIME ZONE '${TZ}')::date = d::date
      GROUP BY d ORDER BY d`),
    breakdown(pool, 'faturamento'),
    breakdown(pool, 'formado_medicina'),
    breakdown(pool, 'clinica_propria'),
    // valor null = chegou sem UTM
    breakdown(pool, 'utm_source'),
  ])

  return {
    items: rows.rows,
    total: count.rows[0].total,
    page,
    per,
    stats: stats.rows[0],
    por_dia: perDay.rows,
    faturamento: faturamento.rows,
    formado: formado.rows,
    clinica: clinica.rows,
    fontes: fontes.rows,
  }
}

/** Exclusão definitiva (pedido do titular). Retorna false se o id não existe. */
export async function deleteLead(pool, id) {
  const { rowCount } = await pool.query('DELETE FROM inscricoes WHERE id = $1', [id])
  return rowCount > 0
}

// ─── CSV (Excel pt-BR: separador ";" e BOM UTF-8) ────────────────────────────

const CSV_HEADER = [
  'Data', 'Nome', 'E-mail', 'WhatsApp', 'Instagram', 'Formado em medicina?', 'Clínica própria?', 'Especialidade',
  'Faturamento mensal', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'UTM Content', 'UTM Term', 'Página',
  'Consentimento em', 'Versão da política',
]

const csvCell = (value) => {
  const text = value == null ? '' : String(value)
  // Neutraliza fórmulas (=, +, -, @) para o arquivo não executar nada ao abrir no Excel
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text
  return /[";\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

const formatDate = (date) =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: TZ }).format(date)

export async function exportLeadsCsv(pool, query) {
  const { sql, params } = buildFilter(query)
  const { rows } = await pool.query(`SELECT ${COLUMNS} FROM inscricoes ${sql} ORDER BY criado_em DESC`, params)

  const lines = [
    CSV_HEADER,
    ...rows.map((r) => [
      formatDate(r.criado_em),
      r.nome,
      r.email,
      r.whatsapp,
      r.instagram,
      r.formado_medicina,
      r.clinica_propria,
      r.especialidade,
      r.faturamento,
      r.utm_source,
      r.utm_medium,
      r.utm_campaign,
      r.utm_content,
      r.utm_term,
      r.pagina,
      formatDate(r.consentimento_em),
      r.politica_versao,
    ]),
  ]
  return '﻿' + lines.map((line) => line.map(csvCell).join(';')).join('\r\n')
}
