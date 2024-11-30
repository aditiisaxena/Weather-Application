import React, { useState, useEffect } from "react";
import "./WeatherDisplay.css";

const openWeatherApiKey = '6fc6634c6e125d1affb195afc7b74557';

function WeatherDisplay({ city, tempUnit }) {
  const [cityName, setCityName] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [weatherCode, setWeatherCode] = useState(null);
  const [chanceOfRain, setChanceOfRain] = useState(null);
  const [error, setError] = useState("");

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

  const convertTemperature = (temp, unit) => {
    return unit === 'F' ? (temp * 9) / 5 + 32 : temp;
  };

  const fetchWeatherByCity = (searchedCity) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${openWeatherApiKey}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === 200) { 
          setCityName(data.name);
          setTemperature(data.main.temp); // Keep temperature in Celsius from API
          setChanceOfRain(data.clouds.all);
          setWeatherCode(data.weather[0].id);
          setError("");
        } else {
          setError("City not found. Please try again.");
        }
      })
      .catch((err) => {
        setError("Failed to fetch weather data for the city.");
        console.error(err);
      });
  };

  const fetchWeatherByLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          )
            .then((res) => res.json())
            .then((data) => {
              setTemperature(data.current_weather.temperature);
              setWeatherCode(data.current_weather.weathercode);
            })
            .catch((err) => {
              setError("Failed to fetch weather data for your location.");
              console.error(err);
            });

          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherApiKey}&units=metric`
          )
            .then((res) => res.json())
            .then((data) => {
              setChanceOfRain(data.clouds.all);
              setCityName(data.name);
            })
            .catch((err) => {
              setError("Failed to fetch chance of rain data for your location.");
              console.error(err);
            });
        },
        (err) => {
          setError("Unable to fetch location. Please enable location services.");
          console.error(err);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    if (city) {
      fetchWeatherByCity(city); 
    } else {
      fetchWeatherByLocation(); 
    }
  }, [city]); 

  return (
    <div className="weather-widget">
      <h1 className="weather-title">{cityName}</h1>
      {error ? (
        <p className="weather-error">{error}</p>
      ) : temperature !== null ? (
        <div className="weather-content">
          <div className="weather-details">
            <p>Chance of Rain: {chanceOfRain}%</p>
            <h1>{convertTemperature(temperature, tempUnit)}°{tempUnit}</h1>
          </div>
          <div className="weather-icon">
            <img src={getWeatherIcon(weatherCode)} alt="Weather Icon" />
          </div>
        </div>
      ) : (
        <p>Fetching weather data...</p>
      )}
    </div>
  );  
}

export default WeatherDisplay;