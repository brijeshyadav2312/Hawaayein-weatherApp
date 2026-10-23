import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import App from './App'
import { clearWeatherCache } from './lib/weather'

function isoAt(hourOffset) {
  const start = Date.UTC(2026, 9, 23, 0, 0)
  return new Date(start + hourOffset * 60 * 60 * 1000).toISOString().slice(0, 16)
}

function buildForecast() {
  const hourlyTime = Array.from({ length: 48 }, (_, index) => isoAt(index))

  return {
    latitude: 28.5,
    longitude: 77.4,
    timezone: 'Asia/Kolkata',
    utc_offset_seconds: 19800,
    current: {
      time: '2026-10-23T13:45',
      interval: 900,
      temperature_2m: 29.8,
      relative_humidity_2m: 51,
      apparent_temperature: 32.5,
      is_day: 1,
      precipitation: 0,
      weather_code: 1,
      cloud_cover: 41,
      pressure_msl: 1011.7,
      wind_speed_10m: 5.2,
      wind_direction_10m: 304,
      wind_gusts_10m: 18.7,
    },
    hourly: {
      time: hourlyTime,
      temperature_2m: hourlyTime.map((_, index) => 22 + (index % 12) * 0.5),
      precipitation_probability: hourlyTime.map((_, index) => (index % 4 === 0 ? 12 : 2)),
      precipitation: hourlyTime.map(() => 0),
      weather_code: hourlyTime.map(() => 1),
      is_day: hourlyTime.map((_, index) => (index % 24 >= 6 && index % 24 < 18 ? 1 : 0)),
      uv_index: hourlyTime.map((_, index) => (index % 24 >= 8 && index % 24 < 17 ? 4.8 : 0)),
      visibility: hourlyTime.map(() => 8400),
      dew_point_2m: hourlyTime.map(() => 18.4),
    },
    daily: {
      time: [
        '2026-10-23',
        '2026-10-24',
        '2026-10-25',
        '2026-10-26',
        '2026-10-27',
        '2026-10-28',
        '2026-10-29',
      ],
      weather_code: [1, 2, 0, 3, 61, 71, 95],
      temperature_2m_max: [29.9, 30.4, 31, 30.3, 30.2, 30.1, 30.1],
      temperature_2m_min: [19.6, 18.6, 18.7, 17.7, 17.2, 16.4, 19.1],
      sunrise: [
        '2026-10-23T06:25',
        '2026-10-24T06:26',
        '2026-10-25T06:27',
        '2026-10-26T06:27',
        '2026-10-27T06:28',
        '2026-10-28T06:29',
        '2026-10-29T06:29',
      ],
      sunset: [
        '2026-10-23T17:43',
        '2026-10-24T17:42',
        '2026-10-25T17:41',
        '2026-10-26T17:40',
        '2026-10-27T17:39',
        '2026-10-28T17:38',
        '2026-10-29T17:37',
      ],
      uv_index_max: [5.2, 5.15, 5.1, 5.1, 5.1, 4.7, 4.1],
      precipitation_sum: [0.1, 0.2, 0, 0, 0, 0, 0.6],
      precipitation_probability_max: [10, 16, 0, 0, 0, 6, 12],
    },
  }
}

const airQuality = {
  timezone: 'Asia/Kolkata',
  current: {
    time: '2026-10-23T13:30',
    us_aqi: 188,
    pm2_5: 86.8,
    pm10: 364.1,
    ozone: 203,
    nitrogen_dioxide: 4.7,
  },
}

const london = {
  id: 2643743,
  name: 'London',
  admin1: 'England',
  country: 'United Kingdom',
  country_code: 'GB',
  latitude: 51.5085,
  longitude: -0.1257,
  timezone: 'Europe/London',
}

function jsonResponse(data, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => data,
  }
}

function installFetchMock() {
  vi.stubGlobal(
    'fetch',
    vi.fn((input) => {
      const url = String(input)

      if (url.includes('geocoding-api')) {
        return Promise.resolve(jsonResponse({ results: [london] }))
      }

      if (url.includes('air-quality-api')) {
        return Promise.resolve(jsonResponse(airQuality))
      }

      return Promise.resolve(jsonResponse(buildForecast()))
    })
  )
}

beforeEach(() => {
  clearWeatherCache()
  localStorage.clear()
  sessionStorage.clear()
  installFetchMock()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

test('renders the current Noida forecast, air quality, and attribution', async () => {
  render(<App />)

  expect(await screen.findByRole('heading', { name: 'Noida' })).toBeInTheDocument()
  expect(screen.getByText('Mainly clear')).toBeInTheDocument()
  expect(screen.getByText('188')).toBeInTheDocument()
  expect(screen.getByText('Unhealthy')).toBeInTheDocument()
  expect(screen.getByText('Main pollutant')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /Open-Meteo\.com/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /How the day unfolds/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /The week ahead/i })).toBeInTheDocument()
})

test('searches for a city and loads its forecast', async () => {
  const user = userEvent.setup()
  render(<App />)

  await screen.findByRole('heading', { name: 'Noida' })

  await user.type(screen.getByRole('combobox', { name: /search for a city/i }), 'London')

  const option = await screen.findByRole('option', { name: /London/i })
  await user.click(option)

  expect(await screen.findByRole('heading', { name: 'London' })).toBeInTheDocument()
  expect(screen.getByText('England, United Kingdom')).toBeInTheDocument()
})

test('switches between Celsius and Fahrenheit', async () => {
  const user = userEvent.setup()
  const { container } = render(<App />)

  await screen.findByRole('heading', { name: 'Noida' })

  const temperature = container.querySelector('.temp-number')
  expect(temperature).toHaveTextContent('30')

  await user.click(screen.getByRole('button', { name: /switch to fahrenheit/i }))
  expect(temperature).toHaveTextContent('86')
  expect(screen.getByRole('button', { name: /switch to celsius/i })).toBeInTheDocument()
})

test('shows a recoverable error state when the forecast request fails', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(jsonResponse({}, false, 500))
  )

  render(<App />)

  expect(await screen.findByRole('heading', { name: /we lost the wind/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
})

test('renders meteocon animated icons and no sparkles on air quality card', async () => {
  const { container } = render(<App />)

  await screen.findByRole('heading', { name: 'Noida' })

  // Verify meteocon img elements are rendered
  const meteocons = container.querySelectorAll('img.meteocon-icon')
  expect(meteocons.length).toBeGreaterThan(0)

  // Verify air quality panel does not contain sparkles or panel-icon
  const airPanel = container.querySelector('.air-panel')
  expect(airPanel).toBeInTheDocument()
  expect(airPanel.querySelector('.panel-icon')).toBeNull()
})

test('triggers refresh button smoothly', async () => {
  const user = userEvent.setup()
  render(<App />)

  await screen.findByRole('heading', { name: 'Noida' })

  const refreshBtn = screen.getByRole('button', { name: /refresh weather/i })
  expect(refreshBtn).toBeInTheDocument()

  await user.click(refreshBtn)
  expect(screen.getByRole('button', { name: /refresh weather/i })).toBeInTheDocument()
})

