// API do Protocolo 10K
// POST   /api/inscricao     → valida e grava a inscrição em Postgres (tabela `inscricoes`)
// GET    /api/health        → 200 se o banco responde
// POST   /api/auth/login    → abre sessão do /dash (cookie HttpOnly)
// POST   /api/auth/logout   → encerra a sessão
// GET    /api/auth/me       → 200 se a sessão é válida
// GET    /api/leads         → lista paginada + resumo (requer sessão)
// GET    /api/leads.csv     → exportação (requer sessão)
// DELETE /api/leads/:id     → exclui uma inscrição — pedido do titular (LGPD, art. 18) (requer sessão)
//
// Variáveis de ambiente (as marcadas com * aceitam a variante *_FILE, para Docker secrets):
//   Banco — uma das duas formas:
//     DATABASE_URL       postgres://usuario:senha@host:5432/banco
//     PGHOST, PGUSER, PGDATABASE, PGPORT + PGPASSWORD*   (usado no docker-compose)
//   DATABASE_SSL         "true" para conectar com SSL (bancos gerenciados)
//   PORT                 porta HTTP (padrão 3001)
//   DASH_USER*, DASH_PASSWORD_HASH*, DASH_SESSION_SECRET* → ver lib/auth.mjs

import http from 'node:http'
import pg from 'pg'
import { checkCredentials, clearSessionCookie, dashConfigured, getSession, sessionCookie } from './lib/auth.mjs'
import { env } from './lib/env.mjs'
import { deleteLead, exportLeadsCsv, listLeads } from './lib/leads.mjs'

const PORT = Number(process.env.PORT ?? 3001)
const MAX_BODY_BYTES = 10_000

/** Versão da Política de Privacidade aceita no formulário (src/config/content.ts → PRIVACY.version) */
const POLICY_VERSION = /^\d{4}-\d{2}-\d{2}$/

const DATABASE_URL = env('DATABASE_URL')
if (!DATABASE_URL && !process.env.PGHOST) {
  console.error('[api] defina DATABASE_URL ou PGHOST/PGUSER/PGDATABASE/PGPASSWORD — encerrando.')
  process.exit(1)
}

// Sem DATABASE_URL, o pg lê PGHOST/PGUSER/PGDATABASE/PGPORT do ambiente; a senha vem do secret
const pool = new pg.Pool({
  ...(DATABASE_URL ? { connectionString: DATABASE_URL } : { password: env('PGPASSWORD') }),
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  max: 5,
})

// ─── Banco ───────────────────────────────────────────────────────────────────

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS inscricoes (
    id                BIGSERIAL PRIMARY KEY,
    nome              TEXT        NOT NULL,
    email             TEXT        NOT NULL,
    whatsapp          TEXT        NOT NULL,
    instagram         TEXT        NOT NULL,
    formado_medicina  TEXT        NOT NULL,
    clinica_propria   TEXT        NOT NULL,
    especialidade     TEXT        NOT NULL,
    faturamento       TEXT        NOT NULL,
    utm_source        TEXT,
    utm_medium        TEXT,
    utm_campaign      TEXT,
    utm_content       TEXT,
    utm_term          TEXT,
    pagina            TEXT,
    -- Prova do consentimento (LGPD, art. 8º): quando e qual versão da política foi aceita
    consentimento_em  TIMESTAMPTZ NOT NULL,
    politica_versao   TEXT        NOT NULL,
    user_agent        TEXT,
    criado_em         TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS inscricoes_criado_em_idx ON inscricoes (criado_em DESC);
  CREATE INDEX IF NOT EXISTS inscricoes_utm_source_idx ON inscricoes (utm_source);
`

let schemaReady = false

// O banco pode subir depois da API (ordem dos containers): tenta até conseguir
async function ensureSchema() {
  while (!schemaReady) {
    try {
      await pool.query(SCHEMA)
      schemaReady = true
      console.log('[api] tabela inscricoes pronta')
    } catch (err) {
      console.error(`[api] banco indisponível (${err.code ?? err.message}) — nova tentativa em 5s`)
      await new Promise((r) => setTimeout(r, 5000))
    }
  }
}

// ─── Validação (espelha validate() em src/components/ui/LeadModal.tsx) ───────

const text = (max) => (v) => (typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max ? null : 'inválido')

const FIELDS = {
  nome: text(120),
  email: (v) => (typeof v === 'string' && v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'inválido'),
  // DDD + 8 ou 9 dígitos
  whatsapp: (v) => (typeof v === 'string' && /^\d{10,11}$/.test(v.replace(/\D/g, '')) ? null : 'inválido'),
  instagram: (v) => (typeof v === 'string' && /^@[A-Za-z0-9._]{1,30}$/.test(v.trim()) ? null : 'inválido'),
  formado_medicina: text(60),
  clinica_propria: text(60),
  especialidade: text(120),
  faturamento: text(60),
  consentimento: (v) => (v === true ? null : 'obrigatório'),
  politica_versao: (v) => (typeof v === 'string' && POLICY_VERSION.test(v) ? null : 'inválido'),
}

function validate(body) {
  const errors = {}
  for (const [field, check] of Object.entries(FIELDS)) {
    const problem = check(body?.[field])
    if (problem) errors[field] = problem
  }
  return Object.keys(errors).length ? errors : null
}

// ─── Proteções ───────────────────────────────────────────────────────────────

/** Limite de requisições por IP numa janela de tempo (em memória). */
function createLimiter(max, windowMs) {
  const hits = new Map()

  // Limpa IPs antigos para o mapa não crescer para sempre
  setInterval(() => {
    const now = Date.now()
    for (const [ip, times] of hits) if (times.every((t) => now - t >= windowMs)) hits.delete(ip)
  }, windowMs).unref()

  return {
    hit(ip) {
      const now = Date.now()
      const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs)
      recent.push(now)
      hits.set(ip, recent)
      return recent.length > max
    },
    reset(ip) {
      hits.delete(ip)
    },
  }
}

const signupLimiter = createLimiter(5, 10 * 60 * 1000) // 5 inscrições por IP a cada 10 min
const loginLimiter = createLimiter(5, 15 * 60 * 1000) // 5 tentativas de login por IP a cada 15 min

function clientIp(req) {
  // Atrás do Traefik, o IP real vem no primeiro item do X-Forwarded-For
  const forwarded = req.headers['x-forwarded-for']
  return (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0].trim() || req.socket.remoteAddress || '?'
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('payload grande demais'), { status: 413 }))
        req.destroy()
      } else chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'))
      } catch {
        reject(Object.assign(new Error('JSON inválido'), { status: 400 }))
      }
    })
    req.on('error', reject)
  })
}

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(data))
}

// ─── Rotas ───────────────────────────────────────────────────────────────────

/** Texto opcional (UTM, página): curto ou null — nunca bloqueia o envio do lead */
const optional = (v, max = 200) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null)

async function handleSignup(req, res) {
  if (signupLimiter.hit(clientIp(req))) return send(res, 429, { error: 'Muitas tentativas. Aguarde alguns minutos.' })

  const body = await readJson(req)

  // Honeypot: campo invisível que só robôs preenchem — responde sucesso e descarta
  if (typeof body.empresa === 'string' && body.empresa.trim() !== '') return send(res, 201, { ok: true })

  const errors = validate(body)
  if (errors) return send(res, 422, { error: 'Dados inválidos', fields: errors })

  if (!schemaReady) return send(res, 503, { error: 'Banco indisponível' })

  const t = (v) => String(v).trim()
  await pool.query(
    `INSERT INTO inscricoes
       (nome, email, whatsapp, instagram, formado_medicina, clinica_propria, especialidade, faturamento,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term, pagina,
        consentimento_em, politica_versao, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, now(), $15, $16)`,
    [
      t(body.nome),
      t(body.email).toLowerCase(),
      t(body.whatsapp).replace(/\D/g, ''), // só dígitos: 11987654321
      t(body.instagram),
      t(body.formado_medicina),
      t(body.clinica_propria),
      t(body.especialidade),
      t(body.faturamento),
      // source e medium em minúsculas: 'Instagram' e 'instagram' não viram duas fontes
      optional(body.utm_source)?.toLowerCase() ?? null,
      optional(body.utm_medium)?.toLowerCase() ?? null,
      optional(body.utm_campaign),
      optional(body.utm_content),
      optional(body.utm_term),
      optional(body.pagina, 500),
      body.politica_versao,
      optional(req.headers['user-agent'], 500),
    ],
  )
  send(res, 201, { ok: true })
}

async function handleLogin(req, res) {
  if (!dashConfigured) return send(res, 503, { error: 'Painel não configurado' })

  const ip = clientIp(req)
  if (loginLimiter.hit(ip)) return send(res, 429, { error: 'Muitas tentativas. Aguarde alguns minutos.' })

  const body = await readJson(req)
  if (!checkCredentials(body.user, body.password)) return send(res, 401, { error: 'Usuário ou senha incorretos' })

  loginLimiter.reset(ip)
  res.setHeader('Set-Cookie', sessionCookie(req))
  send(res, 200, { ok: true })
}

const LEAD_PATH = /^\/api\/leads\/(\d{1,18})$/

// Rotas do /dash: só respondem com sessão válida
async function handleDash(req, res, path, query) {
  if (!getSession(req)) return send(res, 401, { error: 'Sessão expirada' })

  if (path === '/api/auth/me') return send(res, 200, { ok: true })

  if (path === '/api/leads') return send(res, 200, await listLeads(pool, query))

  if (path === '/api/leads.csv') {
    const csv = await exportLeadsCsv(pool, query)
    const date = new Date().toISOString().slice(0, 10)
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="protocolo-10k-leads-${date}.csv"`,
      'Cache-Control': 'no-store',
    })
    return res.end(csv)
  }

  const id = path.match(LEAD_PATH)?.[1]
  if (id) return (await deleteLead(pool, id)) ? send(res, 200, { ok: true }) : send(res, 404, { error: 'Lead não encontrado' })
}

const DASH_GET_ROUTES = new Set(['/api/auth/me', '/api/leads', '/api/leads.csv'])

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const path = url.pathname
  try {
    if (path === '/api/inscricao' && req.method === 'POST') return await handleSignup(req, res)
    if (path === '/api/health' && req.method === 'GET') {
      await pool.query('SELECT 1')
      return send(res, 200, { ok: true, schema: schemaReady })
    }
    if (path === '/api/auth/login' && req.method === 'POST') return await handleLogin(req, res)
    if (path === '/api/auth/logout' && req.method === 'POST') {
      res.setHeader('Set-Cookie', clearSessionCookie(req))
      return send(res, 200, { ok: true })
    }
    if ((DASH_GET_ROUTES.has(path) && req.method === 'GET') || (LEAD_PATH.test(path) && req.method === 'DELETE')) {
      return await handleDash(req, res, path, Object.fromEntries(url.searchParams))
    }
    send(res, 404, { error: 'Não encontrado' })
  } catch (err) {
    if (err.status) return send(res, err.status, { error: err.message })
    console.error('[api] erro:', err)
    send(res, 500, { error: 'Erro interno' })
  }
})

server.listen(PORT, () => console.log(`[api] ouvindo na porta ${PORT}`))
ensureSchema()

// Encerramento limpo quando o container para
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    server.close(() => pool.end().finally(() => process.exit(0)))
  })
}
