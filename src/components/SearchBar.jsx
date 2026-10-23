import { useEffect, useRef, useState } from 'react'
import { Loader2, MapPin, Search, X } from 'lucide-react'
import { useGeocoder } from '../hooks/useGeocoder'

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const { results, isSearching, searchError } = useGeocoder(query)
  const rootRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  useEffect(() => {
    if (activeIndex >= results.length) setActiveIndex(-1)
  }, [activeIndex, results.length])

  const showResults = isOpen && query.trim().length >= 2
  const activeId = activeIndex >= 0 ? `city-option-${activeIndex}` : undefined

  const chooseLocation = (location) => {
    onSelect(location)
    setQuery('')
    setIsOpen(false)
    setActiveIndex(-1)
    inputRef.current?.blur()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!showResults || results.length === 0) return
    chooseLocation(results[activeIndex >= 0 ? activeIndex : 0])
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)
      setActiveIndex((index) => (results.length ? (index + 1) % results.length : -1))
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setIsOpen(true)
      setActiveIndex((index) =>
        results.length ? (index <= 0 ? results.length - 1 : index - 1) : -1
      )
    }

    if (event.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
    }
  }

  return (
    <div className="search" ref={rootRef}>
      <form className="search-form" role="search" onSubmit={handleSubmit}>
        <MapPin aria-hidden="true" className="search-leading" size={18} />
        <input
          ref={inputRef}
          aria-activedescendant={showResults ? activeId : undefined}
          aria-autocomplete="list"
          aria-controls="city-search-results"
          aria-expanded={showResults}
          aria-label="Search for a city"
          autoComplete="off"
          className="search-input"
          maxLength={100}
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search city or town"
          role="combobox"
          spellCheck="false"
          type="text"
          value={query}
        />

        {query && (
          <button
            aria-label="Clear search"
            className="search-clear"
            onClick={() => {
              setQuery('')
              setActiveIndex(-1)
              inputRef.current?.focus()
            }}
            type="button"
          >
            <X aria-hidden="true" size={16} />
          </button>
        )}

        <button aria-label="Search for a city" className="search-submit" type="submit">
          <Search aria-hidden="true" size={18} />
        </button>
      </form>

      {showResults && (
        <div className="search-popover">
          <ul
            aria-busy={isSearching}
            aria-label="City search results"
            className="search-results"
            id="city-search-results"
            role="listbox"
          >
            {isSearching && results.length === 0 && (
              <li className="search-message" role="status">
                <Loader2 aria-hidden="true" className="spin" size={16} />
                Searching cities…
              </li>
            )}

            {!isSearching && searchError && (
              <li className="search-message search-error" role="status">
                {searchError}
              </li>
            )}

            {!isSearching && !searchError && results.length === 0 && (
              <li className="search-message" role="status">
                No cities found. Try a different spelling.
              </li>
            )}

            {results.map((location, index) => {
              const details = [location.admin1, location.country].filter(Boolean).join(', ')

              return (
                <li
                  aria-selected={index === activeIndex}
                  className={`search-result ${index === activeIndex ? 'is-active' : ''}`}
                  id={`city-option-${index}`}
                  key={`${location.id}-${location.latitude}-${location.longitude}`}
                  onClick={() => chooseLocation(location)}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  role="option"
                >
                  <span className="search-result-icon">
                    <MapPin aria-hidden="true" size={16} />
                  </span>
                  <span className="search-result-copy">
                    <strong>{location.name}</strong>
                    {details && <small>{details}</small>}
                  </span>
                  {location.countryCode && (
                    <span className="search-result-code">{location.countryCode}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
