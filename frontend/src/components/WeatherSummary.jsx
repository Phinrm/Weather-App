import React from 'react'

function WeatherSummary({ data, onExtras }) {
  const { location_name, current, forecast, lat, lon } = data

  const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`

  return (
    <section className="card weather-card">
      <div className="weather-header">
        <div>
          <h2>{location_name}</h2>
          <p className="coords">
            {lat.toFixed(2)}, {lon.toFixed(2)}
          </p>
        </div>
        <button className="secondary-btn" onClick={onExtras}>
          More about this place
        </button>
      </div>

      <div className="weather-current">
        <div className="weather-main">
          <img src={iconUrl(current.icon)} alt={current.description} />
          <div>
            <div className="temp-main">
              {Math.round(current.temperature)}°C
            </div>
            <div className="temp-sub">
              Feels like {Math.round(current.feels_like)}°C
            </div>
            <div className="description">
              {current.description}
            </div>
          </div>
        </div>
        <div className="weather-meta">
          <div>
            <span className="label">Humidity</span>
            <span>{current.humidity}%</span>
          </div>
          <div>
            <span className="label">Wind</span>
            <span>{current.wind_speed} m/s</span>
          </div>
        </div>
      </div>

      <div className="forecast-grid">
        {forecast.map((day) => (
          <div key={day.date} className="forecast-item">
            <div className="forecast-date">
              {new Date(day.date).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </div>
            <img src={iconUrl(day.icon)} alt={day.description} />
            <div className="forecast-temps">
              <span>{Math.round(day.max_temp)}°</span>
              <span className="muted">{Math.round(day.min_temp)}°</span>
            </div>
            <div className="forecast-desc">
              {day.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default WeatherSummary
