import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, LocateFixed, Wind, X } from 'lucide-react'
import { useWeather } from '../hooks/useWeather'
import { buildWeatherView, getWeatherErrorMessage } from '../lib/weather'
import { loadLocation, loadUnits, saveLocation, saveUnits } from '../lib/storage'
import AirQualityCard from './AirQualityCard'
import Attribution from './Attribution'
import CurrentWeather from './CurrentWeather'
import DailyForecast from './DailyForecast'
import ErrorState from './ErrorState'
import HourlyForecast from './HourlyForecast'
import LoadingState from './LoadingState'
import MetricsGrid from './MetricsGrid'
import SearchBar from './SearchBar'
import SunCard from './SunCard'

export default function WeatherApp() {
  const [location, setLocation] = useState(loadLocation)
  const [units, setUnits] = useState(loadUnits)
  const [isLocating, setIsLocating] = useState(false)
  const [notice, setNotice] = useState('')
  const { weather, airQuality, isLoading, isRefreshing, error, lastUpdated, refresh } =
    useWeather(location)
  const view = useMemo(
    () => (weather ? buildWeatherView(weather, airQuality) : null),
    [weather, airQuality]
  )

  useEffect(() => {
    document.title = `${location.name} — Hawaayein`
    saveLocation(location)
  }, [location])

  useEffect(() => {
    saveUnits(units)
  }, [units])

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 6000)
    return () => window.clearTimeout(timer)
  }, [notice])

  const handleSelect = useCallback((nextLocation) => {
    setLocation(nextLocation)
    setNotice('')
  }, [])

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setNotice('Geolocation is not available in this browser.')
      return
    }

    setIsLocating(true)
    setNotice('')

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({
          id: `geo:${coords.latitude.toFixed(4)},${coords.longitude.toFixed(4)}`,
          name: 'Your location',
          admin1: '',
          country: '',
          countryCode: '',
          latitude: coords.latitude,
          longitude: coords.longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })
        setNotice('Showing weather for your current location.')
        setIsLocating(false)
      },
      (geoError) => {
        setNotice(
          geoError.code === 1
            ? 'Location permission was denied. Search for a city instead.'
            : 'We could not get your location. Try searching for a city instead.'
        )
        setIsLocating(false)
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    )
  }, [])

  return (
    <div className="weather-app" data-theme={view?.info.theme ?? 'clear-night'}>
      <a className="skip-link" href="#main">
        Skip to forecast
      </a>

      <div aria-hidden="true" className="atmosphere">
        <span className="aurora aurora-one" />
        <span className="aurora aurora-two" />
        <span className="wind-streams" />
      </div>

      <header className="topbar">
        <div className="topbar-inner">
          <div className="topbar-head">
            <a className="brand" href="./" aria-label="Hawaayein home">
              <span className="brand-mark">
                <Wind aria-hidden="true" size={21} />
              </span>
              <span className="brand-copy">
                <strong>Hawaayein</strong>
                <small>Weather, in motion.</small>
              </span>
            </a>

            <div className="quick-actions">
              <button
                aria-busy={isLocating}
                aria-label="Use my current location"
                className="icon-button"
                disabled={isLocating}
                onClick={handleLocate}
                title="Use my current location"
                type="button"
              >
                {isLocating ? (
                  <Loader2 aria-hidden="true" className="spin" size={18} />
                ) : (
                  <LocateFixed aria-hidden="true" size={18} />
                )}
              </button>

              <button
                aria-label={`Switch to ${units === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
                className="unit-toggle"
                onClick={() => setUnits((current) => (current === 'metric' ? 'imperial' : 'metric'))}
                title={`Switch to ${units === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
                type="button"
              >
                <span className={units === 'metric' ? 'is-active' : ''}>°C</span>
                <span aria-hidden="true" className="unit-slash">
                  /
                </span>
                <span className={units === 'imperial' ? 'is-active' : ''}>°F</span>
              </button>
            </div>
          </div>

          <SearchBar onSelect={handleSelect} />
        </div>
      </header>

      <main aria-busy={isLoading || isRefreshing} className="dashboard" id="main">
        {notice && (
          <div aria-live="polite" className="toast" role="status">
            <span>{notice}</span>
            <button aria-label="Dismiss message" onClick={() => setNotice('')} type="button">
              <X aria-hidden="true" size={15} />
            </button>
          </div>
        )}

        {isLoading && !view && <LoadingState locationName={location.name} />}

        {!isLoading && error && !view && (
          <ErrorState message={getWeatherErrorMessage(error)} onRetry={refresh} />
        )}

        {view && (
          <>
            {error && (
              <div className="refresh-alert" role="status">
                <span>{getWeatherErrorMessage(error)} Showing the last available forecast.</span>
                <button onClick={refresh} type="button">
                  Retry
                </button>
              </div>
            )}

            <div className="dashboard-grid">
              <CurrentWeather
                isRefreshing={isRefreshing}
                lastUpdated={lastUpdated}
                location={location}
                onRefresh={refresh}
                units={units}
                view={view}
              />
              <AirQualityCard airQuality={view.airQuality} />
              <HourlyForecast hours={view.hours} units={units} />
              <SunCard view={view} />
              <DailyForecast
                days={view.days}
                units={units}
                weekHigh={view.weekHigh}
                weekLow={view.weekLow}
              />
              <MetricsGrid units={units} view={view} />
            </div>

            <Attribution view={view} />
          </>
        )}
      </main>
    </div>
  )
}
