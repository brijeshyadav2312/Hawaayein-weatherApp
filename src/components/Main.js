import React, { useEffect, useRef, useState } from 'react'
import searchIcon from './search.svg'
import WeatherData from './WeatherData'
import linkIcon from './external-link.svg'
const Main = () => {
  const inputValue = useRef();
  const [cityName,setCityName] = useState("noida");
  const [error,setError] = useState(true)
  const [lang,setLang] = useState(true)
  const [myData, setMyData] = useState([])
  const [cityDetails,setCityDetails] = useState([])
  const [dataWeather,setDataWeather] = useState([])
  const [windData,setWindData] = useState([]);
  const APP_KEY= "35acd0e7fc9e307eee4ba4604215e173";
  useEffect(() =>{
    (async _ => {
          const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&APPID=${APP_KEY}&units=metric&lang=${lang?('en'):('hi')}`);
          const data = await response.json();
          if(response.ok){
            setCityDetails(data.city)
            setMyData(data.list[0].main)
            setDataWeather(data.list[0].weather[0])
            setWindData(data.list[0].wind)
            setError(true)
          }else{
            setError(false)
          }
    })();

  },[cityName,lang])
  
  const onkeydownHandler = ((e) =>{
    if(e.key==='Enter'){
      e.preventDefault();
      setCityName(inputValue.current.value)
    }
  })
  const onSubmitHandler = ((e) =>{
    e.preventDefault();
    setCityName(inputValue.current.value)
  })

  return (
    <div className='box'>
        <div className='cityName'>
          {error?(<p>{cityDetails.name}, {cityDetails.country}<a  href={`https://en.wikipedia.org/wiki/${cityDetails.name}`} target="_ "><img src={linkIcon} alt='link'/></a></p>):(<p className='invalid'>{lang?'Invalid City Name':'अमान्य शहर का नाम'}</p>)}
          <div className='search'>
          <input type='text' ref={inputValue} onKeyDown={onkeydownHandler} placeholder='City Name'/><img style={{cursor:'pointer'}} onClick={onSubmitHandler} src={searchIcon} alt='searchIcon'/>
          </div>
        </div>
        <WeatherData weatherData ={myData} weather={dataWeather} city={cityDetails} lang={lang} windData={windData}/>
        <p onClick={() => setLang(!lang)} className='translater'>{lang?('Hindi ?'):('Eng ?')}</p>
    </div>
  )
}

export default Main
