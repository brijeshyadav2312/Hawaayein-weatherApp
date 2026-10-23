import React from 'react'

const ICON_PATTERN = /^[0-9]{2}[dn]$/

const WeatherData = (props) => {
  const weather = props.weather ?? {}
  const weatherData = props.weatherData ?? {}
  const city = props.city ?? {}
  const windData = props.windData ?? {}
  const icon = ICON_PATTERN.test(weather.icon ?? '') ? weather.icon : '01d'

  const getTime = (timeStamp) => {
    if (typeof timeStamp !== 'number') return '--:--'
    return `${new Date(timeStamp * 1000).getHours()} : ${new Date(
      timeStamp * 1000
    ).getMinutes()}`;
  };

  const sideRight = () =>{
    var slider = document.getElementById('scrolledItem');
    slider.scrollLeft = slider.scrollLeft+300;
  }
  const sideLeft = () =>{
    var slider = document.getElementById('scrolledItem');
    slider.scrollLeft = slider.scrollLeft-300;
  }

  return (
    <div className='weatherData'>
      <div className='currtemp'>
        <div className='tempAndLogo'>
        <div>
            <img src={`assets/${icon}.svg`} width={200} alt='icon'/>
        </div>
        <div>
            {Math.round(weatherData.temp)}&deg;C
            <p>{weather.description}</p>
        </div>
        </div>
        <div className='windData'>
            <p>{props.lang?'Wind: ':'हवा: '}<span>{windData.speed}&nbsp;mph</span></p>
            <p>{props.lang?'Min Temp: ':'न्यूनतम ताप: '}<span>{Math.round(weatherData.temp_min)}&deg;C</span></p>
            <p>{props.lang?'Max Temp: ':'अधिकतम ताप: '}<span>{Math.round(weatherData.temp_max)}&deg;C</span></p>
        </div>
      </div>
      <div id='scrolledItem' className='forcastdata'>
        <div>
            <p>{props.lang?'SUNRISE':'सूर्योदय'}</p>
            <img src={'https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg/sunrise.svg'} width={100} alt='icon'/>
            <p>{getTime(city.sunrise)}</p>
        </div>
        <div>
            <p>{props.lang?'HUMIDITY':'नमी'}</p>
            <img src={'https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg/humidity.svg'} width={100} alt='icon'/>
            <p>{weatherData.humidity}&nbsp;mm</p>
        </div>
        <div>
            <p>{props.lang?'WIND':'हवा'}</p>
            <img src={'https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg/wind.svg'} width={100} alt='icon'/>
            <p>{windData.speed}&nbsp;mph</p>
        </div>
        <div>
            <p>{props.lang?'PRESURE':'दबाव'}</p>
            <img src={'https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg/pressure-low.svg'} width={100} alt='icon'/>
            <p>{weatherData.pressure}&nbsp;mb</p>
        </div>

        <div>
            <p>{props.lang?'SUNSET':'सूर्यास्त'}</p>
            <img src={'https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg/sunset.svg'} width={100} alt='icon'/>
            <p>{getTime(city.sunset)}</p>
        </div>
      </div>
      <p className='copyright'>&copy;Brijesh Yadav 2022</p>
      <p onClick={sideRight} className='rigtharrow'>&gt;</p>
      <p onClick={sideLeft} className='leftarrow'>&lt;</p>
    </div>
  )
}

export default WeatherData
