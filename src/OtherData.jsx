import React, { useState, useEffect } from "react";
import "./OtherData.css";

function OtherData({ city, speedUnit }) {
  const [weatherData, setWeatherData] = useState({});
  const [error, setError] = useState("");

  function convertSpeed(speed, unit) {
    switch (unit) {
      case "mph": 
        return (speed * 0.621371).toFixed(1);
      case "km/h": 
      default:
        return speed.toFixed(1);
    }
  }

  // Fetch weather data for additional metrics
  const fetchWeatherStats = (latitude, longitude) => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=relative_humidity_2m,precipitation,cloud_cover,surface_pressure,wind_speed_10m&daily=uv_index_max&forecast_days=1&timezone=auto`
    )
      .then((res) => res.json())
      .then((data) => {
        const current = data.current;
        const daily = data.daily;

        setWeatherData({
          windSpeed: current.wind_speed_10m,
          humidity: current.relative_humidity_2m,
          precipitation: current.precipitation,
          cloudCover: current.cloud_cover,
          pressure: current.surface_pressure,
          uvIndex: daily.uv_index_max[0],
        });
        setError("");
      })
      .catch((err) => {
        setError("Failed to fetch weather stats.");
        console.error(err);
      });
  };

  // Fetch latitude and longitude for the given city
  const fetchCoordinates = (cityName) => {
    fetch(
      `https://geocode.maps.co/search?q=${encodeURIComponent(cityName)}&api_key=664078c99762d208919191ansd70603`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          const { lat, lon } = data[0]; 
          fetchWeatherStats(lat, lon);
        } else {
          setError("City not found. Unable to fetch weather stats.");
        }
      })
      .catch((err) => {
        setError("Failed to fetch city coordinates.");
        console.error(err);
      });
  };
  // Fetch coordinates for the searched city
  useEffect(() => {
    if (city) {
      fetchCoordinates(city); 
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherStats(latitude, longitude);
          },
          (err) => {
            setError("Unable to fetch location. Please enable location services.");
            console.error(err);
          }
        );
      } else {
        setError("Geolocation is not supported by your browser.");
      }
    }
  }, [city]);

  return (
    <div className="weather-stats">
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="icon-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 11 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 8H2" />
              </svg>
            </div>
            <h3>Wind</h3>
            <h2>
              {weatherData.windSpeed
                ? `${convertSpeed(weatherData.windSpeed, speedUnit)} ${speedUnit}`
                : "--"}
            </h2>
          </div>
          <div className="stat-card">
            <div className="icon-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h3>Humidity</h3>
            <h2>{weatherData.humidity || "--"}%</h2>
          </div>
          <div className="stat-card">
            <div className="icon-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="14.31" y1="8" x2="9.69" y2="8" />
                <line x1="12" y1="8" x2="12" y2="16" />
              </svg>
            </div>
            <h3>UV Index</h3>
            <h2>{weatherData.uvIndex || "--"}</h2>
          </div>
          <div className="stat-card">
            <div className="icon-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
            <h3>Precipitation</h3>
            <h2>{weatherData.precipitation || "--"} mm</h2>
          </div>
          <div className="stat-card">
            <div className="icon-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              </svg>
            </div>
            <h3>Pressure</h3>
            <h2>{weatherData.pressure || "--"} hPa</h2>
          </div>
          <div className="stat-card">
            <div className="icon-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 10c1.93 0 3.5 1.57 3.5 3.5S16.43 17 14.5 17H9.5C7.57 17 6 15.43 6 13.5S7.57 10 9.5 10" />
                <path d="M15 10c0-3-2-3-2-6 0-1.5-1-2-1-2s-1 1-1 2c0 3-2 3-2 6" />
              </svg>
            </div>
            <h3>Cloud Cover</h3>
            <h2>{weatherData.cloudCover || "--"}%</h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default OtherData;