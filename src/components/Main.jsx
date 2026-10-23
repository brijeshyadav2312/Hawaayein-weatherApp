import React, { useEffect, useRef, useState } from 'react'
import searchIcon from './search.svg'
import WeatherData from './WeatherData'
import linkIcon from './external-link.svg'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const DEFAULT_CITY = 'Noida'

const Main = () => {
  const inputValue = useRef();
  const [cityName,setCityName] = useState(DEFAULT_CITY);
  const [lang,setLang] = useState(true)
  const [myData, setMyData] = useState([])
  const [cityDetails,setCityDetails] = useState([])
  const [dataWeather,setDataWeather] = useState([])
  const [windData,setWindData] = useState([]);
  const [isLoading,setIsLoading] = useState(true)
  const [errorMessage,setErrorMessage] = useState('')

  useEffect(() =>{
    let ignore = false
    const controller = new AbortController()

    const loadWeather = async () => {
      setIsLoading(true)
      setErrorMessage('')

      if (!API_KEY) {
        if (!ignore) {
          setErrorMessage(lang ? 'Weather service is not configured.' : 'मौसम सेवा कॉन्फ़िगर नहीं है।')
          setIsLoading(false)
        }
        return
      }

      try {
        const params = new URLSearchParams({
          q: cityName,
          appid: API_KEY,
          units: 'metric',
          lang: lang ? 'en' : 'hi',
        })
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?${params.toString()}`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error('Weather request failed')
        }

        const data = await response.json()
        const current = data?.list?.[0]
        const city = data?.city
        const weather = current?.weather?.[0]

        if (!city || !current?.main || !weather || !current?.wind) {
          throw new Error('Unexpected weather response')
        }

        if (!ignore) {
          setCityDetails(city)
          setMyData(current.main)
          setDataWeather(weather)
          setWindData(current.wind)
          setIsLoading(false)
        }
      } catch (error) {
        if (ignore || error.name === 'AbortError') return
        setErrorMessage(lang ? 'Invalid City Name' : 'अमान्य शहर का नाम')
        setIsLoading(false)
      }
    }

    loadWeather()

    return () => {
      ignore = true
      controller.abort()
    }
  },[cityName,lang])

  const submitCity = () => {
    const value = inputValue.current?.value.trim()
    if (value) {
      setCityName(value.slice(0, 100))
    }
  }

  const onkeydownHandler = ((e) =>{
    if(e.key==='Enter'){
      e.preventDefault();
      submitCity()
    }
  })
  const onSubmitHandler = ((e) =>{
    e.preventDefault();
    submitCity()
  })

  const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(cityDetails.name ?? '')}`

  return (
    <div className='box'>
        <div className='cityName'>
          {isLoading ? (
            <p>{lang ? 'Loading...' : 'लोड हो रहा है...'}</p>
          ) : errorMessage ? (
            <p className='invalid'>{errorMessage}</p>
          ) : (
            <p>{cityDetails.name}, {cityDetails.country}
              <a href={wikiUrl} target="_blank" rel="noopener noreferrer" aria-label={`Read about ${cityDetails.name} on Wikipedia`}>
                <img src={linkIcon} alt=''/>
              </a>
            </p>
          )}
          <div className='search'>
          <input type='text' ref={inputValue} onKeyDown={onkeydownHandler} maxLength={100} autoComplete='off' aria-label='City Name' placeholder='City Name'/><img style={{cursor:'pointer'}} onClick={onSubmitHandler} src={searchIcon} alt='searchIcon'/>
          </div>
        </div>
        {!isLoading && !errorMessage && (
          <WeatherData weatherData ={myData} weather={dataWeather} city={cityDetails} lang={lang} windData={windData}/>
        )}
        <p onClick={() => setLang(!lang)} className='translater'>{lang?('Hindi ?'):('Eng ?')}</p>
    </div>
  )
}

export default Main
