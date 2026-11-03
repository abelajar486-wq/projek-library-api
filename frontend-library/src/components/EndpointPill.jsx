export function MethodBadge({ method = 'GET' }) {
  return (
    <span className={`method method--${method.toLowerCase()}`}>{method}</span>
  )
}

export default function EndpointPill({ method = 'GET', path }) {
  return (
    <span className="endpoint-pill">
      <MethodBadge method={method} />
      <code>{path}</code>
    </span>
  )
}
