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
import { accentFor, GENRE_SUGGESTIONS } from '../lib/accents'
import {
  formatDate,
  initials,
  padId,
  truncate,
} from '../lib/format'
import {
  categoryPayload,
  hasErrors,
  validateCategory,
} from '../lib/validation'

const PAGE_SIZE = 9
const EMPTY_FORM = { name: '', genre: '', description: '' }

const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru dulu' },
  { value: 'name', label: 'Nama A–Z' },
  { value: 'genre', label: 'Genre A–Z' },
]

function newestFirst(left, right) {
  const leftDate = new Date(left.created_at || 0).getTime()
  const rightDate = new Date(right.created_at || 0).getTime()
  if (rightDate !== leftDate) return rightDate - leftDate
  return Number(right.id || 0) - Number(left.id || 0)
}

function sortCategories(categories, sort) {
  const list = [...categories]
  if (sort === 'name') {
    return list.sort((left, right) =>
      String(left.name || '').localeCompare(String(right.name || ''), 'id'),
    )
  }
  if (sort === 'genre') {
    return list.sort((left, right) => {
      const byGenre = String(left.genre || '').localeCompare(
        String(right.genre || ''),
        'id',
      )
      if (byGenre !== 0) return byGenre
      return String(left.name || '').localeCompare(String(right.name || ''), 'id')
    })
  }
  return list.sort(newestFirst)
}

function CategoryCard({ category, onDetail, onEdit, onDelete }) {
  const tone = accentFor(category.genre)

  return (
    <article className={`category-card category-card--${tone}`}>
      <span className="category-card__shape" aria-hidden="true" />
      <div className="category-card__top">
        <span className="genre-sticker">{category.genre}</span>
        <span className="category-card__id">{padId(category.id)}</span>
      </div>
      <h3 className="category-card__name">{category.name}</h3>
      <p className="category-card__desc">
        {category.description
          ? truncate(category.description, 150)
          : 'Belum ada deskripsi. Tulis sedikit cerita biar genrenya makin hidup.'}
      </p>
      <div className="category-card__foot">
        <span className="category-card__date">
          <Icon name="calendar" size={13} />
          {formatDate(category.created_at)}
        </span>
        <div className="book-card__actions">
          <button
            type="button"
            className="card-action"
            onClick={() => onDetail(category)}
            aria-label={`Lihat detail ${category.name}`}
            title="Detail"
          >
            <Icon name="eye" size={15} />
          </button>
          <button
            type="button"
            className="card-action"
            onClick={() => onEdit(category)}
            aria-label={`Ubah ${category.name}`}
            title="Ubah"
          >
            <Icon name="edit" size={15} />
          </button>
          <button
            type="button"
            className="card-action card-action--danger"
            onClick={() => onDelete(category)}
            aria-label={`Hapus ${category.name}`}
            title="Hapus"
          >
            <Icon name="trash" size={15} />
          </button>
        </div>
      </div>
    </article>
  )
}

function CategoryDetail({ category, onClose, onEdit }) {
  const [detail, setDetail] = useState(category)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    api.categories
      .get(category.id)
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
  }, [category.id])

  const tone = accentFor(detail.genre)

  return (
    <Modal
      open
      onClose={onClose}
      eyebrow="ARSIP KATEGORI / GET ONE"
      title="Genre file"
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
            Ubah kategori
            <Icon name="edit" size={16} />
          </button>
        </>
      }
    >
      <div className="detail">
        <div className={`detail__cover detail__cover--${tone}`}>
          <span className="detail__cover-label">GENRE FILE</span>
          <strong className="detail__cover-initials">
            {initials(detail.name)}
          </strong>
          <span className="detail__cover-year detail__cover-year--genre">
            {detail.genre}
          </span>
          <span className="detail__cover-barcode" aria-hidden="true" />
        </div>

        <div className="detail__main">
          <div className="detail__top">
            <span className={`sticker sticker--${tone}`}>{detail.genre}</span>
            <span className="detail__id">{padId(detail.id)}</span>
          </div>
          <h3 className="detail__title">{detail.name}</h3>
          <p className="detail__desc">
            {detail.description || 'Belum ada deskripsi untuk kategori ini.'}
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
              <dt>Genre</dt>
              <dd>{detail.genre}</dd>
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
                <code>GET /api/categories/{detail.id}</code>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Modal>
  )
}

export default function Categories({
  categoriesState,
  compose,
  onComposeHandled,
  notify,
}) {
  const categories = categoriesState.data
  const [query, setQuery] = useState('')
  const [genreFilter, setGenreFilter] = useState('all')
  const [sort, setSort] = useState('newest')
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

  const openEdit = useCallback((category) => {
    setForm({
      name: category.name || '',
      genre: category.genre || '',
      description: category.description || '',
    })
    setFieldErrors({})
    setFormError('')
    setModal({ type: 'edit', category })
  }, [])

  const composeCreate = compose?.kind === 'category'
  const activeModal = modal ?? (composeCreate ? { type: 'create' } : null)

  const isFormOpen =
    activeModal?.type === 'create' || activeModal?.type === 'edit'
  const isEdit = activeModal?.type === 'edit'
  const hasFilters = query.trim().length > 0 || genreFilter !== 'all'

  function finishCompose() {
    if (!composeCreate) return
    onComposeHandled?.()
  }

  function resetForm() {
    setForm(EMPTY_FORM)
    setFieldErrors({})
    setFormError('')
  }

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

  const genreOptions = useMemo(() => {
    const values = new Set([
      ...GENRE_SUGGESTIONS,
      ...genreStats.map(([genre]) => genre),
    ])
    return [...values].filter(Boolean).sort((left, right) => left.localeCompare(right, 'id'))
  }, [genreStats])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const result = categories.filter((category) => {
      if (genreFilter !== 'all' && category.genre !== genreFilter) return false
      if (!needle) return true
      return [category.name, category.genre, category.description, category.id].some(
        (value) =>
          String(value ?? '')
            .toLowerCase()
            .includes(needle),
      )
    })
    return sortCategories(result, sort)
  }, [categories, query, genreFilter, sort])

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

  function clearFilters() {
    setQuery('')
    setGenreFilter('all')
    setPage(1)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const errors = validateCategory(form)
    setFieldErrors(errors)
    if (hasErrors(errors)) {
      setFormError('Ada isian yang belum beres. Cek lagi ya.')
      return
    }

    setSubmitting(true)
    setFormError('')

    try {
      const payload = categoryPayload(form)
      if (isEdit) {
        await api.categories.update(modal.category.id, payload)
        notify(`Kategori “${payload.name}” berhasil diperbarui.`)
      } else {
        await api.categories.create(payload)
        notify(`Kategori “${payload.name}” nempel di tembok.`)
        setQuery('')
        setGenreFilter('all')
        setSort('newest')
        setPage(1)
      }
      await categoriesState.reload()
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
    if (!modal?.category) return
    setDeleting(true)
    try {
      await api.categories.remove(modal.category.id)
      notify(`Kategori “${modal.category.name}” dihapus dari tembok.`)
      await categoriesState.reload()
      setModal(null)
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="page page--categories">
      <header className="page-head">
        <div className="page-head__copy">
          <p className="eyebrow">PETA GENRE / 03</p>
          <h1 className="page-title">
            Peta <span className="marker marker--cyan">kategori</span>
          </h1>
          <p className="page-lead">
            Kelompokkan bacaan berdasarkan genre, vibe, dan cerita. Satu
            kategori, satu warna baru untuk tembok.
          </p>
          <EndpointPill method="GET" path="/api/categories" />
        </div>
        <div className="page-head__aside">
          <div
            className="count-stamp count-stamp--cyan"
            aria-label={`${categories.length} kategori`}
          >
            <strong>{String(categories.length).padStart(2, '0')}</strong>
            <span>KATEGORI</span>
          </div>
          <button
            type="button"
            className="btn btn--primary"
            onClick={openCreate}
          >
            <Icon name="plus" size={17} />
            Tambah kategori
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
            placeholder="Cari nama kategori, genre, atau deskripsi…"
            aria-label="Cari kategori"
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
            <span className="sr-only">Urutkan kategori</span>
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
        </div>
      </div>

      <div className="chip-row" aria-label="Filter genre">
        <button
          type="button"
          className={`chip${genreFilter === 'all' ? ' is-active' : ''}`}
          onClick={() => {
            setGenreFilter('all')
            setPage(1)
          }}
          aria-pressed={genreFilter === 'all'}
        >
          Semua
          <span>{categories.length}</span>
        </button>
        {genreStats.map(([genre, count]) => (
          <button
            type="button"
            key={genre}
            className={`chip${genreFilter === genre ? ' is-active' : ''}`}
            onClick={() => {
              setGenreFilter(genre)
              setPage(1)
            }}
            aria-pressed={genreFilter === genre}
          >
            {genre}
            <span>{count}</span>
          </button>
        ))}
      </div>

      <div className="result-bar">
        <p>
          {hasFilters ? (
            <>
              Filter aktif ·{' '}
            </>
          ) : null}
          <strong>{filtered.length}</strong> kategori
          {hasFilters ? (
            <button
              type="button"
              className="link-btn link-btn--inline"
              onClick={clearFilters}
            >
              Reset
            </button>
          ) : null}
        </p>
        {categoriesState.refreshing ? (
          <span className="result-bar__sync">MENYEGARKAN…</span>
        ) : null}
      </div>

      {categoriesState.loading && categories.length === 0 ? (
        <CardGridSkeleton count={6} />
      ) : categoriesState.error && categories.length === 0 ? (
        <ErrorState
          error={categoriesState.error}
          onRetry={categoriesState.reload}
        />
      ) : filtered.length === 0 ? (
        hasFilters ? (
          <EmptyState
            icon="filter"
            kicker="FILTER KETAT"
            title="Nggak ada kategori yang lolos."
            message="Coba kata kunci atau genre lain, lalu semprot lagi."
            action={
              <button
                type="button"
                className="btn btn--ghost"
                onClick={clearFilters}
              >
                <Icon name="x" size={15} />
                Reset filter
              </button>
            }
          />
        ) : (
          <EmptyState
            icon="tag"
            kicker="GENRE MASIH KOSONG"
            title="Belum ada peta genre."
            message="Tambah kategori pertama supaya rak punya arah dan warna."
            action={
              <button
                type="button"
                className="btn btn--primary"
                onClick={openCreate}
              >
                <Icon name="plus" size={16} />
                Tambah kategori pertama
              </button>
            }
          />
        )
      ) : (
        <>
          <div className="card-grid">
            {visible.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onDetail={(item) => setModal({ type: 'detail', category: item })}
                onEdit={openEdit}
                onDelete={(item) =>
                  setModal({ type: 'delete', category: item })
                }
              />
            ))}
          </div>
          <Pagination
            page={currentPage}
            total={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            label="kategori"
          />
        </>
      )}

      <Modal
        open={isFormOpen}
        onClose={closeForm}
        eyebrow={isEdit ? 'UBAH KATEGORI / PUT' : 'KATEGORI BARU / POST'}
        title={isEdit ? 'Rapikan kategori' : 'Semprot kategori baru'}
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
              form="category-form"
              className="btn btn--primary"
              disabled={submitting}
            >
              {submitting
                ? 'MENYIMPAN…'
                : isEdit
                  ? 'Simpan perubahan'
                  : 'Semprot kategori'}
              {!submitting ? (
                <Icon name={isEdit ? 'check' : 'spray'} size={16} />
              ) : null}
            </button>
          </>
        }
      >
        <form
          id="category-form"
          className="form"
          onSubmit={handleSubmit}
          noValidate
        >
          {formError ? (
            <div className="form-error" role="alert">
              <Icon name="alert" size={16} />
              <span>{formError}</span>
            </div>
          ) : null}

          <FormField
            label="Nama kategori"
            htmlFor="category-name"
            error={fieldErrors.name}
            meta={`${form.name.length}/255`}
          >
            <input
              id="category-name"
              data-autofocus
              type="text"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Contoh: Buku Materi Kelas 10 IPA"
              maxLength={255}
              autoComplete="off"
              aria-invalid={Boolean(fieldErrors.name)}
            />
          </FormField>

          <FormField
            label="Genre"
            htmlFor="category-genre"
            error={fieldErrors.genre}
            hint="Pilih dari daftar atau tulis genre baru."
            meta={`${form.genre.length}/255`}
          >
            <input
              id="category-genre"
              type="text"
              value={form.genre}
              onChange={(event) => updateField('genre', event.target.value)}
              placeholder="mis. Novel, Non-Fiksi, Sejarah…"
              maxLength={255}
              list="genre-options"
              autoComplete="off"
              aria-invalid={Boolean(fieldErrors.genre)}
            />
            <datalist id="genre-options">
              {genreOptions.map((genre) => (
                <option value={genre} key={genre} />
              ))}
            </datalist>
          </FormField>

          <FormField
            label="Deskripsi"
            htmlFor="category-description"
            error={fieldErrors.description}
            meta={`${form.description.length}/1000`}
          >
            <textarea
              id="category-description"
              rows={4}
              value={form.description}
              onChange={(event) =>
                updateField('description', event.target.value)
              }
              placeholder="Ceritakan isi kategori ini dengan gayamu sendiri…"
              maxLength={1000}
              aria-invalid={Boolean(fieldErrors.description)}
            />
          </FormField>

          <p className="form__api-note">
            <Icon name="code" size={14} />
            <span>
              {isEdit
                ? `PUT /api/categories/${modal?.category?.id ?? ':id'}`
                : 'POST /api/categories'}
            </span>
          </p>
        </form>
      </Modal>

      {modal?.type === 'detail' ? (
        <CategoryDetail
          category={modal.category}
          onClose={() => setModal(null)}
          onEdit={openEdit}
        />
      ) : null}

      <ConfirmDialog
        open={modal?.type === 'delete'}
        title="Hapus kategori ini?"
        message={
          <>
            Kategori <strong>“{modal?.category?.name}”</strong> akan dihapus
            permanen lewat <code>DELETE /api/categories/{modal?.category?.id}</code>.
          </>
        }
        confirmLabel="Hapus kategori"
        loading={deleting}
        onCancel={() => {
          if (!deleting) setModal(null)
        }}
        onConfirm={handleDelete}
      />
    </div>
  )
}
