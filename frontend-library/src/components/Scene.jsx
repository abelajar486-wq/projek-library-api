import wall from '../assets/wall.jpg'

export default function Scene() {
  return (
    <div className="scene" aria-hidden="true">
      <div
        className="scene__wall"
        style={{ backgroundImage: `url(${wall})` }}
      />
      <div className="scene__shade" />
      <div className="scene__spray scene__spray--pink" />
      <div className="scene__spray scene__spray--acid" />
      <div className="scene__spray scene__spray--cyan" />

      <svg
        className="scene__tag scene__tag--top"
        viewBox="0 0 420 320"
        fill="none"
      >
        <path
          d="M22 268c48-104 82-212 150-224 58-10 66 86 28 150-42 70-110 86-152 54-36-27 12-96 96-120 86-24 172 10 244 82"
          stroke="currentColor"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          d="M44 64c58 22 124 40 196 30"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="2 18"
        />
      </svg>

      <svg
        className="scene__tag scene__tag--bottom"
        viewBox="0 0 440 320"
        fill="none"
      >
        <circle
          cx="220"
          cy="160"
          r="126"
          stroke="currentColor"
          strokeWidth="16"
          strokeDasharray="320 58"
          transform="rotate(-28 220 160)"
        />
        <path
          d="M70 268 168 84l46 116 58-76 92 144"
          stroke="currentColor"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="scene__grain" />
    </div>
  )
}
