import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSun,
  Moon,
  Snowflake,
  Sun,
} from 'lucide-react'

const ICONS = {
  clear: [Sun, Moon],
  partly: [CloudSun, CloudMoon],
  cloudy: [Cloud, Cloud],
  fog: [CloudFog, CloudFog],
  drizzle: [CloudDrizzle, CloudDrizzle],
  rain: [CloudRain, CloudRain],
  showers: [CloudRain, CloudRain],
  snow: [Snowflake, Snowflake],
  thunder: [CloudLightning, CloudLightning],
}

export default function WeatherIcon({
  type = 'cloudy',
  isDay = true,
  size = 24,
  className = '',
  strokeWidth = 1.6,
}) {
  const pair = ICONS[type] ?? ICONS.cloudy
  const Icon = isDay ? pair[0] : pair[1]

  return (
    <Icon
      aria-hidden="true"
      className={`weather-icon ${className}`.trim()}
      focusable="false"
      size={size}
      strokeWidth={strokeWidth}
    />
  )
}
