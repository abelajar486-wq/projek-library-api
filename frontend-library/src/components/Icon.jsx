const paths = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5V5a2 2 0 0 1 2-2h13v17H6.5A2.5 2.5 0 0 0 4 22.5z" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H19" />
      <path d="M8 7h7M8 10.5h5" />
    </>
  ),
  tag: (
    <>
      <path d="M20.6 13.4 12.6 21.4a2 2 0 0 1-2.8 0L3 14.6V3h11.6l6.9 6.9a2 2 0 0 1 0 3.5z" />
      <circle cx="7.6" cy="7.6" r="1.5" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m7 9 3 3-3 3M13 15h4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4L19 9l-4-4L4 16z" />
      <path d="m13 7 4 4" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9 7V5h6v2M6 7l1 14h10l1-14" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m4 12 5 5L20 6" />,
  alert: (
    <>
      <path d="M12 3 2.5 20h19z" />
      <path d="M12 9v5M12 17.4v.1" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  grid: (
    <>
      <rect x="4" y="4" width="6" height="6" />
      <rect x="14" y="4" width="6" height="6" />
      <rect x="4" y="14" width="6" height="6" />
      <rect x="14" y="14" width="6" height="6" />
    </>
  ),
  list: (
    <>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="4.5" cy="6" r="1" />
      <circle cx="4.5" cy="12" r="1" />
      <circle cx="4.5" cy="18" r="1" />
    </>
  ),
  chevronLeft: <path d="m15 5-7 7 7 7" />,
  chevronRight: <path d="m9 5 7 7-7 7" />,
  arrowRight: <path d="M4 12h15M13 6l6 6-6 6" />,
  arrowUpRight: <path d="M7 17 17 7M9 7h8v8" />,
  spray: (
    <>
      <path d="M9 8h6v13H9z" />
      <path d="M10 8V5h4v3" />
      <path d="M12 5V3" />
      <path d="M17 4h.01M19 6h.01M20.5 3h.01M18 9h.01M21 8h.01" />
    </>
  ),
  spark: <path d="m12 2 2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />,
  refresh: (
    <>
      <path d="M21 12a9 9 0 1 1-2.6-6.4" />
      <path d="M21 4v5h-5" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6M20 4 11 13" />
      <path d="M19 14v5H5V5h5" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="12" height="12" rx="1.5" />
      <path d="M5 15H4V4h11v1" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" />
    </>
  ),
  wifi: (
    <>
      <path d="M2 9a16 16 0 0 1 20 0M5.5 12.5a11 11 0 0 1 13 0M9 16a6 6 0 0 1 6 0" />
      <circle cx="12" cy="19.5" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  wifiOff: (
    <>
      <path d="M2 9a16 16 0 0 1 6-3.7M13 5.1A16 16 0 0 1 22 9M5.5 12.5a11 11 0 0 1 3.2-2M15 10.7a11 11 0 0 1 3.5 1.8M9 16a6 6 0 0 1 3.2-.9M2 2l20 20" />
      <circle cx="12" cy="19.5" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  send: (
    <>
      <path d="m22 2-7 20-4-9-9-4z" />
      <path d="M22 2 11 13" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.1" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  hash: <path d="M9 3 7 21M17 3l-2 18M3 9h18M2 15h18" />,
  filter: <path d="M3 5h18l-7 8v6l-4 2v-8z" />,
  sort: <path d="M8 4v16M4 8l4-4 4 4M16 20V4M12 16l4 4 4-4" />,
  code: <path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16" />,
  quote: (
    <>
      <path d="M4 12c0-4 2-7 5-8M4 12h5v7H4zM15 12c0-4 2-7 5-8M15 12h5v7h-5z" />
    </>
  ),
}

export function Icon({ name, size = 18, strokeWidth = 1.8, className = '', ...rest }) {
  const glyph = paths[name]
  if (!glyph) return null

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {glyph}
    </svg>
  )
}
