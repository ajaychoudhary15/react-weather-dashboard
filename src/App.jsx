import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";
import "./App.css";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [recentCities, setRecentCities] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch weather by city
  const searchWeather = async (searchCity = city) => {
    if (!searchCity.trim()) {
      setError("Please enter a city name.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setWeather(null);
      setForecast([]);

      const weatherURL =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?q=${encodeURIComponent(searchCity)}` +
        `&appid=${API_KEY}&units=metric`;

      const weatherResponse = await fetch(weatherURL);
      const weatherData = await weatherResponse.json();

      if (!weatherResponse.ok) {
        if (weatherResponse.status === 401) {
          throw new Error("Invalid API key.");
        }

        if (weatherResponse.status === 404) {
          throw new Error("City not found.");
        }

        throw new Error(
          weatherData.message || "Unable to fetch weather."
        );
      }

      await fetchForecast(
        weatherData.coord.lat,
        weatherData.coord.lon
      );

      setWeather(weatherData);
      setCity(weatherData.name);
      setLastUpdated(new Date());

      // Save recent cities
      setRecentCities((previousCities) => {
        const updatedCities = [
          weatherData.name,
          ...previousCities.filter(
            (item) =>
              item.toLowerCase() !==
              weatherData.name.toLowerCase()
          ),
        ];

        return updatedCities.slice(0, 5);
      });
    } catch (err) {
      console.error("Weather Error:", err);

      setWeather(null);
      setForecast([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch 5-day forecast
  const fetchForecast = async (lat, lon) => {
    const forecastURL =
      `https://api.openweathermap.org/data/2.5/forecast` +
      `?lat=${lat}&lon=${lon}` +
      `&appid=${API_KEY}&units=metric`;

    const response = await fetch(forecastURL);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to fetch forecast."
      );
    }

    const dailyForecast = data.list.filter((item) =>
      item.dt_txt.includes("12:00:00")
    );

    setForecast(dailyForecast.slice(0, 5));
  };

  // Get weather using current location
  const getCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const weatherURL =
            `https://api.openweathermap.org/data/2.5/weather` +
            `?lat=${latitude}&lon=${longitude}` +
            `&appid=${API_KEY}&units=metric`;

          const response = await fetch(weatherURL);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Unable to get location weather."
            );
          }

          await fetchForecast(latitude, longitude);

          setWeather(data);
          setCity(data.name);
          setLastUpdated(new Date());
        } catch (err) {
          setWeather(null);
          setForecast([]);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setError("Location permission was denied.");
      }
    );
  };

  // Refresh weather using coordinates
  const getWeatherByCoordinates = async (lat, lon) => {
    try {
      setRefreshing(true);

      const weatherURL =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?lat=${lat}&lon=${lon}` +
        `&appid=${API_KEY}&units=metric`;

      const response = await fetch(weatherURL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to refresh weather."
        );
      }

      setWeather(data);
      setLastUpdated(new Date());

      await fetchForecast(lat, lon);
    } catch (err) {
      console.error("Refresh error:", err);
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  // Search form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    searchWeather();
  };

  // Auto refresh every 10 minutes
  useEffect(() => {
    if (!weather) return;

    const interval = setInterval(() => {
      if (weather.coord) {
        getWeatherByCoordinates(
          weather.coord.lat,
          weather.coord.lon
        );
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [weather]);

  return (
    <div
      className={`app ${
        darkMode ? "dark" : ""
      } ${
        weather
          ? weather.weather[0].main.toLowerCase()
          : ""
      }`}
    >
      <div className="container">

        {/* Header */}
        <div className="top-bar">
          <div>
            <h1>Weather Dashboard</h1>

            <p className="subtitle">
              Real-time weather information powered by
              OpenWeather
            </p>
          </div>

          <button
            className="theme-button"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Search */}
        <SearchBar
          city={city}
          setCity={setCity}
          handleSubmit={handleSubmit}
          getCurrentLocationWeather={
            getCurrentLocationWeather
          }
        />

        {/* Recent Searches */}
        {recentCities.length > 0 && (
          <div className="recent-section">
            <p>Recent searches:</p>

            <div className="recent-cities">
              {recentCities.map((recentCity) => (
                <button
                  key={recentCity}
                  onClick={() =>
                    searchWeather(recentCity)
                  }
                >
                  {recentCity}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading">
            Loading weather...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {/* Weather */}
        {weather && !loading && (
          <>
            {/* Last Updated + Refresh */}
            <div className="update-bar">
              <span>
                Last updated:{" "}
                {lastUpdated
                  ? lastUpdated.toLocaleTimeString()
                  : "--"}
              </span>

              <button
  className="refresh-button"
  onClick={() =>
    getWeatherByCoordinates(
      weather.coord.lat,
      weather.coord.lon
    )
  }
  disabled={refreshing}
  title="Refresh weather"
>
  <span className={refreshing ? "spin" : ""}>⟳</span>
  {refreshing ? " Updating..." : " Refresh"}
</button>
            </div>

            <WeatherCard weather={weather} />

            <Forecast forecast={forecast} />
          </>
        )}

      </div>
    </div>
  );
}

export default App;
