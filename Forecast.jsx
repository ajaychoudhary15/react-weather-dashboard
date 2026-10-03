function Forecast({ forecast }) {
  if (!forecast || forecast.length === 0) {
    return null;
  }

  return (
    <div className="forecast">
      <h2>5-Day Forecast</h2>

      <div className="forecast-container">
        {forecast.map((day) => {
          const date = new Date(day.dt * 1000);

          const dayName = date.toLocaleDateString("en-US", {
            weekday: "short",
          });

          const icon = day.weather[0].icon;

          const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

          return (
            <div className="forecast-card" key={day.dt}>
              <h3>{dayName}</h3>

              <img
                src={iconUrl}
                alt={day.weather[0].description}
              />

              <p className="forecast-condition">
                {day.weather[0].description}
              </p>

              <div className="forecast-temp">
                <strong>
                  {Math.round(day.main.temp)}°C
                </strong>

                <span>
                  Feels {Math.round(day.main.feels_like)}°C
                </span>
              </div>

              <div className="forecast-details">
                <span>💧 {day.main.humidity}%</span>
                <span>💨 {day.wind.speed} m/s</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Forecast;