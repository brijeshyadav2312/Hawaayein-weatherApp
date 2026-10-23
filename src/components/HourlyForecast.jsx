import { useCallback, useEffect, useRef, useState } from 'react'
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
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: hours.length > 4,
  })
  const firstHour = hours[0]?.time

  const updateScrollState = useCallback(() => {
    const strip = stripRef.current
    if (!strip) return

    const maxScroll = Math.max(0, strip.scrollWidth - strip.clientWidth)
    setScrollState({
      canScrollLeft: strip.scrollLeft > 4,
      canScrollRight: maxScroll > 4 && strip.scrollLeft < maxScroll - 4,
    })
  }, [])

  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return undefined

    updateScrollState()
    const rafId = requestAnimationFrame(updateScrollState)
    const timeoutId = setTimeout(updateScrollState, 80)

    strip.addEventListener('scroll', updateScrollState, { passive: true })

    let observer = null
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateScrollState)
      observer.observe(strip)
    } else {
      window.addEventListener('resize', updateScrollState)
    }

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(timeoutId)
      strip.removeEventListener('scroll', updateScrollState)
      if (observer) {
        observer.disconnect()
      } else {
        window.removeEventListener('resize', updateScrollState)
      }
    }
  }, [hours.length, updateScrollState])

  useEffect(() => {
    if (stripRef.current) stripRef.current.scrollLeft = 0
    updateScrollState()
  }, [firstHour, updateScrollState])

  const scroll = (direction) => {
    const strip = stripRef.current
    if (!strip) return

    const card = strip.querySelector('.hour-card')
    const cardWidth = card ? card.getBoundingClientRect().width : 76
    const step = cardWidth + 8
    const visibleCards = Math.max(Math.floor(strip.clientWidth / step), 1)
    const delta = direction * step * Math.max(1, visibleCards - 1)

    if (typeof strip.scrollBy === 'function') {
      strip.scrollBy({ left: delta, behavior: 'smooth' })
    } else {
      strip.scrollLeft += delta
    }

    setTimeout(updateScrollState, 200)
    setTimeout(updateScrollState, 450)
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
            aria-controls="hourly-strip"
            aria-label="Previous hours"
            className="scroll-button"
            disabled={!scrollState.canScrollLeft}
            onClick={() => scroll(-1)}
            title="Scroll left"
            type="button"
          >
            <ChevronLeft aria-hidden="true" size={18} />
          </button>
          <button
            aria-controls="hourly-strip"
            aria-label="Next hours"
            className="scroll-button"
            disabled={!scrollState.canScrollRight}
            onClick={() => scroll(1)}
            title="Scroll right"
            type="button"
          >
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        </div>
      </div>

      <ul
        className="hourly-strip"
        aria-label="Hourly forecast"
        id="hourly-strip"
        ref={stripRef}
      >
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
              <WeatherIcon isDay={hour.isDay} size={36} slug={info.meteocon} type={info.icon} />
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
