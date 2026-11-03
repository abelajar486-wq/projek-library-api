import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import ConfirmDialog from '../components/ConfirmDialog'
import { EmptyState, ErrorState } from '../components/EmptyState'
import EndpointPill from '../components/EndpointPill'
import FormField from '../components/FormField'
import { Icon } from '../components/Icon'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import { CardGridSkeleton } from '../components/Skeletons'
import { accentFor } from '../lib/accents'
import {
  formatDate,
  formatYear,
  initials,
  padId,
} from '../lib/format'
import {
  bookPayload,
  hasErrors,
  validateBook,
} from '../lib/validation'

const PAGE_SIZE = 9
const EMPTY_FORM = { title: '', author: '', year: '' }

const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru dulu' },
  { value: 'title', label: 'Judul A–Z' },
  { value: 'author', label: 'Penulis A–Z' },
  { value: 'year-desc', label: 'Tahun terbaru' },
  { value: 'year-asc', label: 'Tahun terlama' },
]

function yearValue(book) {
  const value = Number(book.year)
  return Number.isFinite(value) && value > 0 ? value : null
}

function newestFirst(left, right) {
  const leftDate = new Date(left.created_at || 0).getTime()
  const rightDate = new Date(right.created_at || 0).getTime()
  if (rightDate !== leftDate) return rightDate - leftDate
  return Number(right.id || 0) - Number(left.id || 0)
}

function sortBooks(books, sort) {
  const list = [...books]
  if (sort === 'title') {
    return list.sort((left, right) =>
      String(left.title || '').localeCompare(String(right.title || ''), 'id'),
    )
  }
  if (sort === 'author') {
    return list.sort((left, right) =>
      String(left.author || '').localeCompare(
        String(right.author || ''),
        'id',
      ),
    )
  }
  if (sort === 'year-desc' || sort === 'year-asc') {
    return list.sort((left, right) => {
      const leftYear = yearValue(left)
      const rightYear = yearValue(right)
      if (leftYear == null && rightYear == null) return 0
      if (leftYear == null) return 1
      if (rightYear == null) return -1
      return sort === 'year-asc'
        ? leftYear - rightYear
        : rightYear - leftYear
    })
  }
  return list.sort(newestFirst)
}

function getStoredView() {
  try {
    return localStorage.getItem('graffioteka:books-view') === 'list'
      ? 'list'
      : 'grid'
  } catch {
    return 'grid'
  }
}

function BookCard({ book, onDetail, onEdit, onDelete }) {
  const tone = accentFor(book.id)

  return (
    <article className={`book-card book-card--${tone}`}>
      <span className="book-card__spray" aria-hidden="true" />
      <div className="book-card__top">
        <span className="book-card__id">{padId(book.id)}</span>
        <span className="book-card__year">{formatYear(book.year)}</span>
      </div>
      <h3 className="book-card__title" title={book.title}>
        {book.title}
      </h3>
      <p className="book-card__author">
        <Icon name="user" size={14} />
        {book.author}
      </p>
      <div className="book-card__foot">
        <span className="book-card__date">
          <Icon name="calendar" size={13} />
          {formatDate(book.created_at)}
        </span>
        <div className="book-card__actions">
          <button
            type="button"
            className="card-action"
            onClick={() => onDetail(book)}
            aria-label={`Lihat detail ${book.title}`}
            title="Detail"
          >
            <Icon name="eye" size={15} />
          </button>
          <button
            type="button"
            className="card-action"
            onClick={() => onEdit(book)}
            aria-label={`Ubah ${book.title}`}
            title="Ubah"
          >
            <Icon name="edit" size={15} />
          </button>
          <button
            type="button"
            className="card-action card-action--danger"
            onClick={() => onDelete(book)}
            aria-label={`Hapus ${book.title}`}
            title="Hapus"
          >
            <Icon name="trash" size={15} />
          </button>
        </div>
      </div>
    </article>
  )
}

function BookTable({ books, onDetail, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Judul</th>
            <th scope="col">Penulis</th>
            <th scope="col">Tahun</th>
            <th scope="col">Ditambah</th>
            <th scope="col" className="data-table__actions-head">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td className="data-table__id">{padId(book.id)}</td>
              <td>
                <button
                  type="button"
                  className="cell-link"
                  onClick={() => onDetail(book)}
                >
                  {book.title}
                </button>
              </td>
              <td className="data-table__muted">{book.author}</td>
              <td>
                <span className="year-chip">{formatYear(book.year)}</span>
              </td>
              <td className="data-table__muted">
                {formatDate(book.created_at)}
              </td>
              <td>
                <div className="table-actions">
                  <button
                    type="button"
                    className="icon-btn icon-btn--table"
                    onClick={() => onDetail(book)}
                    aria-label={`Lihat detail ${book.title}`}
                    title="Detail"
                  >
                    <Icon name="eye" size={15} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn--table"
                    onClick={() => onEdit(book)}
                    aria-label={`Ubah ${book.title}`}
                    title="Ubah"
                  >
                    <Icon name="edit" size={15} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn--table icon-btn--danger"
                    onClick={() => onDelete(book)}
                    aria-label={`Hapus ${book.title}`}
                    title="Hapus"
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function BookDetail({ book, onClose, onEdit }) {
  const [detail, setDetail] = useState(book)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    api.books
      .get(book.id)
      .then((data) => {
        if (active) setDetail(data)
      })
      .catch((requestError) => {
        if (active) setError(requestError)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [book.id])

  const tone = accentFor(detail.id)

  return (
    <Modal
      open
      onClose={onClose}
      eyebrow="ARSIP BUKU / GET ONE"
      title="Kartu katalog"
      size="md"
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Tutup
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => onEdit(detail)}
          >
            Ubah buku
            <Icon name="edit" size={16} />
          </button>
        </>
      }
    >
      <div className="detail">
        <div className={`detail__cover detail__cover--${tone}`}>
          <span className="detail__cover-label">GRAFFIOTEKA</span>
          <strong className="detail__cover-initials">
            {initials(detail.title)}
          </strong>
          <span className="detail__cover-year">
            {formatYear(detail.year)}
          </span>
          <span className="detail__cover-barcode" aria-hidden="true" />
        </div>

        <div className="detail__main">
          <div className="detail__top">
            <span className="sticker sticker--acid">BUKU</span>
            <span className="detail__id">{padId(detail.id)}</span>
          </div>
          <h3 className="detail__title">{detail.title}</h3>
          <p className="detail__author">
            <Icon name="user" size={15} />
            {detail.author}
          </p>

          {loading ? (
            <p className="detail__status">
              <Icon name="refresh" size={14} className="is-spinning" />
              Menarik data terbaru dari API…
            </p>
          ) : null}
          {error ? (
            <p className="detail__warning" role="alert">
              <Icon name="alert" size={14} />
              Data ditampilkan dari daftar. Gagal menyegarkan: {error.message}
            </p>
          ) : null}

          <dl className="detail__meta">
            <div>
              <dt>Tahun terbit</dt>
              <dd>{formatYear(detail.year)}</dd>
            </div>
            <div>
              <dt>Ditambahkan</dt>
              <dd>{formatDate(detail.created_at, true)}</dd>
            </div>
            <div>
              <dt>Terakhir diubah</dt>
              <dd>{formatDate(detail.updated_at, true)}</dd>
            </div>
            <div>
              <dt>Endpoint</dt>
              <dd>
                <code>GET /api/books/{detail.id}</code>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Modal>
  )
}

export default function Books({
  booksState,
  compose,
  onComposeHandled,
  notify,
}) {
  const books = booksState.data
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState(getStoredView)
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const openCreate = useCallback(() => {
    setForm(EMPTY_FORM)
    setFieldErrors({})
    setFormError('')
    setModal({ type: 'create' })
  }, [])

  const openEdit = useCallback((book) => {
    setForm({
      title: book.title || '',
      author: book.author || '',
      year: book.year == null ? '' : String(book.year),
    })
    setFieldErrors({})
    setFormError('')
    setModal({ type: 'edit', book })
  }, [])

  const composeCreate = compose?.kind === 'book'
  const activeModal = modal ?? (composeCreate ? { type: 'create' } : null)

  const isFormOpen =
    activeModal?.type === 'create' || activeModal?.type === 'edit'
  const isEdit = activeModal?.type === 'edit'

  function finishCompose() {
    if (!composeCreate) return
    onComposeHandled?.()
  }

  function resetForm() {
    setForm(EMPTY_FORM)
    setFieldErrors({})
    setFormError('')
  }

  useEffect(() => {
    try {
      localStorage.setItem('graffioteka:books-view', view)
    } catch {
      /* localStorage bisa diblokir; tampilan tetap jalan */
    }
  }, [view])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const result = needle
      ? books.filter((book) =>
          [book.title, book.author, book.year, book.id].some((value) =>
            String(value ?? '')
              .toLowerCase()
              .includes(needle),
          ),
        )
      : books
    return sortBooks(result, sort)
  }, [books, query, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors((current) => {
        const next = { ...current }
        delete next[name]
        return next
      })
    }
  }

  function closeForm() {
    if (submitting) return
    setModal(null)
    resetForm()
    finishCompose()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const errors = validateBook(form)
    setFieldErrors(errors)
    if (hasErrors(errors)) {
      setFormError('Ada isian yang belum beres. Cek lagi ya.')
      return
    }

    setSubmitting(true)
    setFormError('')

    try {
      const payload = bookPayload(form)
      if (isEdit) {
        await api.books.update(modal.book.id, payload)
        notify(`Buku “${payload.title}” berhasil diperbarui.`)
      } else {
        await api.books.create(payload)
        notify(`Buku “${payload.title}” nempel di rak.`)
        setQuery('')
        setSort('newest')
        setPage(1)
      }
      await booksState.reload()
      setModal(null)
      resetForm()
      finishCompose()
    } catch (error) {
      setFormError(error.message)
      notify(error.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!modal?.book) return
    setDeleting(true)
    try {
      await api.books.remove(modal.book.id)
      notify(`Buku “${modal.book.title}” dihapus dari tembok.`)
      await booksState.reload()
      setModal(null)
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      setDeleting(false)
    }
  }

  const hasFilters = query.trim().length > 0

  return (
    <div className="page page--books">
      <header className="page-head">
        <div className="page-head__copy">
          <p className="eyebrow">KOLEKSI / 02</p>
          <h1 className="page-title">
            Rak <span className="marker marker--pink">buku</span>
          </h1>
          <p className="page-lead">
            Semua judul yang nongkrong di tembok perpustakaan. Cari, urutkan,
            ubah, atau semprot judul baru.
          </p>
          <EndpointPill method="GET" path="/api/books" />
        </div>
        <div className="page-head__aside">
          <div className="count-stamp" aria-label={`${books.length} buku`}>
            <strong>{String(books.length).padStart(2, '0')}</strong>
            <span>BUKU</span>
          </div>
          <button
            type="button"
            className="btn btn--primary"
            onClick={openCreate}
          >
            <Icon name="plus" size={17} />
            Tambah buku
          </button>
        </div>
      </header>

      <div className="toolbar">
        <div className="search-box">
          <Icon name="search" size={17} className="search-box__icon" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder="Cari judul, penulis, tahun, atau ID…"
            aria-label="Cari buku"
          />
          {query ? (
            <button
              type="button"
              className="search-box__clear"
              onClick={() => {
                setQuery('')
                setPage(1)
              }}
              aria-label="Bersihkan pencarian"
            >
              <Icon name="x" size={14} />
            </button>
          ) : null}
        </div>

        <div className="toolbar__right">
          <label className="select-wrap">
            <Icon name="sort" size={15} className="select-wrap__icon" />
            <span className="sr-only">Urutkan buku</span>
            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value)
                setPage(1)
              }}
            >
              {SORT_OPTIONS.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="view-toggle" role="group" aria-label="Tampilan">
            <button
              type="button"
              className={view === 'grid' ? 'is-active' : ''}
              onClick={() => setView('grid')}
              aria-pressed={view === 'grid'}
              title="Tampilan grid"
            >
              <Icon name="grid" size={16} />
            </button>
            <button
              type="button"
              className={view === 'list' ? 'is-active' : ''}
              onClick={() => setView('list')}
              aria-pressed={view === 'list'}
              title="Tampilan daftar"
            >
              <Icon name="list" size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="result-bar">
        <p>
          {hasFilters ? (
            <>
              Hasil untuk “<strong>{query.trim()}</strong>” ·{' '}
            </>
          ) : null}
          <strong>{filtered.length}</strong> buku
          {hasFilters ? (
            <button
              type="button"
              className="link-btn link-btn--inline"
              onClick={() => {
                setQuery('')
                setPage(1)
              }}
            >
              Reset
            </button>
          ) : null}
        </p>
        {booksState.refreshing ? (
          <span className="result-bar__sync">MENYEGARKAN…</span>
        ) : null}
      </div>

      {booksState.loading && books.length === 0 ? (
        <CardGridSkeleton count={6} />
      ) : booksState.error && books.length === 0 ? (
        <ErrorState error={booksState.error} onRetry={booksState.reload} />
      ) : filtered.length === 0 ? (
        hasFilters ? (
          <EmptyState
            icon="search"
            kicker="TIDAK KETEMU"
            title="Nggak ada yang cocok di tembok ini."
            message="Coba kata kunci lain, atau bersihkan pencarian untuk lihat semua buku."
            action={
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setQuery('')
                  setPage(1)
                }}
              >
                <Icon name="x" size={15} />
                Bersihkan pencarian
              </button>
            }
          />
        ) : (
          <EmptyState
            title="Rak masih kosong, bro."
            message="Belum ada buku yang nempel. Tempel judul pertamamu dan mulai ramaikan tembok."
            action={
              <button
                type="button"
                className="btn btn--primary"
                onClick={openCreate}
              >
                <Icon name="plus" size={16} />
                Tambah buku pertama
              </button>
            }
          />
        )
      ) : view === 'grid' ? (
        <>
          <div className="card-grid">
            {visible.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onDetail={(item) => setModal({ type: 'detail', book: item })}
                onEdit={openEdit}
                onDelete={(item) => setModal({ type: 'delete', book: item })}
              />
            ))}
          </div>
          <Pagination
            page={currentPage}
            total={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            label="buku"
          />
        </>
      ) : (
        <>
          <BookTable
            books={visible}
            onDetail={(item) => setModal({ type: 'detail', book: item })}
            onEdit={openEdit}
            onDelete={(item) => setModal({ type: 'delete', book: item })}
          />
          <Pagination
            page={currentPage}
            total={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            label="buku"
          />
        </>
      )}

      <Modal
        open={isFormOpen}
        onClose={closeForm}
        eyebrow={isEdit ? 'UBAH ARSIP / PUT' : 'BUKU BARU / POST'}
        title={isEdit ? 'Rapikan data buku' : 'Tempel buku baru'}
        dismissible={!submitting}
        footer={
          <>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={closeForm}
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              form="book-form"
              className="btn btn--primary"
              disabled={submitting}
            >
              {submitting
                ? 'MENYIMPAN…'
                : isEdit
                  ? 'Simpan perubahan'
                  : 'Tempel buku'}
              {!submitting ? (
                <Icon name={isEdit ? 'check' : 'plus'} size={16} />
              ) : null}
            </button>
          </>
        }
      >
        <form id="book-form" className="form" onSubmit={handleSubmit} noValidate>
          {formError ? (
            <div className="form-error" role="alert">
              <Icon name="alert" size={16} />
              <span>{formError}</span>
            </div>
          ) : null}

          <FormField
            label="Judul buku"
            htmlFor="book-title"
            error={fieldErrors.title}
            meta={`${form.title.length}/255`}
          >
            <input
              id="book-title"
              data-autofocus
              type="text"
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              placeholder="Contoh: Penguasa Langit Mars"
              maxLength={255}
              autoComplete="off"
              aria-invalid={Boolean(fieldErrors.title)}
            />
          </FormField>

          <FormField
            label="Penulis"
            htmlFor="book-author"
            error={fieldErrors.author}
            meta={`${form.author.length}/255`}
          >
            <input
              id="book-author"
              type="text"
              value={form.author}
              onChange={(event) => updateField('author', event.target.value)}
              placeholder="Nama penulis atau penulis jalanan"
              maxLength={255}
              autoComplete="off"
              aria-invalid={Boolean(fieldErrors.author)}
            />
          </FormField>

          <FormField
            label="Tahun terbit"
            htmlFor="book-year"
            error={fieldErrors.year}
            hint="Opsional. Boleh kosong kalau tahunnya lupa."
          >
            <input
              id="book-year"
              type="number"
              value={form.year}
              onChange={(event) => updateField('year', event.target.value)}
              placeholder="mis. 2024"
              min="1"
              max={new Date().getFullYear() + 5}
              inputMode="numeric"
              aria-invalid={Boolean(fieldErrors.year)}
            />
          </FormField>

          <p className="form__api-note">
            <Icon name="code" size={14} />
            <span>
              {isEdit
                ? `PUT /api/books/${modal?.book?.id ?? ':id'}`
                : 'POST /api/books'}
            </span>
          </p>
        </form>
      </Modal>

      {modal?.type === 'detail' ? (
        <BookDetail
          book={modal.book}
          onClose={() => setModal(null)}
          onEdit={openEdit}
        />
      ) : null}

      <ConfirmDialog
        open={modal?.type === 'delete'}
        title="Hapus buku dari rak?"
        message={
          <>
            Buku <strong>“{modal?.book?.title}”</strong> akan dihapus permanen
            lewat <code>DELETE /api/books/{modal?.book?.id}</code>.
          </>
        }
        confirmLabel="Hapus buku"
        loading={deleting}
        onCancel={() => {
          if (!deleting) setModal(null)
        }}
        onConfirm={handleDelete}
      />
    </div>
  )
}
