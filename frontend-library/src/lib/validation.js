const CURRENT_YEAR = new Date().getFullYear()

export function validateBook(values) {
  const errors = {}
  const title = values.title.trim()
  const author = values.author.trim()
  const year = String(values.year ?? '').trim()

  if (!title) errors.title = 'Judul buku wajib diisi.'
  else if (title.length > 255) errors.title = 'Judul maksimal 255 karakter.'

  if (!author) errors.author = 'Nama penulis wajib diisi.'
  else if (author.length > 255) errors.author = 'Nama penulis maksimal 255 karakter.'

  if (year) {
    const number = Number(year)
    if (!Number.isInteger(number) || number < 1 || number > CURRENT_YEAR + 5) {
      errors.year = `Tahun harus bilangan bulat 1–${CURRENT_YEAR + 5}.`
    }
  }

  return errors
}

export function bookPayload(values) {
  const year = String(values.year ?? '').trim()
  return {
    title: values.title.trim(),
    author: values.author.trim(),
    year: year === '' ? null : Number(year),
  }
}

export function validateCategory(values) {
  const errors = {}
  const name = values.name.trim()
  const genre = values.genre.trim()
  const description = values.description.trim()

  if (!name) errors.name = 'Nama kategori wajib diisi.'
  else if (name.length > 255) errors.name = 'Nama kategori maksimal 255 karakter.'

  if (!genre) errors.genre = 'Genre wajib diisi.'
  else if (genre.length > 255) errors.genre = 'Genre maksimal 255 karakter.'

  if (description.length > 1000) {
    errors.description = 'Deskripsi maksimal 1.000 karakter.'
  }

  return errors
}

export function categoryPayload(values) {
  return {
    name: values.name.trim(),
    genre: values.genre.trim(),
    description: values.description.trim() || null,
  }
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}
