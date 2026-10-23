import { describe, expect, test } from 'vitest'
import {
  formatDayLabel,
  formatPressure,
  formatTempValue,
  formatTime,
  formatUtcOffset,
  formatVisibility,
  formatWind,
  getAqiInfo,
  getDayLength,
  getDayProgress,
  getUvInfo,
  getWeatherInfo,
  getWindDirection,
} from './format'

describe('temperature and units', () => {
  test('converts Celsius to Fahrenheit', () => {
    expect(formatTempValue(0, 'imperial')).toBe(32)
    expect(formatTempValue(29.8, 'imperial')).toBe(86)
    expect(formatTempValue(29.8, 'metric')).toBe(30)
  })

  test('converts wind, pressure, and visibility', () => {
    expect(formatWind(10, 'imperial')).toEqual({ value: 6, unit: 'mph' })
    expect(formatWind(10, 'metric')).toEqual({ value: 10, unit: 'km/h' })
    expect(formatPressure(1013, 'metric')).toBe('1013 hPa')
    expect(formatPressure(1013, 'imperial')).toBe('29.91 inHg')
    expect(formatVisibility(8400, 'metric')).toBe('8.4 km')
    expect(formatVisibility(840, 'metric')).toBe('840 m')
  })
})

describe('local time formatting', () => {
  test('formats the provider local ISO strings without a timezone shift', () => {
    expect(formatTime('2026-10-23T06:25')).toBe('6:25 AM')
    expect(formatTime('2026-10-23T17:43')).toBe('5:43 PM')
    expect(formatTime('2026-10-23T00:05')).toBe('12:05 AM')
    expect(formatUtcOffset(19800)).toBe('UTC+05:30')
  })

  test('labels days and computes daylight', () => {
    expect(formatDayLabel('2026-10-23', 0)).toBe('Today')
    expect(formatDayLabel('2026-10-24', 1)).toBe('Tomorrow')
    expect(formatDayLabel('2026-10-25', 2)).toBe('Sun')
    expect(getDayLength('2026-10-23T06:25', '2026-10-23T17:43')).toBe('11h 18m')
    expect(getDayProgress('2026-10-23T06:00', '2026-10-23T18:00', '2026-10-23T12:00')).toBe(0.5)
  })
})

describe('weather descriptors', () => {
  test('maps WMO codes to labels and themes', () => {
    expect(getWeatherInfo(0, true)).toMatchObject({ label: 'Clear sky', icon: 'clear', theme: 'clear-day' })
    expect(getWeatherInfo(0, false)).toMatchObject({ label: 'Clear sky', icon: 'clear', theme: 'clear-night' })
    expect(getWeatherInfo(95, true)).toMatchObject({ label: 'Thunderstorm', theme: 'storm' })
    expect(getWeatherInfo(71, true)).toMatchObject({ label: 'Slight snow', theme: 'snow' })
  })

  test('maps AQI, UV, and wind direction', () => {
    expect(getAqiInfo(42).label).toBe('Good')
    expect(getAqiInfo(188).label).toBe('Unhealthy')
    expect(getAqiInfo(330).label).toBe('Hazardous')
    expect(getUvInfo(8.2).label).toBe('Very high')
    expect(getWindDirection(0)).toBe('N')
    expect(getWindDirection(304)).toBe('NW')
  })
})
