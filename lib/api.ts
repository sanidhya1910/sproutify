/**
 * Centralised client-side fetch.
 *
 * Every page currently hand-rolls this: read `token` from localStorage, build
 * an Authorization header, fetch, check `response.ok`, parse JSON, and handle
 * failure differently each time (some `alert()`, some silently swallow, some
 * fall back to fabricated demo data). That last one is the dangerous case —
 * an outage rendered as a working page full of fake content.
 *
 * Auth here is hand-rolled JWT in localStorage (NOT next-auth) — see
 * components/auth/auth-guard.jsx. Do not swap in getServerSession.
 */

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem('token')
}

function authHeaders(auth: boolean): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }
  return headers
}

async function parse<T>(response: Response): Promise<T> {
  // Error routes may return HTML (e.g. a 404 page), so never assume JSON.
  const text = await response.text()
  let body: unknown = null
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    body = null
  }

  if (!response.ok) {
    const message =
      (body as { message?: string } | null)?.message ||
      `Request failed (${response.status})`
    throw new ApiError(message, response.status)
  }

  return body as T
}

export async function apiGet<T>(path: string, auth = true): Promise<T> {
  const response = await fetch(path, { headers: authHeaders(auth) })
  return parse<T>(response)
}

export async function apiPost<T>(path: string, body?: unknown, auth = true): Promise<T> {
  const response = await fetch(path, {
    method: 'POST',
    headers: authHeaders(auth),
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  return parse<T>(response)
}

export async function apiPatch<T>(path: string, body?: unknown, auth = true): Promise<T> {
  const response = await fetch(path, {
    method: 'PATCH',
    headers: authHeaders(auth),
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  return parse<T>(response)
}

export async function apiDelete<T>(path: string, body?: unknown, auth = true): Promise<T> {
  const response = await fetch(path, {
    method: 'DELETE',
    headers: authHeaders(auth),
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  return parse<T>(response)
}
