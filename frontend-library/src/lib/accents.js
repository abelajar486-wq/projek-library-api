const ACCENTS = ['acid', 'pink', 'cyan', 'orange', 'violet']

export function accentFor(value) {
  const text = String(value ?? '')
  let hash = 0
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0
  }
  return ACCENTS[hash % ACCENTS.length]
}

export const GENRE_SUGGESTIONS = [
  'Novel',
  'Non-Fiksi',
  'Ilmu Pengetahuan',
  'Pendidikan',
  'Sejarah',
  'Komik',
  'Puisi',
  'Bianglala',
]
