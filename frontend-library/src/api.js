const RAW_BASE = import.meta.env.VITE_API_URL || '/api'
export const API_BASE = RAW_BASE.replace(/\/+$/, '')
export const API_HINT = import.meta.env.VITE_API_URL
  ? 'Base URL dari VITE_API_URL'
  : 'Proxy Vite → http://127.0.0.1:8000/api'

let logs = []
const listeners = new Set()

function emit() {
  for (const listener of listeners) listener()
}

function pushLog(entry) {
  logs = [entry, ...logs].slice(0, 40)
  emit()
}

export function subscribeToLogs(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getRequestLogs() {
  return logs
}

export function clearRequestLogs() {
  logs = []
  emit()
}

export class ApiError extends Error {
  constructor(message, status = 0, payload = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  const startedAt = performance.now()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  const onAbort = () => controller.abort()
  signal?.addEventListener('abort', onAbort, { once: true })

  const options = {
    method,
    headers: { Accept: 'application/json' },
    signal: controller.signal,
  }

  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(API_BASE + path, options)
    const text = await response.text()
    let data = null
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      data = text
    }

    const ms = Math.round(performance.now() - startedAt)
    pushLog({
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
      method,
      path,
      status: response.status,
      ok: response.ok,
      ms,
      at: Date.now(),
    })

    if (!response.ok) {
      const message =
        data?.message ||
        (typeof data === 'string' && data) ||
        `Permintaan gagal dengan status ${response.status}.`
      throw new ApiError(message, response.status, data)
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) throw error

    const ms = Math.round(performance.now() - startedAt)
    pushLog({
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
      method,
      path,
      status: 0,
      ok: false,
      ms,
      at: Date.now(),
    })

    throw new ApiError(
      controller.signal.aborted
        ? 'Koneksi ke API kehabisan waktu. Pastikan server Laravel menyala di http://127.0.0.1:8000.'
        : 'Tembok API tidak terjangkau. Jalankan "php artisan serve" di folder library-api lalu coba lagi.',
      0,
      error,
    )
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', onAbort)
  }
}

export const api = {
  books: {
    list: () => request('/books'),
    get: (id) => request(`/books/${encodeURIComponent(id)}`),
    create: (payload) => request('/books', { method: 'POST', body: payload }),
    update: (id, payload) =>
      request(`/books/${encodeURIComponent(id)}`, { method: 'PUT', body: payload }),
    remove: (id) =>
      request(`/books/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  categories: {
    list: () => request('/categories'),
    get: (id) => request(`/categories/${encodeURIComponent(id)}`),
    create: (payload) =>
      request('/categories', { method: 'POST', body: payload }),
    update: (id, payload) =>
      request(`/categories/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: payload,
      }),
    remove: (id) =>
      request(`/categories/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  system: {
    halo: () => request('/halo'),
    hello: (name) => request(`/hello/${encodeURIComponent(name)}`),
    ok: () => request('/baik'),
  },
}
