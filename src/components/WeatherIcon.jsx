import { useEffect, useState } from 'react'
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSun,
  Moon,
  Snowflake,
  Sun,
} from 'lucide-react'
import { METEOCONS, getMeteoconSlug } from '../lib/weatherIcons'

const ICONS = {
  clear: [Sun, Moon],
  partly: [CloudSun, CloudMoon],
  cloudy: [Cloud, Cloud],
  fog: [CloudFog, CloudFog],
  drizzle: [CloudDrizzle, CloudDrizzle],
  rain: [CloudRain, CloudRain],
  showers: [CloudRain, CloudRain],
  snow: [Snowflake, Snowflake],
  thunder: [CloudLightning, CloudLightning],
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined
    }

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (event) => setReduced(event.matches)

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', handleChange)
      return () => media.removeEventListener('change', handleChange)
    }

    media.addListener(handleChange)
    return () => media.removeListener(handleChange)
  }, [])

  return reduced
}

export default function WeatherIcon({
  type = 'cloudy',
  isDay = true,
  code,
  slug,
  size = 24,
  className = '',
  strokeWidth = 1.6,
}) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [failedSource, setFailedSource] = useState('')

  const meteoconSlug =
    slug ??
    (code !== undefined && code !== null
      ? getMeteoconSlug(code, isDay)
      : getMeteoconSlug(undefined, isDay, type))

  const source = meteoconSlug ? METEOCONS[meteoconSlug] : null

  useEffect(() => {
    setFailedSource('')
  }, [source])

  const showMeteocon = Boolean(source) && source !== failedSource && !prefersReducedMotion

  if (showMeteocon) {
    return (
      <img
        alt=""
        aria-hidden="true"
        className={`weather-icon meteocon-icon ${className}`.trim()}
        decoding="async"
        draggable="false"
        height={size}
        onError={() => setFailedSource(source)}
        src={source}
        width={size}
      />
    )
  }

  const pair = ICONS[type] ?? ICONS.cloudy
  const Icon = isDay ? pair[0] : pair[1]

  return (
    <Icon
      aria-hidden="true"
      className={`weather-icon ${className}`.trim()}
      focusable="false"
      size={size}
      strokeWidth={strokeWidth}
    />
  )
}
