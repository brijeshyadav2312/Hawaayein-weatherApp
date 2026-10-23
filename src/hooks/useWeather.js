import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchAirQuality, fetchWeather } from '../lib/weather'

export function useWeather(location) {
  const [weather, setWeather] = useState(null)
  const [airQuality, setAirQuality] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [refreshToken, setRefreshToken] = useState(0)
  const [lastUpdated, setLastUpdated] = useState(null)
  const hasData = useRef(false)
  const locationKey = `${location.latitude},${location.longitude}`
  const activeLocation = useRef(locationKey)

  useEffect(() => {
    const controller = new AbortController()
    const isNewLocation = activeLocation.current !== locationKey

    if (isNewLocation) {
      activeLocation.current = locationKey
      hasData.current = false
      setWeather(null)
      setAirQuality(null)
      setIsLoading(true)
    } else if (hasData.current) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }

    setError(null)

    const load = async () => {
      const airPromise = fetchAirQuality({
        latitude: location.latitude,
        longitude: location.longitude,
        signal: controller.signal,
      }).catch(() => null)

      try {
        const data = await fetchWeather({
          latitude: location.latitude,
          longitude: location.longitude,
          signal: controller.signal,
        })

        const air = await airPromise

        if (controller.signal.aborted) return

        setWeather(data)
        setAirQuality(air)
        setLastUpdated(new Date())
        hasData.current = true
        setError(null)
        setIsLoading(false)
        setIsRefreshing(false)
      } catch (loadError) {
        if (loadError?.name === 'AbortError' || controller.signal.aborted) return

        setError(loadError)
        setIsLoading(false)
        setIsRefreshing(false)
      }
    }

    load()

    return () => controller.abort()
  }, [location.latitude, location.longitude, locationKey, refreshToken])

  const refresh = useCallback(() => {
    setRefreshToken((token) => token + 1)
  }, [])

  return {
    weather,
    airQuality,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refresh,
  }
}
