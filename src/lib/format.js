export const WEATHER_CODES = {
  0: { label: 'Clear sky', icon: 'clear' },
  1: { label: 'Mainly clear', icon: 'partly' },
  2: { label: 'Partly cloudy', icon: 'partly' },
  3: { label: 'Overcast', icon: 'cloudy' },
  45: { label: 'Fog', icon: 'fog' },
  48: { label: 'Rime fog', icon: 'fog' },
  51: { label: 'Light drizzle', icon: 'drizzle' },
  53: { label: 'Moderate drizzle', icon: 'drizzle' },
  55: { label: 'Dense drizzle', icon: 'drizzle' },
  56: { label: 'Light freezing drizzle', icon: 'drizzle' },
  57: { label: 'Dense freezing drizzle', icon: 'drizzle' },
  61: { label: 'Slight rain', icon: 'rain' },
  63: { label: 'Moderate rain', icon: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain' },
  66: { label: 'Light freezing rain', icon: 'rain' },
  67: { label: 'Heavy freezing rain', icon: 'rain' },
  71: { label: 'Slight snow', icon: 'snow' },
  73: { label: 'Moderate snow', icon: 'snow' },
  75: { label: 'Heavy snow', icon: 'snow' },
  77: { label: 'Snow grains', icon: 'snow' },
  80: { label: 'Slight rain showers', icon: 'showers' },
  81: { label: 'Moderate rain showers', icon: 'showers' },
  82: { label: 'Violent rain showers', icon: 'showers' },
  85: { label: 'Slight snow showers', icon: 'snow' },
  86: { label: 'Heavy snow showers', icon: 'snow' },
  95: { label: 'Thunderstorm', icon: 'thunder' },
  96: { label: 'Thunderstorm with hail', icon: 'thunder' },
  99: { label: 'Severe thunderstorm with hail', icon: 'thunder' },
}

const WIND_DIRECTIONS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
]

export function parseLocalDateTime(value) {
  if (typeof value !== 'string') return null

  const [datePart, timePart = '00:00'] = value.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour, minute] = timePart.split(':').map(Number)
  const parts = [year, month, day, hour, minute]

  if (parts.some((part) => !Number.isFinite(part))) return null

  return { year, month, day, hour, minute }
}

export function formatTime(value) {
  const parts = parseLocalDateTime(value)
  if (!parts) return '—'

  const suffix = parts.hour >= 12 ? 'PM' : 'AM'
  const hour = parts.hour % 12 || 12
  return `${hour}:${String(parts.minute).padStart(2, '0')} ${suffix}`
}

export function formatHour(value) {
  const parts = parseLocalDateTime(value)
  if (!parts) return '—'

  const suffix = parts.hour >= 12 ? 'PM' : 'AM'
  return `${parts.hour % 12 || 12} ${suffix}`
}

export function formatDayLabel(date, index) {
  if (index === 0) return 'Today'
  if (index === 1) return 'Tomorrow'

  const parsed = new Date(`${date}T12:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return date

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: 'UTC',
  }).format(parsed)
}

export function formatShortDate(date) {
  const parsed = new Date(`${date}T12:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return date

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(parsed)
}

export function formatUtcOffset(seconds) {
  if (!Number.isFinite(seconds)) return 'Local time'

  const sign = seconds >= 0 ? '+' : '-'
  const totalMinutes = Math.round(Math.abs(seconds) / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function convertTemperature(celsius, units) {
  return units === 'imperial' ? (celsius * 9) / 5 + 32 : celsius
}

export function formatTempValue(celsius, units) {
  if (!Number.isFinite(celsius)) return '—'
  return Math.round(convertTemperature(celsius, units))
}

export function formatTemp(celsius, units) {
  const value = formatTempValue(celsius, units)
  return value === '—' ? value : `${value}°`
}

export function temperatureUnit(units) {
  return units === 'imperial' ? 'F' : 'C'
}

export function formatWind(kmh, units) {
  if (!Number.isFinite(kmh)) return { value: '—', unit: units === 'imperial' ? 'mph' : 'km/h' }

  const value = units === 'imperial' ? Math.round(kmh * 0.621371) : Math.round(kmh)
  return { value, unit: units === 'imperial' ? 'mph' : 'km/h' }
}

export function formatPrecip(mm, units) {
  if (!Number.isFinite(mm)) return '—'
  return units === 'imperial' ? `${(mm / 25.4).toFixed(2)} in` : `${mm.toFixed(1)} mm`
}

export function formatVisibility(meters, units) {
  if (!Number.isFinite(meters)) return '—'

  if (units === 'imperial') {
    return `${(meters / 1609.344).toFixed(1)} mi`
  }

  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}

export function formatPressure(hPa, units) {
  if (!Number.isFinite(hPa)) return '—'
  return units === 'imperial'
    ? `${(hPa * 0.02953).toFixed(2)} inHg`
    : `${Math.round(hPa)} hPa`
}

export function getVisibilityLabel(meters) {
  if (!Number.isFinite(meters)) return 'Unavailable'
  if (meters >= 10000) return 'Excellent visibility'
  if (meters >= 5000) return 'Good visibility'
  if (meters >= 2000) return 'Moderate visibility'
  return 'Poor visibility'
}

export function getWindDirection(degrees) {
  if (!Number.isFinite(degrees)) return '—'
  const index = Math.round(degrees / 22.5) % 16
  return WIND_DIRECTIONS[index]
}

export function getUvInfo(value) {
  if (!Number.isFinite(value)) return { label: 'Unavailable', tone: 'low', advice: 'UV data is unavailable.' }
  if (value >= 11) return { label: 'Extreme', tone: 'extreme', advice: 'Avoid direct sun; protect skin and eyes.' }
  if (value >= 8) return { label: 'Very high', tone: 'very-high', advice: 'Use sunscreen and seek shade around midday.' }
  if (value >= 6) return { label: 'High', tone: 'high', advice: 'Wear sunscreen and sunglasses.' }
  if (value >= 3) return { label: 'Moderate', tone: 'moderate', advice: 'Protection is recommended around midday.' }
  return { label: 'Low', tone: 'low', advice: 'Minimal protection needed.' }
}

export function getAqiInfo(value) {
  if (!Number.isFinite(value)) {
    return {
      label: 'Unavailable',
      tone: 'unavailable',
      advice: 'Air quality data is unavailable for this location.',
    }
  }
  if (value <= 50) {
    return { label: 'Good', tone: 'good', advice: 'Air quality is good. Enjoy your day outside.' }
  }
  if (value <= 100) {
    return { label: 'Moderate', tone: 'moderate', advice: 'Air quality is acceptable for most people.' }
  }
  if (value <= 150) {
    return {
      label: 'Sensitive groups',
      tone: 'sensitive',
      advice: 'Sensitive groups should reduce prolonged outdoor activity.',
    }
  }
  if (value <= 200) {
    return { label: 'Unhealthy', tone: 'unhealthy', advice: 'Consider limiting time outdoors, especially exercise.' }
  }
  if (value <= 300) {
    return { label: 'Very unhealthy', tone: 'very-unhealthy', advice: 'Avoid outdoor exertion and keep windows closed.' }
  }
  return { label: 'Hazardous', tone: 'hazardous', advice: 'Stay indoors and use air filtration if possible.' }
}

export function minutesSinceMidnight(value) {
  const parts = parseLocalDateTime(value)
  if (!parts) return null
  return parts.hour * 60 + parts.minute
}

export function getDayLength(sunrise, sunset) {
  const start = minutesSinceMidnight(sunrise)
  const end = minutesSinceMidnight(sunset)
  if (start === null || end === null || end <= start) return '—'

  const total = end - start
  return `${Math.floor(total / 60)}h ${total % 60}m`
}

export function getDayProgress(sunrise, sunset, current) {
  const start = minutesSinceMidnight(sunrise)
  const end = minutesSinceMidnight(sunset)
  const now = minutesSinceMidnight(current)

  if (start === null || end === null || now === null || end <= start) return 0
  return Math.min(Math.max((now - start) / (end - start), 0), 1)
}

export function getWeatherInfo(code, isDay = true) {
  const numericCode = Number(code)
  const info = WEATHER_CODES[numericCode] ?? WEATHER_CODES[3]
  const daytime = Boolean(isDay)

  let theme = daytime ? 'cloudy-day' : 'cloudy-night'

  if (info.icon === 'clear' || info.icon === 'partly') {
    theme = daytime ? 'clear-day' : 'clear-night'
  } else if (info.icon === 'fog') {
    theme = 'fog'
  } else if (info.icon === 'drizzle' || info.icon === 'rain' || info.icon === 'showers') {
    theme = 'rain'
  } else if (info.icon === 'thunder') {
    theme = 'storm'
  } else if (info.icon === 'snow') {
    theme = 'snow'
  }

  return {
    ...info,
    code: numericCode,
    isDay: daytime,
    theme,
  }
}
