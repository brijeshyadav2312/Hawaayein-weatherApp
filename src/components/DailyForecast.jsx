import { Droplets } from 'lucide-react'
import {
  formatDayLabel,
  formatShortDate,
  formatTempValue,
  getWeatherInfo,
  temperatureUnit,
} from '../lib/format'
import WeatherIcon from './WeatherIcon'

export default function DailyForecast({ days, units, weekLow, weekHigh }) {
  const span = Math.max(weekHigh - weekLow, 1)

  return (
    <section className="panel daily-panel" aria-labelledby="daily-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">7-day outlook</p>
          <h2 id="daily-heading">The week ahead</h2>
        </div>
      </div>

      <ul className="daily-list">
        {days.map((day, index) => {
          const info = getWeatherInfo(day.weatherCode, true)
          const low = formatTempValue(day.min, units)
          const high = formatTempValue(day.max, units)
          const left = Math.min(Math.max(((day.min - weekLow) / span) * 100, 0), 100)
          const width = Math.max(Math.min(((day.max - day.min) / span) * 100, 100 - left), 7)
          const label = formatDayLabel(day.date, index)

          return (
            <li
              aria-label={`${label}: ${info.label}, low ${low} degrees ${temperatureUnit(units)}, high ${high} degrees ${temperatureUnit(units)}, ${day.precipitationProbability}% chance of rain`}
              className="day-row"
              key={day.date}
            >
              <span className="day-copy">
                <strong>{label}</strong>
                <small>{formatShortDate(day.date)}</small>
              </span>

              <WeatherIcon isDay type={info.icon} size={23} />

              <span className="day-rain">
                <Droplets aria-hidden="true" size={12} />
                {day.precipitationProbability}%
              </span>

              <span className="temp-range">
                <span className="range-low">{low}°</span>
                <span className="range-track">
                  <span className="range-fill" style={{ left: `${left}%`, width: `${width}%` }} />
                </span>
                <span className="range-high">{high}°</span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
