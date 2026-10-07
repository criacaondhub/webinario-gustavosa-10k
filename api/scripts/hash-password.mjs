// Gera o valor de DASH_PASSWORD_HASH a partir de uma senha.
// Uso: npm run hash-password -- "minha senha"

import { hashPassword } from '../lib/password.mjs'

const password = process.argv[2]
if (!password) {
  console.error('Uso: npm run hash-password -- "senha"')
  process.exit(1)
}

console.log(hashPassword(password))
