import { useEffect, useState } from 'react'
import { searchLocations } from '../lib/weather'

export function useGeocoder(query) {
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  useEffect(() => {
    const trimmed = query.trim()

    if (trimmed.length < 2) {
      setResults([])
      setIsSearching(false)
      setSearchError('')
      return undefined
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setIsSearching(true)
      setSearchError('')

      try {
        const locations = await searchLocations(trimmed, controller.signal)
        if (controller.signal.aborted) return
        setResults(locations)
      } catch (error) {
        if (error?.name === 'AbortError' || controller.signal.aborted) return
        setResults([])
        setSearchError('City search is unavailable right now.')
      } finally {
        if (!controller.signal.aborted) setIsSearching(false)
      }
    }, 250)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  return { results, isSearching, searchError }
}
