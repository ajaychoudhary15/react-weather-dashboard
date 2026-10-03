function WeatherCard({ weather }) {
  const iconCode = weather.weather[0].icon;

  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  return (
    <div className="weather-card">

      <div className="weather-header">
        <div>
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>

          <p className="weather-description">
            {weather.weather[0].description}
          </p>
        </div>

        <img
          src={iconUrl}
          alt={weather.weather[0].description}
          className="weather-icon"
        />
      </div>

      <div className="main-temperature">
        {Math.round(weather.main.temp)}°C
      </div>

      <p className="feels-like">
        Feels like {Math.round(weather.main.feels_like)}°C
      </p>

      <div className="weather-info">

        <div className="info-box">
          <span>💧</span>
          <h3>Humidity</h3>
          <p>{weather.main.humidity}%</p>
        </div>

        <div className="info-box">
          <span>💨</span>
          <h3>Wind Speed</h3>
          <p>{weather.wind.speed} m/s</p>
        </div>

        <div className="info-box">
          <span>🌡️</span>
          <h3>Pressure</h3>
          <p>{weather.main.pressure} hPa</p>
        </div>

        <div className="info-box">
          <span>👁️</span>
          <h3>Visibility</h3>
          <p>{(weather.visibility / 1000).toFixed(1)} km</p>
        </div>

      </div>

    </div>
  );
}

export default WeatherCard;