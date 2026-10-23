import { DEFAULT_LOCATION } from './weather'

const LOCATION_KEY = 'hawaayein:location'
const UNITS_KEY = 'hawaayein:units'

function readJson(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return null
  }

  return value
}

export function loadLocation() {
  const stored = readJson(LOCATION_KEY)

  if (
    !stored ||
    typeof stored.name !== 'string' ||
    !Number.isFinite(stored.latitude) ||
    !Number.isFinite(stored.longitude)
  ) {
    return DEFAULT_LOCATION
  }

  return {
    id: stored.id ?? `${stored.latitude},${stored.longitude}`,
    name: stored.name,
    admin1: stored.admin1 ?? '',
    country: stored.country ?? '',
    countryCode: stored.countryCode ?? '',
    latitude: stored.latitude,
    longitude: stored.longitude,
    timezone: stored.timezone ?? 'auto',
  }
}

export function saveLocation(location) {
  writeJson(LOCATION_KEY, location)
}

export function loadUnits() {
  try {
    return localStorage.getItem(UNITS_KEY) === 'imperial' ? 'imperial' : 'metric'
  } catch {
    return 'metric'
  }
}

export function saveUnits(units) {
  try {
    localStorage.setItem(UNITS_KEY, units)
  } catch {
    return null
  }

  return units
}
