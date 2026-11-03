import { useCallback, useEffect, useRef, useState } from 'react'
import Scene from './components/Scene'
import Sidebar from './components/Sidebar'
import Toasts from './components/Toasts'
import Topbar from './components/Topbar'
import { api } from './api'
import { useApiHealth } from './hooks/useApiHealth'
import { useCollection } from './hooks/useCollection'
import ApiLab from './pages/ApiLab'
import Books from './pages/Books'
import Categories from './pages/Categories'
import Dashboard from './pages/Dashboard'

const ROUTES = {
  beranda: { label: 'Beranda', code: '01' },
  buku: { label: 'Buku', code: '02' },
  kategori: { label: 'Kategori', code: '03' },
  lab: { label: 'API Lab', code: '04' },
}
const ROUTE_KEYS = Object.keys(ROUTES)

function readRoute() {
  const raw = window.location.hash
    .replace(/^#\/?/, '')
    .split('?')[0]
    .replace(/\/+$/, '')
  return ROUTE_KEYS.includes(raw) ? raw : 'beranda'
}

function readSidebarOpen() {
  try {
    return localStorage.getItem('graffioteka:sidebar') !== 'closed'
  } catch {
    return true
  }
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__row">
        <div>
          <span className="sticker sticker--acid">GRAFFIOTEKA</span>
          <p className="site-footer__tag">
            Perpustakaan jalanan buat cerita yang belum selesai. Datang, baca,
            semprot ide, pulang bawa cerita.
          </p>
        </div>
        <nav className="site-footer__nav" aria-label="Navigasi footer">
          <a href="#/beranda">Beranda</a>
          <a href="#/buku">Buku</a>
          <a href="#/kategori">Kategori</a>
          <a href="#/lab">API Lab</a>
        </nav>
      </div>

      <p className="site-footer__giant" aria-hidden="true">
        GRAFFIOTEKA
      </p>

      <div className="site-footer__bottom">
        <span>© 2026 GRAFFIOTEKA</span>
        <span>REACT 19 × LARAVEL 13</span>
        <span>TEMBOK DIPILOX, JIWA DIBAWA.</span>
      </div>
    </footer>
  )
}

export default function App() {
  const [route, setRoute] = useState(readRoute)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(readSidebarOpen)
  const [narrow, setNarrow] = useState(() =>
    window.matchMedia('(max-width: 980px)').matches,
  )
  const [compose, setCompose] = useState(null)
  const [toasts, setToasts] = useState([])
  const toastTimers = useRef(new Map())
  const toastSequence = useRef(0)

  const booksState = useCollection(api.books.list)
  const categoriesState = useCollection(api.categories.list)
  const health = useApiHealth()

  useEffect(() => {
    const onHashChange = () => {
      setRoute(readRoute())
      setMenuOpen(false)
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  useEffect(() => {
    const query = window.matchMedia('(max-width: 980px)')
    const onChange = (event) => setNarrow(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(
        'graffioteka:sidebar',
        sidebarOpen ? 'open' : 'closed',
      )
    } catch {
      /* localStorage bisa diblokir; sidebar tetap jalan */
    }
  }, [sidebarOpen])

  useEffect(
    () => () => {
      toastTimers.current.forEach((timer) => clearTimeout(timer))
    },
    [],
  )

  const navigate = useCallback((key) => {
    setMenuOpen(false)
    const nextHash = `#/${key}`
    if (window.location.hash === nextHash) {
      setRoute(key)
    } else {
      window.location.hash = nextHash
    }
  }, [])

  const toggleSidebar = useCallback(() => {
    if (narrow) {
      setMenuOpen((open) => !open)
    } else {
      setSidebarOpen((open) => !open)
    }
  }, [narrow])

  const dismissSidebar = useCallback(() => {
    if (narrow) {
      setMenuOpen(false)
    } else {
      setSidebarOpen(false)
    }
  }, [narrow])

  const notify = useCallback((message, type = 'success', duration = 5200) => {
    const id = `toast-${Date.now()}-${toastSequence.current++}`
    setToasts((current) => [
      ...current.slice(-3),
      { id, message, type, duration },
    ])
    const timer = setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
      toastTimers.current.delete(id)
    }, duration)
    toastTimers.current.set(id, timer)
  }, [])

  const dismissToast = useCallback((id) => {
    const timer = toastTimers.current.get(id)
    if (timer) clearTimeout(timer)
    toastTimers.current.delete(id)
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const startCreate = useCallback(
    (kind) => {
      setCompose({ kind, nonce: Date.now() })
      navigate(kind === 'book' ? 'buku' : 'kategori')
    },
    [navigate],
  )

  const handleCompose = useCallback(() => setCompose(null), [])

  const refreshAll = useCallback(() => {
    booksState.reload()
    categoriesState.reload()
    health.check()
  }, [booksState, categoriesState, health])

  const busy =
    booksState.refreshing ||
    categoriesState.refreshing ||
    health.status === 'checking'

  let content
  if (route === 'buku') {
    content = (
      <Books
        booksState={booksState}
        compose={compose}
        onComposeHandled={handleCompose}
        notify={notify}
      />
    )
  } else if (route === 'kategori') {
    content = (
      <Categories
        categoriesState={categoriesState}
        compose={compose}
        onComposeHandled={handleCompose}
        notify={notify}
      />
    )
  } else if (route === 'lab') {
    content = <ApiLab health={health} notify={notify} />
  } else {
    content = (
      <Dashboard
        books={booksState.data}
        categories={categoriesState.data}
        booksState={booksState}
        categoriesState={categoriesState}
        health={health}
        startCreate={startCreate}
      />
    )
  }

  return (
    <div className={`app${sidebarOpen ? '' : ' app--no-sidebar'}`}>
      <Scene />

      {menuOpen ? (
        <button
          type="button"
          className="scrim"
          onClick={() => setMenuOpen(false)}
          aria-label="Tutup menu navigasi"
        />
      ) : null}

      <Sidebar
        route={route}
        booksCount={booksState.data.length}
        categoriesCount={categoriesState.data.length}
        health={health}
        isOpen={menuOpen}
        collapsed={!sidebarOpen}
        onClose={() => setMenuOpen(false)}
        onDismiss={dismissSidebar}
      />

      <div className="app__main">
        <Topbar
          meta={ROUTES[route]}
          health={health}
          busy={busy}
          onRefresh={refreshAll}
          onToggleMenu={toggleSidebar}
          menuExpanded={narrow ? menuOpen : sidebarOpen}
          onCreateBook={() => startCreate('book')}
          onOpenLab={() => navigate('lab')}
        />

        <main className="app__content" id="main">
          {content}
          <SiteFooter />
        </main>
      </div>

      <Toasts toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}