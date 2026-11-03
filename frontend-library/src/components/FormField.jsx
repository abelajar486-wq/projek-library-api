import { Icon } from './Icon'

export default function FormField({
  label,
  htmlFor,
  error,
  hint,
  meta,
  children,
}) {
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <div className="field__top">
        <label className="field__label" htmlFor={htmlFor}>
          {label}
        </label>
        {meta ? <span className="field__meta">{meta}</span> : null}
      </div>
      {children}
      {error ? (
        <p className="field__message field__message--error" role="alert">
          <Icon name="alert" size={13} />
          {error}
        </p>
      ) : hint ? (
        <p className="field__message">{hint}</p>
      ) : null}
    </div>
  )
}
