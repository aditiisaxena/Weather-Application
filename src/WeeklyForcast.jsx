import React, { useState, useEffect } from "react";
import "./WeeklyForcast.css";

function WeeklyForcast({ city, tempUnit }) {
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  function getWeatherIcon(code) {
    const icons = {
      0: "src/icons/sunny.png",
      1: "src/icons/clear.png",
      2: "src/icons/cloudy.png",
      63: "src/icons/rainy.png",
      73: "src/icons/snowy.png",
      80: "src/icons/windy.png",
      95: "src/icons/thunder.png",
    };
    return icons[code] || "src/icons/clear.png";
  }

  function convertTemperature(temp, unit) {
    return unit === "F" ? (temp * 9) / 5 + 32 : temp;
  }

  const fetchForecast = (latitude, longitude) => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
    )
      .then((res) => res.json())
      .then((data) => {
        const dailyForecast = data.daily;
        const dates = dailyForecast.time;
        const maxTemps = dailyForecast.temperature_2m_max;
        const minTemps = dailyForecast.temperature_2m_min;
        const weatherCodes = dailyForecast.weathercode;

        const forecastData = dates.map((date, index) => ({
          date: formatDate(date),
          maxTemp: maxTemps[index],
          minTemp: minTemps[index],
          weatherCode: weatherCodes[index],
        }));

        setForecast(forecastData);
        setError("");
      })
      .catch((err) => {
        setError("Failed to fetch 7-day forecast.");
        console.error(err);
      });
  };

  const fetchCoordinates = (cityName) => {
    fetch(
      `https://geocode.maps.co/search?q=${encodeURIComponent(cityName)}&api_key=664078c99762d208919191ansd70603`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          const { lat, lon } = data[0];
          fetchForecast(lat, lon);
        } else {
          setError("City not found. Unable to fetch forecast.");
        }
      })
      .catch((err) => {
        setError("Failed to fetch city coordinates.");
        console.error(err);
      });
  };

  useEffect(() => {
    if (city) {
      fetchCoordinates(city);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchForecast(latitude, longitude);
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
    <div className="forecast-widget">
      {error ? (
        <p className="forecast-error">{error}</p>
      ) : (
        <div className="forecast-cards">
          {forecast.map((day, index) => (
            <div className="forecast-card" key={index}>
              <h2>{day.date}</h2>
              <img
                className="icon"
                src={getWeatherIcon(day.weatherCode)}
                alt="Weather Icon"
              />
              <div className="temperature">
                {Math.round(convertTemperature(day.maxTemp, tempUnit))}° /{" "}
                {Math.round(convertTemperature(day.minTemp, tempUnit))}°
                {tempUnit}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WeeklyForcast;