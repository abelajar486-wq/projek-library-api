import { useState } from 'react'
import { api, API_BASE, API_HINT, clearRequestLogs } from '../api'
import { EmptyState } from '../components/EmptyState'
import { MethodBadge } from '../components/EndpointPill'
import EndpointPill from '../components/EndpointPill'
import { Icon } from '../components/Icon'
import { useRequestLogs } from '../hooks/useRequestLogs'
import { formatClock } from '../lib/format'

const ENDPOINT_GROUPS = [
  {
    id: 'books',
    title: 'Books',
    icon: 'book',
    tone: 'acid',
    note: 'CRUD koleksi buku',
    endpoints: [
      {
        method: 'GET',
        path: '/api/books',
        desc: 'Ambil seluruh daftar buku di rak.',
      },
      {
        method: 'GET',
        path: '/api/books/{id}',
        desc: 'Ambil satu buku berdasarkan ID.',
      },
      {
        method: 'POST',
        path: '/api/books',
        desc: 'Tambahkan buku baru (title, author, year).',
      },
      {
        method: 'PUT',
        path: '/api/books/{id}',
        desc: 'Perbarui data buku yang sudah ada.',
      },
      {
        method: 'DELETE',
        path: '/api/books/{id}',
        desc: 'Hapus buku dari database.',
      },
    ],
  },
  {
    id: 'categories',
    title: 'Categories',
    icon: 'tag',
    tone: 'pink',
    note: 'CRUD peta genre',
    endpoints: [
      {
        method: 'GET',
        path: '/api/categories',
        desc: 'Ambil seluruh kategori dan genrenya.',
      },
      {
        method: 'GET',
        path: '/api/categories/{id}',
        desc: 'Ambil satu kategori berdasarkan ID.',
      },
      {
        method: 'POST',
        path: '/api/categories',
        desc: 'Buat kategori baru (name, genre, description).',
      },
      {
        method: 'PUT',
        path: '/api/categories/{id}',
        desc: 'Perbarui kategori yang sudah ada.',
      },
      {
        method: 'DELETE',
        path: '/api/categories/{id}',
        desc: 'Hapus kategori dari database.',
      },
    ],
  },
  {
    id: 'system',
    title: 'System',
    icon: 'terminal',
    tone: 'cyan',
    note: 'Uji tembok API',
    endpoints: [
      { method: 'GET', path: '/api/halo', desc: 'Ping sapaan sederhana.' },
      {
        method: 'GET',
        path: '/api/hello/{name}',
        desc: 'Sapaan dinamis dengan parameter nama.',
      },
      {
        method: 'GET',
        path: '/api/baik',
        desc: 'Cek status kesehatan API.',
      },
    ],
  },
]

const TOTAL_ENDPOINTS = ENDPOINT_GROUPS.reduce(
  (total, group) => total + group.endpoints.length,
  0,
)

function joinUrl(path) {
  const normalized = path.startsWith('/api') ? path.slice(4) : path
  if (API_BASE.startsWith('http')) return `${API_BASE}${normalized}`
  return `${window.location.origin}${API_BASE}${normalized}`
}

function displayPath(path) {
  if (API_BASE.startsWith('http')) return `${API_BASE}${path}`
  return `${API_BASE}${path}`
}

export default function ApiLab({ health, notify }) {
  const [guest, setGuest] = useState('')
  const [result, setResult] = useState(null)
  const [running, setRunning] = useState('')
  const [logFilter, setLogFilter] = useState('all')
  const logs = useRequestLogs()

  const visibleLogs = logs.filter((entry) => {
    if (logFilter === 'ok') return entry.ok
    if (logFilter === 'error') return !entry.ok
    return true
  })

  async function copyText(text, label) {
    try {
      await navigator.clipboard.writeText(text)
      notify(`${label} disalin ke clipboard.`, 'info', 3000)
    } catch {
      notify('Browser menolak akses clipboard.', 'error')
    }
  }

  async function runTest({ key, label, method, path, action }) {
    const startedAt = performance.now()
    setRunning(key)
    try {
      const data = await action()
      setResult({
        label,
        method,
        path,
        status: 200,
        ok: true,
        ms: Math.round(performance.now() - startedAt),
        data,
        error: null,
        at: Date.now(),
      })
    } catch (error) {
      setResult({
        label,
        method,
        path,
        status: error.status || 0,
        ok: false,
        ms: Math.round(performance.now() - startedAt),
        data: error.payload ?? null,
        error: error.message,
        at: Date.now(),
      })
    } finally {
      setRunning('')
    }
  }

  function testHalo() {
    runTest({
      key: 'halo',
      label: 'Sapaan /halo',
      method: 'GET',
      path: '/halo',
      action: () => api.system.halo(),
    })
  }

  function testBaik() {
    runTest({
      key: 'baik',
      label: 'Cek /baik',
      method: 'GET',
      path: '/baik',
      action: () => api.system.ok(),
    })
  }

  function submitHello(event) {
    event.preventDefault()
    const name = guest.trim()
    if (!name) {
      notify('Isi nama dulu sebelum menembak /hello.', 'error')
      return
    }
    runTest({
      key: 'hello',
      label: `Sapaan untuk ${name}`,
      method: 'GET',
      path: `/hello/${encodeURIComponent(name)}`,
      action: () => api.system.hello(name),
    })
  }

  function clearLogs() {
    clearRequestLogs()
    notify('Riwayat tembakan dibersihkan.', 'info', 3000)
  }

  const jsonText = result
    ? JSON.stringify(
        result.data ?? {
          status: result.status,
          message: result.error || 'Tidak ada body respons.',
        },
        null,
        2,
      )
    : ''

  const statusLabel =
    health.status === 'online'
      ? 'ONLINE'
      : health.status === 'checking'
        ? 'NYAMBUNG…'
        : 'OFFLINE'

  return (
    <div className="page page--lab">
      <header className="page-head">
        <div className="page-head__copy">
          <p className="eyebrow">BENGKEL API / 04</p>
          <h1 className="page-title">
            Lab <span className="marker marker--acid">API</span>
          </h1>
          <p className="page-lead">
            Ruang uji buat semua endpoint Laravel. Tembak rute sistem, intip
            respons JSON, dan pantau setiap request yang lewat.
          </p>
          <div className="page-head__pills">
            <EndpointPill method="GET" path="/api/baik" />
            <span className="pill pill--plain">{TOTAL_ENDPOINTS} ENDPOINT</span>
          </div>
        </div>
        <div className="page-head__aside">
          <div className="count-stamp count-stamp--acid">
            <strong>{String(TOTAL_ENDPOINTS).padStart(2, '0')}</strong>
            <span>RUTE</span>
          </div>
        </div>
      </header>

      <section className={`lab-banner lab-banner--${health.status}`}>
        <div className="lab-banner__main">
          <p className="eyebrow">LIVE STATUS / GET /baik</p>
          <div className="lab-banner__status">
            <span
              className={`dot dot--${health.status}`}
              aria-hidden="true"
            />
            <strong>{statusLabel}</strong>
          </div>
          <p className="lab-banner__meta">
            <span>Base URL</span>
            <code>{API_BASE}</code>
            <span className="lab-banner__hint">{API_HINT}</span>
          </p>
        </div>

        <div className="lab-banner__stats">
          <div>
            <span>LATENSI</span>
            <strong>
              {health.latency != null ? `${health.latency} ms` : '—'}
            </strong>
          </div>
          <div>
            <span>CEK TERAKHIR</span>
            <strong>
              {health.checkedAt ? formatClock(health.checkedAt) : '—'}
            </strong>
          </div>
        </div>

        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={health.check}
          disabled={health.status === 'checking'}
        >
          <Icon name="refresh" size={15} />
          {health.status === 'checking' ? 'MENEMBAK…' : 'Cek /baik'}
        </button>
      </section>

      <div className="lab-grid">
        <div className="lab-col">
          <section className="panel panel--paperless lab-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">SYSTEM ROUTES</p>
                <h2 className="panel-title">Tembak cepat</h2>
              </div>
              <span className="mono-label">3 ROUTE</span>
            </div>

            <div className="quick-fire">
              <button
                type="button"
                className="quick-fire__btn"
                onClick={testHalo}
                disabled={running === 'halo'}
              >
                <MethodBadge method="GET" />
                <code>/api/halo</code>
                <Icon name="arrowUpRight" size={16} />
              </button>
              <button
                type="button"
                className="quick-fire__btn"
                onClick={testBaik}
                disabled={running === 'baik'}
              >
                <MethodBadge method="GET" />
                <code>/api/baik</code>
                <Icon name="arrowUpRight" size={16} />
              </button>
            </div>

            <form className="lab-form" onSubmit={submitHello}>
              <label className="lab-form__label" htmlFor="lab-name">
                Sapaan dinamis
              </label>
              <p className="lab-form__route">
                GET <code>/api/hello/{guest.trim() || '{name}'}</code>
              </p>
              <div className="lab-form__row">
                <input
                  id="lab-name"
                  type="text"
                  value={guest}
                  onChange={(event) => setGuest(event.target.value)}
                  placeholder="Tulis nama, mis. Budi…"
                  maxLength={40}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={running === 'hello'}
                >
                  {running === 'hello' ? 'MENEMBAK…' : 'Tembak'}
                  <Icon name="send" size={15} />
                </button>
              </div>
            </form>
          </section>

          <section className="panel panel--paperless log-panel">
            <div className="log-head">
              <div>
                <p className="eyebrow">LIVE REQUEST LOG</p>
                <h2 className="panel-title">Riwayat tembakan</h2>
              </div>
              <span className="mono-label">{logs.length} / 40</span>
            </div>

            <div className="log-tools">
              <div className="chip-row chip-row--compact">
                {[
                  ['all', 'Semua'],
                  ['ok', 'Sukses'],
                  ['error', 'Error'],
                ].map(([value, label]) => (
                  <button
                    type="button"
                    key={value}
                    className={`chip chip--sm${logFilter === value ? ' is-active' : ''}`}
                    onClick={() => setLogFilter(value)}
                    aria-pressed={logFilter === value}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="link-btn"
                onClick={clearLogs}
                disabled={logs.length === 0}
              >
                <Icon name="trash" size={13} />
                Bersihkan
              </button>
            </div>

            {visibleLogs.length === 0 ? (
              <div className="log-empty">
                <Icon name="terminal" size={22} />
                <p>
                  {logs.length === 0
                    ? 'Belum ada tembakan. Coba rute di atas.'
                    : 'Tidak ada request yang cocok dengan filter.'}
                </p>
              </div>
            ) : (
              <div className="log-list">
                {visibleLogs.map((entry) => (
                  <div
                    className={`log-row log-row--${entry.ok ? 'ok' : 'error'}`}
                    key={entry.id}
                  >
                    <MethodBadge method={entry.method} />
                    <code className="log-row__path" title={displayPath(entry.path)}>
                      {displayPath(entry.path)}
                    </code>
                    <span
                      className={`status-code status-code--${
                        entry.status === 0
                          ? 'net'
                          : entry.ok
                            ? 'ok'
                            : 'error'
                      }`}
                    >
                      {entry.status === 0 ? 'NET' : entry.status}
                    </span>
                    <span className="log-row__ms">{entry.ms} ms</span>
                    <span className="log-row__time">{formatClock(entry.at)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="lab-col">
          <div className="console">
            <div className="console__bar">
              <span className="console__dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="console__title">response.json</span>
              {result ? (
                <button
                  type="button"
                  className="console__copy"
                  onClick={() => copyText(jsonText, 'Respons JSON')}
                >
                  <Icon name="copy" size={13} />
                  Salin JSON
                </button>
              ) : (
                <span className="console__idle">IDLE</span>
              )}
            </div>

            <div className="console__meta">
              {result ? (
                <>
                  <MethodBadge method={result.method} />
                  <code>{displayPath(result.path)}</code>
                  <span
                    className={`status-code status-code--${result.ok ? 'ok' : 'error'}`}
                  >
                    {result.status || 'ERR'}
                  </span>
                  <span className="console__ms">{result.ms} ms</span>
                  <span className="console__time">
                    {formatClock(result.at)}
                  </span>
                </>
              ) : (
                <span className="console__wait">
                  Menunggu tembakan pertama…
                </span>
              )}
            </div>

            <div className="console__body">
              {!result ? (
                <div className="console__empty">
                  <span className="console__empty-mark">
                    <Icon name="terminal" size={26} />
                  </span>
                  <p>
                    Pilih rute system di sebelah, lalu hasil JSON-nya bakal
                    muncul di sini.
                  </p>
                </div>
              ) : (
                <>
                  {result.error ? (
                    <p className="console__error" role="alert">
                      <Icon name="alert" size={14} />
                      {result.error}
                    </p>
                  ) : null}
                  <pre>{jsonText}</pre>
                </>
              )}
            </div>
          </div>

          <section className="panel panel--paperless lab-note">
            <span className="lab-note__icon">
              <Icon name="info" size={19} />
            </span>
            <div>
              <p className="eyebrow">CATATAN TEKNIS</p>
              <p>
                Frontend memakai proxy Vite ke <code>127.0.0.1:8000</code>.
                Kalau backend pindah host, set{' '}
                <code>VITE_API_URL</code> di file <code>.env</code> frontend.
              </p>
            </div>
          </section>
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">PETA ENDPOINT</p>
            <h2 className="section-title">
              Semua <span className="marker marker--orange">rute</span> yang
              tersambung
            </h2>
          </div>
          <span className="pill pill--online">
            <span className="dot dot--online" aria-hidden="true" />
            {TOTAL_ENDPOINTS} RUTE TERDAFTAR
          </span>
        </div>

        <div className="endpoint-groups">
          {ENDPOINT_GROUPS.map((group) => (
            <div
              className={`endpoint-group endpoint-group--${group.tone}`}
              key={group.id}
            >
              <div className="endpoint-group__head">
                <span className="endpoint-group__icon">
                  <Icon name={group.icon} size={18} />
                </span>
                <div>
                  <h3>{group.title}</h3>
                  <p>{group.note}</p>
                </div>
                <span className="endpoint-group__count">
                  {group.endpoints.length}
                </span>
              </div>

              <ul className="endpoint-list">
                {group.endpoints.map((endpoint) => (
                  <li className="endpoint-row" key={`${endpoint.method}-${endpoint.path}`}>
                    <div className="endpoint-row__main">
                      <MethodBadge method={endpoint.method} />
                      <code>{endpoint.path}</code>
                    </div>
                    <p className="endpoint-row__desc">{endpoint.desc}</p>
                    <button
                      type="button"
                      className="endpoint-row__copy"
                      onClick={() =>
                        copyText(
                          `${endpoint.method} ${joinUrl(endpoint.path)}`,
                          `Endpoint ${endpoint.path}`,
                        )
                      }
                      aria-label={`Salin endpoint ${endpoint.path}`}
                      title="Salin endpoint"
                    >
                      <Icon name="copy" size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <EmptyState
          icon="spray"
          kicker="MADE FOR THE WALL"
          title="Tidak perlu Postman buat cek rute."
          message="Semua data dan request di halaman ini memakai API Laravel yang sama dengan halaman Buku dan Kategori. Satu tembok, satu sumber kebenaran."
          action={
            <a className="btn btn--ghost" href="#/buku">
              Balik ke rak buku
              <Icon name="arrowRight" size={16} />
            </a>
          }
        />
      </section>
    </div>
  )
}
