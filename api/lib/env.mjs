// Variáveis de ambiente com suporte a Docker secrets:
// se NOME_FILE existir, o valor é lido desse arquivo (ex.: /run/secrets/...).

import fs from 'node:fs'

export function env(name) {
  const file = process.env[`${name}_FILE`]
  if (file) {
    try {
      return fs.readFileSync(file, 'utf8').trim()
    } catch {
      console.error(`[api] não foi possível ler ${name}_FILE (${file})`)
      return ''
    }
  }
  return process.env[name]?.trim() ?? ''
}
