export function CardGridSkeleton({ count = 6 }) {
  return (
    <div className="card-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div className="card-skeleton" key={index}>
          <div className="card-skeleton__row">
            <span className="skel skel--chip" />
            <span className="skel skel--chip" />
          </div>
          <span className="skel skel--title" />
          <span className="skel skel--title skel--short" />
          <span className="skel skel--line" />
          <span className="skel skel--line skel--short" />
          <div className="card-skeleton__foot">
            <span className="skel skel--chip" />
            <span className="skel skel--chip" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function StatsSkeleton({ count = 4 }) {
  return (
    <div className="stat-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div className="stat-card stat-card--skeleton" key={index}>
          <span className="skel skel--chip" />
          <span className="skel skel--number" />
          <span className="skel skel--line skel--short" />
        </div>
      ))}
    </div>
  )
}

export function RowsSkeleton({ count = 4 }) {
  return (
    <div className="rows-skeleton" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div className="rows-skeleton__row" key={index}>
          <span className="skel skel--chip" />
          <div className="rows-skeleton__copy">
            <span className="skel skel--title" />
            <span className="skel skel--line skel--short" />
          </div>
        </div>
      ))}
    </div>
  )
}
