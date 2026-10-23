import {
  ArrowUp,
  Cloud,
  Droplets,
  Eye,
  Gauge,
  Sun,
  Thermometer,
  Umbrella,
  Wind,
} from 'lucide-react'
import {
  formatPrecip,
  formatPressure,
  formatTemp,
  formatVisibility,
  formatWind,
  getUvInfo,
  getVisibilityLabel,
  getWindDirection,
} from '../lib/format'

function MetricCard({ children, className = '', hint, icon: Icon, label, value }) {
  return (
    <div className={`metric-card ${className}`.trim()}>
      <div className="metric-top">
        <span className="metric-label">{label}</span>
        <span className="metric-icon">
          <Icon aria-hidden="true" size={16} />
        </span>
      </div>
      <p className="metric-value">{value}</p>
      {hint && <p className="metric-hint">{hint}</p>}
      {children}
    </div>
  )
}

export default function MetricsGrid({ view, units }) {
  const wind = formatWind(view.current.windSpeed, units)
  const gust = formatWind(view.current.windGust, units)
  const direction = getWindDirection(view.current.windDirection)
  const uv = getUvInfo(view.current.uvIndex)
  const dewPoint = Number.isFinite(view.current.dewPoint)
    ? `Dew point ${formatTemp(view.current.dewPoint, units)}`
    : 'Dew point unavailable'

  return (
    <section className="panel metrics-panel" aria-labelledby="metrics-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Details</p>
          <h2 id="metrics-heading">Right now</h2>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard
          hint={`High ${formatTemp(view.current.high, units)} · Low ${formatTemp(view.current.low, units)}`}
          icon={Thermometer}
          label="Feels like"
          value={formatTemp(view.current.feelsLike, units)}
        />

        <MetricCard
          hint={dewPoint}
          icon={Droplets}
          label="Humidity"
          value={`${view.current.humidity}%`}
        />

        <MetricCard
          hint={`Gusts ${gust.value} ${gust.unit}`}
          icon={Wind}
          label="Wind"
          value={`${wind.value} ${wind.unit}`}
        >
          <div className="wind-direction">
            <span className="compass-icon">
              <ArrowUp
                aria-hidden="true"
                size={13}
                style={{ transform: `rotate(${view.current.windDirection}deg)` }}
              />
            </span>
            <span>
              {direction} · {Math.round(view.current.windDirection)}°
            </span>
          </div>
        </MetricCard>

        <MetricCard
          hint={uv.label}
          icon={Sun}
          label="UV index"
          value={Number.isFinite(view.current.uvIndex) ? view.current.uvIndex.toFixed(1) : '—'}
        />

        <MetricCard
          hint={`Today ${formatPrecip(view.today.precipitationSum, units)}`}
          icon={Umbrella}
          label="Rain chance"
          value={`${view.nextRainChance}%`}
        />

        <MetricCard
          hint={getVisibilityLabel(view.current.visibility)}
          icon={Eye}
          label="Visibility"
          value={formatVisibility(view.current.visibility, units)}
        />

        <MetricCard
          hint="Sea level"
          icon={Gauge}
          label="Pressure"
          value={formatPressure(view.current.pressure, units)}
        />

        <MetricCard
          hint={`${view.current.cloudCover}% of the sky covered`}
          icon={Cloud}
          label="Cloud cover"
          value={`${view.current.cloudCover}%`}
        />
      </div>
    </section>
  )
}
