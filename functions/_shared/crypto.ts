// Password hashing and session tokens on Web Crypto, sized for the Workers free tier.
const ALGORITHM = 'pbkdf2_sha256'
const ITERATIONS = 100_000
const MIN_ITERATIONS = 50_000
const MAX_ITERATIONS = 200_000
const SALT_BYTES = 16
const HASH_BYTES = 32

const encoder = new TextEncoder()

export function toBase64(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function fromBase64(value: string): Uint8Array | null {
  try {
    const binary = atob(value)
    return Uint8Array.from(binary, (char) => char.charCodeAt(0))
  } catch {
    return null
  }
}

export function randomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length))
}

export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function sha256Hex(value: string): Promise<string> {
  return toHex(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value))))
}

async function derive(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, HASH_BYTES * 8)
  return new Uint8Array(bits)
}

// Stored as "pbkdf2_sha256$<iterations>$<salt b64>$<hash b64>" so the cost can be raised later.
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES)
  const hash = await derive(password, salt, ITERATIONS)
  return `${ALGORITHM}$${ITERATIONS}$${toBase64(salt)}$${toBase64(hash)}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$')
  if (parts.length !== 4 || parts[0] !== ALGORITHM) return false
  const iterations = Number(parts[1])
  if (!Number.isInteger(iterations) || iterations < MIN_ITERATIONS || iterations > MAX_ITERATIONS) return false
  const salt = fromBase64(parts[2])
  const expected = fromBase64(parts[3])
  if (!salt || salt.length !== SALT_BYTES || !expected || expected.length !== HASH_BYTES) return false

  const actual = await derive(password, salt, iterations)
  let difference = 0
  for (let i = 0; i < HASH_BYTES; i++) difference |= actual[i] ^ expected[i]
  return difference === 0
}

// A dummy hash so unknown emails cost the same time as wrong passwords.
export const DUMMY_HASH = `${ALGORITHM}$${ITERATIONS}$${toBase64(new Uint8Array(SALT_BYTES))}$${toBase64(new Uint8Array(HASH_BYTES))}`
