// Creates or resets an admin login. Prints a generated password once; share it privately.
//   node scripts/create-admin.mjs --email luvkoush@example.com --name Luvkoush [--remote]
// Without --remote it writes to the local development database.
import { execFileSync } from 'node:child_process'
import { randomBytes, webcrypto } from 'node:crypto'

const arg = (name) => {
  const index = process.argv.indexOf(`--${name}`)
  return index > -1 ? process.argv[index + 1] : undefined
}
const email = arg('email')?.trim().toLowerCase()
const name = arg('name')?.trim()
if (!email || !name) {
  console.error('Usage: node scripts/create-admin.mjs --email <email> --name <name> [--remote]')
  process.exit(1)
}

// Same format as functions/_shared/crypto.ts: pbkdf2_sha256$iterations$salt$hash
const ITERATIONS = 100_000
const password = randomBytes(12).toString('base64url')
const salt = randomBytes(16)
const key = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
const hash = Buffer.from(await webcrypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS }, key, 256))
const stored = `pbkdf2_sha256$${ITERATIONS}$${salt.toString('base64')}$${hash.toString('base64')}`

const q = (value) => `'${value.replaceAll("'", "''")}'`
const sql = `INSERT INTO admins (email, name, password_hash, created_at) VALUES (${q(email)}, ${q(name)}, ${q(stored)}, ${Date.now()})
ON CONFLICT(email) DO UPDATE SET name = excluded.name, password_hash = excluded.password_hash, status = 'active';
DELETE FROM sessions WHERE admin_id = (SELECT id FROM admins WHERE email = ${q(email)});`

execFileSync('npx', ['wrangler', 'd1', 'execute', 'justlovetour-db', process.argv.includes('--remote') ? '--remote' : '--local', '--command', sql], { stdio: ['ignore', 'ignore', 'inherit'] })
console.log(`Admin ready: ${name} <${email}>`)
console.log(`Password: ${password}`)
