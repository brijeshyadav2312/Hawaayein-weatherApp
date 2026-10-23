import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Droplets } from 'lucide-react'
import {
  formatHour,
  formatTempValue,
  getWeatherInfo,
  temperatureUnit,
} from '../lib/format'
import WeatherIcon from './WeatherIcon'

export default function HourlyForecast({ hours, units }) {
  const stripRef = useRef(null)
  const firstHour = hours[0]?.time

  useEffect(() => {
    if (stripRef.current) stripRef.current.scrollLeft = 0
  }, [firstHour])

  const scroll = (direction) => {
    const strip = stripRef.current
    if (!strip) return
    strip.scrollBy({ left: direction * Math.min(strip.clientWidth * 0.8, 420), behavior: 'smooth' })
  }

  return (
    <section className="panel hourly-panel" aria-labelledby="hourly-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Next 24 hours</p>
          <h2 id="hourly-heading">How the day unfolds</h2>
        </div>

        <div className="scroll-actions">
          <button
            aria-label="Scroll hourly forecast left"
            className="scroll-button"
            onClick={() => scroll(-1)}
            type="button"
          >
            <ChevronLeft aria-hidden="true" size={18} />
          </button>
          <button
            aria-label="Scroll hourly forecast right"
            className="scroll-button"
            onClick={() => scroll(1)}
            type="button"
          >
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        </div>
      </div>

      <ul className="hourly-strip" aria-label="Hourly forecast">
        {hours.map((hour, index) => {
          const info = getWeatherInfo(hour.weatherCode, hour.isDay)
          const label = index === 0 ? 'Now' : formatHour(hour.time)
          const temp = formatTempValue(hour.temperature, units)

          return (
            <li
              aria-label={`${label}: ${info.label}, ${temp} degrees ${temperatureUnit(units)}, ${hour.precipitationProbability}% chance of rain`}
              className={`hour-card ${index === 0 ? 'is-now' : ''}`}
              key={hour.time}
            >
              <span className="hour-time">{label}</span>
              <WeatherIcon isDay={hour.isDay} size={26} type={info.icon} />
              <strong className="hour-temp">{temp}°</strong>
              <span className="hour-rain">
                <Droplets aria-hidden="true" size={12} />
                {hour.precipitationProbability}%
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
