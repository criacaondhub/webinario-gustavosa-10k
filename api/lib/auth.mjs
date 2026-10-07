// Autenticação do /dash — usuário único da agência
//
//   DASH_USER            usuário de acesso
//   DASH_PASSWORD_HASH   hash scrypt da senha (gerar com: npm run hash-password -- "senha")
//   DASH_SESSION_SECRET  segredo para assinar a sessão (string aleatória longa)
// Todas aceitam a variante *_FILE (Docker secrets) — ver lib/env.mjs

import crypto from 'node:crypto'
import { env } from './env.mjs'
import { verifyPassword } from './password.mjs'

const SESSION_COOKIE = 'p10k_dash'
const SESSION_TTL_MS = 12 * 60 * 60 * 1000 // 12h

const USER = env('DASH_USER')
const PASSWORD_HASH = env('DASH_PASSWORD_HASH')

const SECRET =
  env('DASH_SESSION_SECRET') ||
  (() => {
    console.warn('[api] DASH_SESSION_SECRET não definido — usando segredo temporário (sessões caem a cada reinício)')
    return crypto.randomBytes(32).toString('hex')
  })()

export const dashConfigured = Boolean(USER && PASSWORD_HASH)
if (!dashConfigured) console.warn('[api] DASH_USER/DASH_PASSWORD_HASH não definidos — /dash desativado')

// ─── Credenciais ─────────────────────────────────────────────────────────────

// Compara em tempo constante mesmo com tamanhos diferentes
function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(a).digest()
  const hb = crypto.createHash('sha256').update(b).digest()
  return crypto.timingSafeEqual(ha, hb)
}

export function checkCredentials(user, password) {
  if (!dashConfigured || typeof user !== 'string' || typeof password !== 'string') return false
  // Sempre roda as duas checagens para não revelar, pelo tempo, se o usuário existe
  const userOk = safeEqual(user.trim(), USER)
  const passOk = verifyPassword(password, PASSWORD_HASH)
  return userOk && passOk
}

// ─── Sessão (token assinado com HMAC, sem estado no servidor) ────────────────

const sign = (data) => crypto.createHmac('sha256', SECRET).update(data).digest('base64url')

function createToken() {
  const payload = Buffer.from(JSON.stringify({ u: USER, exp: Date.now() + SESSION_TTL_MS })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

function readToken(token) {
  const [payload, signature] = (token ?? '').split('.')
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    return data.exp > Date.now() && data.u === USER ? data : null
  } catch {
    return null
  }
}

function getCookie(req, name) {
  const header = req.headers.cookie ?? ''
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return decodeURIComponent(v.join('='))
  }
  return null
}

// Em produção o site roda em subpasta (/protocolo-10k) e o Traefik remove o prefixo antes de
// chegar aqui, informando-o em X-Forwarded-Prefix. O cookie precisa do caminho que o navegador vê.
function publicPrefix(req) {
  const prefix = req.headers['x-forwarded-prefix']
  return typeof prefix === 'string' && /^(\/[\w-]+)+$/.test(prefix) ? prefix : ''
}

const cookieFlags = (req) =>
  [`Path=${publicPrefix(req)}/api`, 'HttpOnly', 'SameSite=Strict', process.env.NODE_ENV === 'production' ? 'Secure' : null]
    .filter(Boolean)
    .join('; ')

export function sessionCookie(req) {
  return `${SESSION_COOKIE}=${createToken()}; Max-Age=${SESSION_TTL_MS / 1000}; ${cookieFlags(req)}`
}

export function clearSessionCookie(req) {
  return `${SESSION_COOKIE}=; Max-Age=0; ${cookieFlags(req)}`
}

/** Retorna a sessão válida da requisição, ou null. */
export function getSession(req) {
  return dashConfigured ? readToken(getCookie(req, SESSION_COOKIE)) : null
}
