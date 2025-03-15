import React, { useState, useEffect } from "react"; // Import useEffect
import "./App.css";

function App() {

  const [city, setCity] = useState("Austin");
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");

  const BASE_GEO_URL = "https://geocoding-api.open-meteo.com/v1/search?name=";

  const fetchCoordinates = async () => {
    try {
      const res = await fetch(`${BASE_GEO_URL}${encodeURIComponent(city)}`);
      if (!res.ok) {
        throw new Error("Error.");
      }
      const text = await res.text();
      if (!text) {
        throw new Error("Unable to fetch data.");
      }
      const data = JSON.parse(text);
      if (!data.results || data.results.length === 0) {
        throw new Error("City not found.");
      }
      const { latitude, longitude } = data.results[0];;
      setError("");

      await fetchWeatherData(latitude, longitude);
      } catch (err) {
        setError(err.message);
        setForecast(null);
      }

  };

  const BASE_WEATHER_URL = "https://api.open-meteo.com/v1/forecast?forecast_days=1&hourly=temperature_2m&temperature_unit=fahrenheit";

  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await fetch(
        `${BASE_WEATHER_URL}&latitude=${lat}&longitude=${lon}`
      );
      if (!response.ok) {
        throw new Error("Error fetching data.");
      }
      const data = await response.json();
      setForecast(data.hourly);
      setError("");
    } catch (err) {
      setError(err.message);
      setForecast(null);
    }
  };

  const handleDefaultCityClick = (defaultCity) => {
    setCity(defaultCity);
    fetchCoordinates();
  };

  useEffect(() => {
    fetchCoordinates();
  }, []);

  return (

    <div className="weather">

      <div className="defaultCities">
        <button className="defaultCity" onClick={() => handleDefaultCityClick("Austin")}>Austin</button>
        <button className="defaultCity" onClick={() => handleDefaultCityClick("Dallas")}>Dallas</button>
        <button className="defaultCity" onClick={() => handleDefaultCityClick("Houston")}>Houston</button>
      </div>

      <h1>Weather Forecast</h1>

      <div className="search-bar">
        <label>
          Search:
          <input type="text" onChange={(e) => setCity(e.target.value)} placeholder="Enter city name"/>
        </label>
      </div>

      <button className="getWeatherButton" onClick={fetchCoordinates}>
        Get Weather
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {forecast && (
        <div>
          <h2>Hourly Forecast</h2>
          <ul>
            {forecast.time.map((time, index) => (
              <li key={time}>
                {new Date(time).toLocaleString().slice(11)}: {forecast.temperature_2m[index]}°F
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;