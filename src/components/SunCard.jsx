import { Sun, Sunrise, Sunset } from 'lucide-react'
import { formatTime } from '../lib/format'

export default function SunCard({ view }) {
  const percent = Math.round(view.dayProgress * 100)
  const status =
    view.dayProgress >= 1
      ? 'Sun has set'
      : view.dayProgress <= 0
        ? 'Before sunrise'
        : `${percent}% of daylight`

  return (
    <section className="panel sun-panel" aria-labelledby="sun-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Sun & daylight</p>
          <h2 id="sun-heading">Chasing the light</h2>
        </div>
        <span className="panel-icon sun-icon">
          <Sun aria-hidden="true" size={18} />
        </span>
      </div>

      <div className="sun-times">
        <div className="sun-time">
          <span>
            <Sunrise aria-hidden="true" size={17} />
            Sunrise
          </span>
          <strong>{formatTime(view.current.sunrise)}</strong>
        </div>
        <div className="sun-time">
          <span>
            <Sunset aria-hidden="true" size={17} />
            Sunset
          </span>
          <strong>{formatTime(view.current.sunset)}</strong>
        </div>
      </div>

      <div className="daylight-bar" aria-hidden="true">
        <span className="daylight-fill" style={{ width: `${view.dayProgress * 100}%` }} />
        <span className="daylight-marker" style={{ left: `${view.dayProgress * 100}%` }} />
      </div>

      <div className="daylight-meta">
        <span>{view.dayLength} daylight</span>
        <span>{status}</span>
      </div>
    </section>
  )
}
