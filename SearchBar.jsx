function SearchBar({
  city,
  setCity,
  handleSubmit,
  getCurrentLocationWeather,
}) {
  return (
    <div className="search-area">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button type="submit">
          Search
        </button>
      </form>

      <button
        className="location-button"
        onClick={getCurrentLocationWeather}
      >
        📍 Use My Location
      </button>
    </div>
  );
}

export default SearchBar;