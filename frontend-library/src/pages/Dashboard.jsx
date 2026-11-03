import { useMemo, useState } from 'react'
import mural from '../assets/mural.jpg'
import { api } from '../api'
import { Icon } from '../components/Icon'
import { EmptyState, ErrorState } from '../components/EmptyState'
import { RowsSkeleton, StatsSkeleton } from '../components/Skeletons'
import { accentFor } from '../lib/accents'
import {
  formatDate,
  formatNumber,
  formatYear,
  padId,
  truncate,
} from '../lib/format'

const MARQUEE_ITEMS = [
  'BUKU BARU TIAP MINGGU',
  'RAK TERBUKA UNTUK SEMUA',
  'KATEGORI BARU? SEMPROT!',
  'KEMBALIKAN BUKU KE RAK',
  'API NYALA, IDE JALAN',
]

function byNewest(left, right) {
  const leftDate = new Date(left.created_at || 0).getTime()
  const rightDate = new Date(right.created_at || 0).getTime()
  if (rightDate !== leftDate) return rightDate - leftDate
  return Number(right.id || 0) - Number(left.id || 0)
}

export default function Dashboard({
  books,
  categories,
  booksState,
  categoriesState,
  health,
  startCreate,
}) {
  const [guest, setGuest] = useState('')
  const [greeting, setGreeting] = useState('')
  const [greetError, setGreetError] = useState('')
  const [sending, setSending] = useState(false)

  const genreStats = useMemo(() => {
    const counts = new Map()
    categories.forEach((category) => {
      const genre = (category.genre || 'Tanpa genre').trim()
      counts.set(genre, (counts.get(genre) || 0) + 1)
    })
    return [...counts.entries()].sort((left, right) =>
      left[0].localeCompare(right[0], 'id'),
    )
  }, [categories])

  const latestBooks = useMemo(
    () => [...books].sort(byNewest).slice(0, 4),
    [books],
  )

  const featuredCategories = useMemo(
    () => [...categories].sort(byNewest).slice(0, 3),
    [categories],
  )

  const yearRange = useMemo(() => {
    const years = books
      .map((book) => Number(book.year))
      .filter((year) => Number.isFinite(year) && year > 0)
    if (years.length === 0) return '—'
    const oldest = Math.min(...years)
    const newest = Math.max(...years)
    return oldest === newest ? String(oldest) : `${oldest}–${newest}`
  }, [books])

  const statsLoading =
    (booksState.loading && books.length === 0) ||
    (categoriesState.loading && categories.length === 0)

  const stats = [
    {
      label: 'Buku di rak',
      value: formatNumber(books.length),
      note: 'judul terdaftar',
      icon: 'book',
      tone: 'acid',
    },
    {
      label: 'Kategori',
      value: formatNumber(categories.length),
      note: 'genre nongkrong',
      icon: 'tag',
      tone: 'pink',
    },
    {
      label: 'Genre unik',
      value: formatNumber(genreStats.length),
      note: 'dari kategori',
      icon: 'layers',
      tone: 'cyan',
    },
    {
      label: 'Rentang tahun',
      value: yearRange,
      note: 'tertua–terbaru',
      icon: 'calendar',
      tone: 'orange',
      small: yearRange.length > 5,
    },
  ]

  const statusText =
    health.status === 'online'
      ? 'ONLINE'
      : health.status === 'checking'
        ? 'NYAMBUNG…'
        : 'OFFLINE'

  async function submitGreeting(event) {
    event.preventDefault()
    const name = guest.trim()
    if (!name) {
      setGreetError('Isi nama dulu, baru ditembak.')
      return
    }

    setSending(true)
    setGreetError('')
    setGreeting('')
    try {
      const data = await api.system.hello(name)
      setGreeting(data?.message || `Halo, ${name}!`)
    } catch (error) {
      setGreetError(error.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="page page--dashboard">
      <section className="hero">
        <div className="hero__copy">
          <div className="hero__kicker">
            <span className="sticker sticker--acid">PILOX EDITION</span>
            <span className="hero__kicker-text">
              Arsip jalanan <span aria-hidden="true">/</span> 2026
            </span>
          </div>

          <h1 className="hero__title">
            <span>Baca</span>
            <span className="hero__outline">sampai</span>
            <span className="hero__marker">tembok</span>
            <span className="hero__acid">
              runtuh<span className="hero__paint">.</span>
            </span>
          </h1>

          <p className="hero__lead">
            Satu tembok, satu rak, satu tempat buat semua cerita. Kelola buku
            dan kategori perpustakaan langsung dari API Laravel — cepat,
            tanpa ribet, penuh warna pilox.
          </p>

          <div className="hero__actions">
            <a className="btn btn--primary" href="#/buku">
              Jelajah rak buku
              <Icon name="arrowRight" size={17} />
            </a>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => startCreate('book')}
            >
              <Icon name="plus" size={16} />
              Tempel buku
            </button>
          </div>

          <p className="hero__footnote">
            <span className={`dot dot--${health.status}`} aria-hidden="true" />
            {health.status === 'online'
              ? `API hidup · ${health.latency ?? 0} ms`
              : health.status === 'checking'
                ? 'Mengecek tembok API…'
                : 'API sedang tidur'}
            <span aria-hidden="true">•</span>
            {books.length} buku · {categories.length} kategori
          </p>
        </div>

        <div className="hero__art">
          <span className="hero__art-note">WALL SERIES / 001</span>
          <figure className="hero__poster">
            <span className="tape hero__poster-tape" aria-hidden="true" />
            <img
              src={mural}
              alt="Mural abstrak bernuansa semprotan pilox"
              width="900"
              height="1125"
            />
            <figcaption className="hero__poster-caption">
              <span>
                NO. 001
                <br />
                WALL SERIES
              </span>
              <span className="barcode" aria-hidden="true" />
              <span className="hero__poster-brand">GRAFFIOTEKA</span>
            </figcaption>
          </figure>
          <span
            className="sticker sticker--pink hero__badge hero__badge--one"
            aria-hidden="true"
          >
            GRATIS
            <br />
            MASUK
          </span>
          <span
            className="sticker sticker--cyan hero__badge hero__badge--two"
            aria-hidden="true"
          >
            NO
            <br />
            VIP
          </span>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map((copy) => (
            <div className="marquee__group" key={copy}>
              {MARQUEE_ITEMS.map((item) => (
                <span className="marquee__item" key={`${copy}-${item}`}>
                  {item}
                  <Icon name="spark" size={15} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="stats-section" aria-label="Ringkasan perpustakaan">
        {statsLoading ? (
          <StatsSkeleton />
        ) : (
          <div className="stat-grid">
            {stats.map((stat, index) => (
              <article
                className={`stat-card stat-card--${stat.tone}`}
                key={stat.label}
              >
                <div className="stat-card__top">
                  <span className="stat-card__icon">
                    <Icon name={stat.icon} size={20} />
                  </span>
                  <span className="stat-card__index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <p
                  className={`stat-card__value${stat.small ? ' stat-card__value--sm' : ''}`}
                >
                  {stat.value}
                </p>
                <p className="stat-card__label">{stat.label}</p>
                <p className="stat-card__note">{stat.note}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">FRESH OFF THE WALL</p>
            <h2 className="section-title">
              Baru nempel <span className="marker marker--pink">di rak</span>
            </h2>
          </div>
          <a className="link-arrow" href="#/buku">
            Semua buku
            <Icon name="arrowRight" size={15} />
          </a>
        </div>

        <div className="dash-split">
          <div className="panel panel--paperless dash-latest">
            {booksState.loading && books.length === 0 ? (
              <RowsSkeleton />
            ) : booksState.error && books.length === 0 ? (
              <ErrorState
                error={booksState.error}
                onRetry={booksState.reload}
              />
            ) : latestBooks.length === 0 ? (
              <EmptyState
                title="Rak masih bersih banget."
                message="Belum ada buku yang nempel. Mulai dari satu judul favoritmu."
                action={
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    onClick={() => startCreate('book')}
                  >
                    <Icon name="plus" size={15} />
                    Tambah buku
                  </button>
                }
              />
            ) : (
              <div className="book-rows">
                {latestBooks.map((book) => (
                  <a className="book-row" href="#/buku" key={book.id}>
                    <span
                      className={`book-row__id book-row__id--${accentFor(book.id)}`}
                    >
                      {padId(book.id)}
                    </span>
                    <span className="book-row__copy">
                      <span className="book-row__title">{book.title}</span>
                      <span className="book-row__meta">
                        {book.author}
                        <span aria-hidden="true">•</span>
                        {formatYear(book.year)}
                      </span>
                    </span>
                    <span className="book-row__date">
                      {formatDate(book.created_at)}
                    </span>
                    <span className="book-row__arrow" aria-hidden="true">
                      <Icon name="arrowUpRight" size={17} />
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <aside className="panel panel--paperless health-card">
            <div className="health-card__head">
              <p className="eyebrow">STASIUN API</p>
              <span className={`pill pill--${health.status}`}>
                <span
                  className={`dot dot--${health.status}`}
                  aria-hidden="true"
                />
                {statusText}
              </span>
            </div>

            <p className={`health-card__status text-${health.status}`}>
              {statusText}
            </p>
            <div className="health-card__meta">
              <span>
                LATENSI
                <strong>
                  {health.latency != null ? `${health.latency} ms` : '—'}
                </strong>
              </span>
              <span>
                ENDPOINT
                <strong>/api/baik</strong>
              </span>
            </div>

            <form className="mini-form" onSubmit={submitGreeting}>
              <label className="mini-form__label" htmlFor="guest-name">
                Uji sapaan <code>/hello/&#123;name&#125;</code>
              </label>
              <div className="mini-form__row">
                <input
                  id="guest-name"
                  type="text"
                  value={guest}
                  onChange={(event) => setGuest(event.target.value)}
                  placeholder="Nama kamu…"
                  maxLength={40}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="btn btn--primary btn--icon"
                  aria-label="Kirim sapaan ke API"
                  disabled={sending}
                >
                  <Icon name="send" size={16} />
                </button>
              </div>
            </form>

            {greeting ? (
              <p className="health-card__reply" role="status">
                <Icon name="quote" size={14} />
                {greeting}
              </p>
            ) : null}
            {greetError ? (
              <p className="health-card__error" role="alert">
                <Icon name="alert" size={14} />
                {greetError}
              </p>
            ) : null}

            <div className="health-card__foot">
              <button
                type="button"
                className="link-btn"
                onClick={health.check}
                disabled={health.status === 'checking'}
              >
                <Icon name="refresh" size={13} />
                CEK TEMBOK
              </button>
              <a className="link-arrow link-arrow--small" href="#/lab">
                Buka lab
                <Icon name="arrowRight" size={14} />
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">GENRE YANG NONGKRONG</p>
            <h2 className="section-title">
              Pilih <span className="marker marker--cyan">vibe</span> bacaan
            </h2>
          </div>
          <a className="link-arrow" href="#/kategori">
            Kelola kategori
            <Icon name="arrowRight" size={15} />
          </a>
        </div>

        {categoriesState.loading && categories.length === 0 ? (
          <div className="genre-cloud" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, index) => (
              <span className="chip chip--skeleton" key={index} />
            ))}
          </div>
        ) : genreStats.length === 0 ? (
          <EmptyState
            kicker="GENRE BELUM ADA"
            title="Tembok genre masih kosong."
            message="Bikin kategori pertamamu supaya rak punya warna."
            action={
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={() => startCreate('category')}
              >
                <Icon name="plus" size={15} />
                Tambah kategori
              </button>
            }
          />
        ) : (
          <div className="genre-cloud">
            {genreStats.map(([genre, count]) => (
              <a
                className={`genre-pill genre-pill--${accentFor(genre)}`}
                href="#/kategori"
                key={genre}
              >
                <span>{genre}</span>
                <span className="genre-pill__count">{count}</span>
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">SUDUT PILIHAN</p>
            <h2 className="section-title">
              Kategori <span className="marker marker--orange">sorotan</span>
            </h2>
          </div>
          <a className="link-arrow" href="#/kategori">
            Semua kategori
            <Icon name="arrowRight" size={15} />
          </a>
        </div>

        {featuredCategories.length === 0 ? (
          <p className="muted-note">
            Belum ada kategori untuk disorot. Tambah dulu, biar temboknya
            ramai.
          </p>
        ) : (
          <div className="mini-cat-grid">
            {featuredCategories.map((category) => (
              <a
                className={`mini-cat mini-cat--${accentFor(category.genre)}`}
                href="#/kategori"
                key={category.id}
              >
                <span className="mini-cat__genre">{category.genre}</span>
                <h3 className="mini-cat__name">{category.name}</h3>
                <p className="mini-cat__desc">
                  {truncate(
                    category.description || 'Belum ada deskripsi untuk kategori ini.',
                    96,
                  )}
                </p>
                <span className="mini-cat__foot">
                  <span>{formatDate(category.created_at)}</span>
                  <Icon name="arrowUpRight" size={16} />
                </span>
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="cta-banner">
        <span className="cta-banner__shape" aria-hidden="true" />
        <div className="cta-banner__copy">
          <p className="eyebrow eyebrow--dark">PUNYA IDE?</p>
          <h2>
            Tembok ini masih lega.
            <br />
            Semprot kategori barumu.
          </h2>
        </div>
        <button
          type="button"
          className="btn btn--dark"
          onClick={() => startCreate('category')}
        >
          Tambah kategori
          <Icon name="arrowRight" size={17} />
        </button>
      </section>
    </div>
  )
}
