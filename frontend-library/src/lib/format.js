const DATE_FORMAT = { day: '2-digit', month: 'short', year: 'numeric' }

export function formatDate(value, withTime = false) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('id-ID', {
    ...DATE_FORMAT,
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  })
}

export function formatClock(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export function formatNumber(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '—'
  return new Intl.NumberFormat('id-ID').format(number)
}

export function formatYear(value) {
  const number = Number(value)
  if (!Number.isFinite(number) || number <= 0) return '—'
  return String(number)
}

export function padId(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '—'
  return `#${String(number).padStart(3, '0')}`
}

export function todayLabel() {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function truncate(value, length = 120) {
  const text = String(value || '').trim()
  if (text.length <= length) return text
  return `${text.slice(0, length - 1).trimEnd()}…`
}

export function initials(value) {
  return String(value || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}
