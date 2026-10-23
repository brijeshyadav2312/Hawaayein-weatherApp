import clearDay from '@meteocons/svg/fill/clear-day.svg'
import clearNight from '@meteocons/svg/fill/clear-night.svg'
import mostlyClearDay from '@meteocons/svg/fill/mostly-clear-day.svg'
import mostlyClearNight from '@meteocons/svg/fill/mostly-clear-night.svg'
import partlyCloudyDay from '@meteocons/svg/fill/partly-cloudy-day.svg'
import partlyCloudyNight from '@meteocons/svg/fill/partly-cloudy-night.svg'
import overcastDay from '@meteocons/svg/fill/overcast-day.svg'
import overcastNight from '@meteocons/svg/fill/overcast-night.svg'
import cloudy from '@meteocons/svg/fill/cloudy.svg'
import fogDay from '@meteocons/svg/fill/fog-day.svg'
import fogNight from '@meteocons/svg/fill/fog-night.svg'
import fog from '@meteocons/svg/fill/fog.svg'
import drizzle from '@meteocons/svg/fill/drizzle.svg'
import partlyCloudyDayDrizzle from '@meteocons/svg/fill/partly-cloudy-day-drizzle.svg'
import partlyCloudyNightDrizzle from '@meteocons/svg/fill/partly-cloudy-night-drizzle.svg'
import overcastDrizzle from '@meteocons/svg/fill/overcast-drizzle.svg'
import partlyCloudyDayRain from '@meteocons/svg/fill/partly-cloudy-day-rain.svg'
import partlyCloudyNightRain from '@meteocons/svg/fill/partly-cloudy-night-rain.svg'
import rain from '@meteocons/svg/fill/rain.svg'
import overcastRain from '@meteocons/svg/fill/overcast-rain.svg'
import sleet from '@meteocons/svg/fill/sleet.svg'
import overcastSleet from '@meteocons/svg/fill/overcast-sleet.svg'
import partlyCloudyDaySnow from '@meteocons/svg/fill/partly-cloudy-day-snow.svg'
import partlyCloudyNightSnow from '@meteocons/svg/fill/partly-cloudy-night-snow.svg'
import snow from '@meteocons/svg/fill/snow.svg'
import overcastSnow from '@meteocons/svg/fill/overcast-snow.svg'
import thunderstormsDay from '@meteocons/svg/fill/thunderstorms-day.svg'
import thunderstormsNight from '@meteocons/svg/fill/thunderstorms-night.svg'
import thunderstorms from '@meteocons/svg/fill/thunderstorms.svg'
import thunderstormsDayHail from '@meteocons/svg/fill/thunderstorms-day-hail.svg'
import thunderstormsNightHail from '@meteocons/svg/fill/thunderstorms-night-hail.svg'
import extremeThunderstormsDay from '@meteocons/svg/fill/extreme-thunderstorms-day.svg'
import extremeThunderstormsNight from '@meteocons/svg/fill/extreme-thunderstorms-night.svg'
import hail from '@meteocons/svg/fill/hail.svg'

export const METEOCONS = {
  'clear-day': clearDay,
  'clear-night': clearNight,
  'mostly-clear-day': mostlyClearDay,
  'mostly-clear-night': mostlyClearNight,
  'partly-cloudy-day': partlyCloudyDay,
  'partly-cloudy-night': partlyCloudyNight,
  'overcast-day': overcastDay,
  'overcast-night': overcastNight,
  cloudy,
  'fog-day': fogDay,
  'fog-night': fogNight,
  fog,
  drizzle,
  'partly-cloudy-day-drizzle': partlyCloudyDayDrizzle,
  'partly-cloudy-night-drizzle': partlyCloudyNightDrizzle,
  'overcast-drizzle': overcastDrizzle,
  'partly-cloudy-day-rain': partlyCloudyDayRain,
  'partly-cloudy-night-rain': partlyCloudyNightRain,
  rain,
  'overcast-rain': overcastRain,
  sleet,
  'overcast-sleet': overcastSleet,
  'partly-cloudy-day-snow': partlyCloudyDaySnow,
  'partly-cloudy-night-snow': partlyCloudyNightSnow,
  snow,
  'overcast-snow': overcastSnow,
  'thunderstorms-day': thunderstormsDay,
  'thunderstorms-night': thunderstormsNight,
  thunderstorms,
  'thunderstorms-day-hail': thunderstormsDayHail,
  'thunderstorms-night-hail': thunderstormsNightHail,
  'extreme-thunderstorms-day': extremeThunderstormsDay,
  'extreme-thunderstorms-night': extremeThunderstormsNight,
  hail,
}

export const TYPE_MAP = {
  clear: ['clear-day', 'clear-night'],
  partly: ['partly-cloudy-day', 'partly-cloudy-night'],
  cloudy: ['overcast-day', 'overcast-night'],
  fog: ['fog-day', 'fog-night'],
  drizzle: ['drizzle', 'drizzle'],
  rain: ['rain', 'rain'],
  showers: ['partly-cloudy-day-rain', 'partly-cloudy-night-rain'],
  snow: ['snow', 'snow'],
  thunder: ['thunderstorms-day', 'thunderstorms-night'],
}

const WMO_MAP = {
  0: ['clear-day', 'clear-night'],
  1: ['mostly-clear-day', 'mostly-clear-night'],
  2: ['partly-cloudy-day', 'partly-cloudy-night'],
  3: ['overcast-day', 'overcast-night'],
  45: ['fog-day', 'fog-night'],
  48: ['fog-day', 'fog-night'],
  51: ['partly-cloudy-day-drizzle', 'partly-cloudy-night-drizzle'],
  53: ['drizzle', 'drizzle'],
  55: ['overcast-drizzle', 'overcast-drizzle'],
  56: ['drizzle', 'drizzle'],
  57: ['overcast-sleet', 'overcast-sleet'],
  61: ['partly-cloudy-day-rain', 'partly-cloudy-night-rain'],
  63: ['rain', 'rain'],
  65: ['overcast-rain', 'overcast-rain'],
  66: ['sleet', 'sleet'],
  67: ['overcast-sleet', 'overcast-sleet'],
  71: ['partly-cloudy-day-snow', 'partly-cloudy-night-snow'],
  73: ['snow', 'snow'],
  75: ['overcast-snow', 'overcast-snow'],
  77: ['snow', 'snow'],
  80: ['partly-cloudy-day-rain', 'partly-cloudy-night-rain'],
  81: ['rain', 'rain'],
  82: ['overcast-rain', 'overcast-rain'],
  85: ['partly-cloudy-day-snow', 'partly-cloudy-night-snow'],
  86: ['overcast-snow', 'overcast-snow'],
  95: ['thunderstorms-day', 'thunderstorms-night'],
  96: ['thunderstorms-day-hail', 'thunderstorms-night-hail'],
  99: ['extreme-thunderstorms-day', 'extreme-thunderstorms-night'],
}

const DEFAULT_PAIR = ['partly-cloudy-day', 'partly-cloudy-night']

export function getMeteoconSlug(code, isDay = true, type) {
  if (code !== undefined && code !== null && WMO_MAP[Number(code)]) {
    const pair = WMO_MAP[Number(code)]
    return isDay ? pair[0] : pair[1]
  }

  if (type && TYPE_MAP[type]) {
    const pair = TYPE_MAP[type]
    return isDay ? pair[0] : pair[1]
  }

  const pair = DEFAULT_PAIR
  return isDay ? pair[0] : pair[1]
}
