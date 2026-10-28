export function json(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json; charset=utf-8')
  if (!headers.has('Cache-Control')) headers.set('Cache-Control', 'no-store')
  return new Response(JSON.stringify(data), { ...init, headers })
}

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function errorResponse(error: unknown): Response {
  if (error instanceof HttpError) return json({ error: error.message }, { status: error.status })
  console.error('Unhandled error', error instanceof Error ? error.message : String(error))
  return json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
}

const MAX_JSON_BYTES = 256 * 1024

export async function readJson<T = unknown>(request: Request): Promise<T> {
  const type = request.headers.get('Content-Type') ?? ''
  if (!type.includes('application/json')) throw new HttpError(415, 'Expected JSON')
  const length = Number(request.headers.get('Content-Length') ?? 0)
  if (length > MAX_JSON_BYTES) throw new HttpError(413, 'Request is too large')
  const text = await request.text()
  if (text.length > MAX_JSON_BYTES) throw new HttpError(413, 'Request is too large')
  try {
    return JSON.parse(text) as T
  } catch {
    throw new HttpError(400, 'Invalid JSON')
  }
}

export const clientIp = (request: Request) => request.headers.get('CF-Connecting-IP') ?? 'unknown'

export function parseId(value: string | string[] | undefined): number {
  const id = Number(Array.isArray(value) ? value[0] : value)
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(404, 'Not found')
  return id
}
