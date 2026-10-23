import { CloudFog, RefreshCw } from 'lucide-react'

export default function ErrorState({ message, onRetry }) {
  return (
    <section className="panel error-panel">
      <span className="error-icon">
        <CloudFog aria-hidden="true" size={34} />
      </span>
      <p className="eyebrow">Forecast unavailable</p>
      <h1>We lost the wind</h1>
      <p>{message}</p>
      <button className="primary-button" onClick={onRetry} type="button">
        <RefreshCw aria-hidden="true" size={16} />
        Try again
      </button>
      <small>You can also search for another city above.</small>
    </section>
  )
}
