function pollutant(value) {
  return Number.isFinite(value) ? Math.round(value) : '—'
}

export default function AirQualityCard({ airQuality }) {
  const { value, pm25, pm10, ozone, nitrogenDioxide, info } = airQuality
  const marker = Number.isFinite(value) ? Math.min(Math.max((value / 300) * 100, 0), 100) : 0
  const dominant = [
    { label: 'PM2.5', value: pm25 },
    { label: 'PM10', value: pm10 },
    { label: 'Ozone', value: ozone },
    { label: 'NO₂', value: nitrogenDioxide },
  ]
    .filter((pollutantItem) => Number.isFinite(pollutantItem.value))
    .sort((a, b) => b.value - a.value)[0]

  return (
    <section className="panel air-panel" aria-labelledby="air-quality-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Air quality</p>
          <h2 id="air-quality-heading">Breathing easy?</h2>
        </div>
      </div>

      {Number.isFinite(value) ? (
        <>
          <div className="aqi-hero">
            <span className={`aqi-number tone-${info.tone}`}>{Math.round(value)}</span>
            <span className="aqi-copy">
              <strong>{info.label}</strong>
              <small>US AQI</small>
            </span>
          </div>

          <div className="aqi-scale" aria-hidden="true">
            <span className="aqi-scale-marker" style={{ left: `${marker}%` }} />
          </div>
          <div className="aqi-scale-labels" aria-hidden="true">
            <span>0</span>
            <span>100</span>
            <span>200</span>
            <span>300+</span>
          </div>

          <p className="aqi-advice">{info.advice}</p>

          {dominant && (
            <p className="aqi-dominant">
              <span>Main pollutant</span>
              <strong>{dominant.label}</strong>
            </p>
          )}

          <div className="aqi-metrics">
            <span>
              <small>PM2.5</small>
              <strong>{pollutant(pm25)}</strong>
            </span>
            <span>
              <small>PM10</small>
              <strong>{pollutant(pm10)}</strong>
            </span>
            <span>
              <small>Ozone</small>
              <strong>{pollutant(ozone)}</strong>
            </span>
            <span>
              <small>NO₂</small>
              <strong>{pollutant(nitrogenDioxide)}</strong>
            </span>
          </div>
        </>
      ) : (
        <p className="panel-copy">
          Air quality data is unavailable for this location right now.
        </p>
      )}
    </section>
  )
}
