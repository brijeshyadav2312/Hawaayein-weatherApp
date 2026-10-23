import { ArrowDown, ArrowUp, MapPin, RefreshCw, Umbrella, Wind } from 'lucide-react'
import {
  formatClockTime,
  formatTemp,
  formatTempValue,
  formatWind,
  temperatureUnit,
} from '../lib/format'
import WeatherIcon from './WeatherIcon'

export default function CurrentWeather({
  view,
  location,
  units,
  onRefresh,
  isRefreshing,
  lastUpdated,
}) {
  const region = [location.admin1, location.country].filter(Boolean).join(', ')
  const locationMeta = region || 'Based on your device'
  const wind = formatWind(view.current.windSpeed, units)

  return (
    <article className="panel current-panel" aria-labelledby="current-weather-heading">
      <div className="current-head">
        <div className="location-block">
          <p className="eyebrow">Current weather</p>
          <h1 id="current-weather-heading">{location.name}</h1>
          <p className="location-meta">
            <MapPin aria-hidden="true" size={14} />
            <span>{locationMeta}</span>
            {view.timezoneOffset && (
              <>
                <span aria-hidden="true" className="meta-dot" />
                <span>{view.timezoneOffset}</span>
              </>
            )}
          </p>
        </div>

        <span className={`weather-pill ${view.info.isDay ? 'is-day' : 'is-night'}`}>
          {view.info.isDay ? 'Daytime' : 'Night'}
        </span>
      </div>

      <div className="current-main">
        <div className="current-icon">
          <WeatherIcon
            className="hero-weather-icon"
            isDay={view.info.isDay}
            size={170}
            slug={view.info.meteocon}
            strokeWidth={1.1}
            type={view.info.icon}
          />
        </div>

        <div className="current-temp">
          <div
            aria-label={`${formatTempValue(view.current.temperature, units)} degrees ${temperatureUnit(units)}`}
            className="temp-reading"
          >
            <span className="temp-number">{formatTempValue(view.current.temperature, units)}</span>
            <span className="temp-degree">°{temperatureUnit(units)}</span>
          </div>
          <p className="condition">{view.info.label}</p>
          <p className="feels">Feels like {formatTemp(view.current.feelsLike, units)}</p>
        </div>
      </div>

      <div className="current-foot">
        <span className="foot-stat">
          <ArrowUp aria-hidden="true" size={15} />
          High {formatTemp(view.current.high, units)}
        </span>
        <span className="foot-stat">
          <ArrowDown aria-hidden="true" size={15} />
          Low {formatTemp(view.current.low, units)}
        </span>
        <span className="foot-stat">
          <Umbrella aria-hidden="true" size={15} />
          {view.nextRainChance}% rain
        </span>
        <span className="foot-stat">
          <Wind aria-hidden="true" size={15} />
          {wind.value} {wind.unit}
        </span>
        <button
          aria-label="Refresh weather"
          className="refresh-button"
          disabled={isRefreshing}
          onClick={onRefresh}
          title="Refresh forecast"
          type="button"
        >
          <RefreshCw aria-hidden="true" className={isRefreshing ? 'spin' : ''} size={15} />
          <span>{isRefreshing ? 'Updating…' : 'Refresh'}</span>
        </button>
      </div>

      <p className="updated-line" role="status">
        {isRefreshing
          ? 'Updating forecast…'
          : lastUpdated
            ? `Updated ${formatClockTime(lastUpdated)}`
            : `As of ${view.updatedLabel}`}
        <span aria-hidden="true"> · </span>
        {view.timezoneOffset}
      </p>
    </article>
  )
}
