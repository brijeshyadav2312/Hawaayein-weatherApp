export default function LoadingState({ locationName }) {
  return (
    <>
      <p className="sr-only" role="status">
        Loading weather for {locationName}…
      </p>

      <div aria-hidden="true" className="dashboard-grid skeleton-grid">
        <div className="panel skeleton skeleton-current" />
        <div className="panel skeleton skeleton-air" />
        <div className="panel skeleton skeleton-hourly" />
        <div className="panel skeleton skeleton-sun" />
        <div className="panel skeleton skeleton-daily" />
        <div className="panel skeleton skeleton-metrics" />
      </div>
    </>
  )
}
