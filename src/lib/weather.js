import {
  formatTime,
  formatUtcOffset,
  getAqiInfo,
  getDayLength,
  getDayProgress,
  getWeatherInfo,
} from './format'

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const CACHE_TTL = 10 * 60 * 1000

const cache = new Map()

export const DEFAULT_LOCATION = {
  id: 'noida-in',
  name: 'Noida',
  admin1: 'Uttar Pradesh',
  country: 'India',
  countryCode: 'IN',
  latitude: 28.5355,
  longitude: 77.391,
  timezone: 'Asia/Kolkata',
}

export class WeatherError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'WeatherError'
    this.status = status
  }
}

export function clearWeatherCache() {
  cache.clear()

  try {
    const keys = []
    for (let index = 0; index < sessionStorage.length; index += 1) {
      const key = sessionStorage.key(index)
      if (key?.startsWith('hawaayein:')) keys.push(key)
    }
    keys.forEach((key) => sessionStorage.removeItem(key))
  } catch {
    return null
  }

  return true
}

function cacheKey(kind, latitude, longitude) {
  return `hawaayein:${kind}:${Number(latitude).toFixed(2)},${Number(longitude).toFixed(2)}`
}

function readCache(key) {
  const memoryEntry = cache.get(key)
  if (memoryEntry && Date.now() - memoryEntry.savedAt < CACHE_TTL) {
    return memoryEntry.data
  }

  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null

    const entry = JSON.parse(raw)
    if (!entry?.savedAt || Date.now() - entry.savedAt >= CACHE_TTL) {
      sessionStorage.removeItem(key)
      return null
    }

    cache.set(key, entry)
    return entry.data
  } catch {
    return null
  }
}

function writeCache(key, data) {
  const entry = { savedAt: Date.now(), data }
  cache.set(key, entry)

  try {
    sessionStorage.setItem(key, JSON.stringify(entry))
  } catch {
    return null
  }

  return entry
}

async function fetchJson(url, signal) {
  let response

  try {
    response = await fetch(url, { signal })
  } catch (error) {
    if (error?.name === 'AbortError') throw error
    throw new WeatherError('Network request failed', 0)
  }

  if (!response.ok) {
    throw new WeatherError('Weather service request failed', response.status)
  }

  try {
    return await response.json()
  } catch {
    throw new WeatherError('Weather service returned invalid data', 502)
  }
}

export async function fetchWeather({ latitude, longitude, signal }) {
  const key = cacheKey('forecast', latitude, longitude)
  const cached = readCache(key)
  if (cached) return cached

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'is_day',
      'uv_index',
      'visibility',
      'dew_point_2m',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: '7',
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm',
  })

  const data = await fetchJson(`${FORECAST_URL}?${params.toString()}`, signal)

  if (!data?.current || !Array.isArray(data?.hourly?.time) || !Array.isArray(data?.daily?.time)) {
    throw new WeatherError('Weather service returned incomplete data', 502)
  }

  writeCache(key, data)
  return data
}

export async function fetchAirQuality({ latitude, longitude, signal }) {
  const key = cacheKey('air', latitude, longitude)
  const cached = readCache(key)
  if (cached) return cached

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide',
    timezone: 'auto',
  })

  const data = await fetchJson(`${AIR_QUALITY_URL}?${params.toString()}`, signal)
  if (!data?.current) return null

  writeCache(key, data)
  return data
}

export async function searchLocations(query, signal) {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []

  const params = new URLSearchParams({
    name: trimmed,
    count: '6',
    language: 'en',
    format: 'json',
  })

  const data = await fetchJson(`${GEOCODING_URL}?${params.toString()}`, signal)

  return (data?.results ?? []).map((result) => ({
    id: result.id,
    name: result.name,
    admin1: result.admin1 ?? '',
    country: result.country ?? '',
    countryCode: result.country_code ?? '',
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
  }))
}

function findCurrentHourIndex(times, currentTime) {
  if (!Array.isArray(times) || times.length === 0) return 0

  const currentHour = typeof currentTime === 'string' ? currentTime.slice(0, 13) : ''
  const exactIndex = times.findIndex((time) => time.slice(0, 13) === currentHour)
  if (exactIndex !== -1) return exactIndex

  const nextIndex = times.findIndex((time) => time >= currentTime)
  if (nextIndex === -1) return times.length - 1
  return Math.max(0, nextIndex - 1)
}

export function buildWeatherView(data, airQuality) {
  const current = data.current
  const hourly = data.hourly
  const daily = data.daily
  const nowIndex = findCurrentHourIndex(hourly.time, current.time)

  const hours = hourly.time
    .slice(nowIndex, nowIndex + 24)
    .map((time, offset) => {
      const index = nowIndex + offset
      return {
        time,
        temperature: hourly.temperature_2m[index],
        precipitationProbability: hourly.precipitation_probability[index] ?? 0,
        precipitation: hourly.precipitation[index] ?? 0,
        weatherCode: hourly.weather_code[index],
        isDay: hourly.is_day[index] === 1,
      }
    })

  const days = daily.time.map((date, index) => ({
    date,
    weatherCode: daily.weather_code[index],
    max: daily.temperature_2m_max[index],
    min: daily.temperature_2m_min[index],
    sunrise: daily.sunrise[index],
    sunset: daily.sunset[index],
    uvMax: daily.uv_index_max[index] ?? 0,
    precipitationSum: daily.precipitation_sum[index] ?? 0,
    precipitationProbability: daily.precipitation_probability_max[index] ?? 0,
  }))

  const today = days[0] ?? {}
  const weekLow = days.length ? Math.min(...days.map((day) => day.min)) : 0
  const weekHigh = days.length ? Math.max(...days.map((day) => day.max)) : 0
  const nextRainChance = hours.slice(0, 12).reduce(
    (highest, hour) => Math.max(highest, hour.precipitationProbability ?? 0),
    0
  )
  const aqiValue = airQuality?.current?.us_aqi

  return {
    info: getWeatherInfo(current.weather_code, current.is_day === 1),
    current: {
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      dewPoint: hourly.dew_point_2m[nowIndex] ?? null,
      windSpeed: current.wind_speed_10m,
      windGust: current.wind_gusts_10m,
      windDirection: current.wind_direction_10m,
      pressure: current.pressure_msl,
      cloudCover: current.cloud_cover,
      visibility: hourly.visibility[nowIndex] ?? null,
      uvIndex: hourly.uv_index[nowIndex] ?? today.uvMax ?? 0,
      precipitation: current.precipitation,
      precipitationProbability: hourly.precipitation_probability[nowIndex] ?? nextRainChance,
      high: today.max,
      low: today.min,
      sunrise: today.sunrise,
      sunset: today.sunset,
    },
    hours,
    days,
    today,
    weekLow,
    weekHigh,
    nextRainChance,
    timezone: data.timezone,
    timezoneOffset: formatUtcOffset(data.utc_offset_seconds),
    updatedAt: current.time,
    updatedLabel: formatTime(current.time),
    dayLength: getDayLength(today.sunrise, today.sunset),
    dayProgress: getDayProgress(today.sunrise, today.sunset, current.time),
    airQuality: {
      value: aqiValue,
      pm25: airQuality?.current?.pm2_5,
      pm10: airQuality?.current?.pm10,
      ozone: airQuality?.current?.ozone,
      nitrogenDioxide: airQuality?.current?.nitrogen_dioxide,
      info: getAqiInfo(aqiValue),
    },
  }
}

export function getWeatherErrorMessage(error) {
  if (error?.status === 429) {
    return 'The weather service is receiving too many requests. Please try again in a minute.'
  }

  if (error?.status >= 500) {
    return 'The weather service is having trouble right now. Please try again shortly.'
  }

  if (error?.status === 404) {
    return 'We could not find weather data for that location.'
  }

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return 'You appear to be offline. Check your connection and try again.'
  }

  return 'We could not load the weather for this location. Please try again.'
}
