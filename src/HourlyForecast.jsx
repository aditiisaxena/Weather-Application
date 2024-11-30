import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {Chart as ChartJS,LineElement,CategoryScale,LinearScale,PointElement,Title,Tooltip,
Legend} from "chart.js";
import "./HourlyForecast.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function HourlyForecast({ city, tempUnit }) {
  const [hourlyData, setHourlyData] = useState([]);
  const [error, setError] = useState("");

  function formatTime(timeStr) {
    const time = new Date(timeStr);
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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

  const fetchHourlyForecast = (latitude, longitude) => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code&forecast_days=1&timezone=auto`
    )
      .then((res) => res.json())
      .then((data) => {
        const hourlyForecast = data.hourly;
        const times = hourlyForecast.time;
        const temperatures = hourlyForecast.temperature_2m;
        const weatherCodes = hourlyForecast.weather_code;

        const hourlyDataFormatted = times.map((time, index) => ({
          time: formatTime(time),
          temperature: temperatures[index], 
          weatherCode: weatherCodes[index],
          icon: getWeatherIcon(weatherCodes[index]),
        }));

        setHourlyData(hourlyDataFormatted);
        setError("");
      })
      .catch((err) => {
        setError("Failed to fetch hourly forecast.");
        console.error(err);
      });
  };
  {/*geocode api fetches devices current coordinates as well as returns coordinates of an inputted city/state/country*/}
  const fetchCoordinates = (cityName) => {
    fetch(
      `https://geocode.maps.co/search?q=${encodeURIComponent(cityName)}&api_key=664078c99762d208919191ansd70603`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          const { lat, lon } = data[0];
          fetchHourlyForecast(lat, lon);
        } else {
          setError("City not found. Unable to fetch hourly forecast.");
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
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchHourlyForecast(latitude, longitude);
        },
        (err) => {
          setError("Unable to fetch location. Please enable location services.");
          console.error(err);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, [city]);

  {/*Graph*/}
  const graphData = {
    labels: hourlyData.map((hour) => hour.time),
    datasets: [
      {
        label: `Temperature (°${tempUnit})`,
        data: hourlyData.map((hour) =>
          convertTemperature(hour.temperature, tempUnit)
        ),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: `Temperature (°${tempUnit})`,
        },
        ticks: {
          stepSize: tempUnit === "F" ? 10 : 5, 
        },
      },
    },
  };

  return (
    <div className="full">
      <div className="hourly-forecast-widget">
        {error ? (
          <p className="hourly-forecast-error">{error}</p>
        ) : (
          <>
            <div className="hourly-forecast-cards">
              {hourlyData.map((hour, index) => (
                <div className="hourly-forecast-card" key={index}>
                  <h3 className="time">{hour.time}</h3>
                  <img className="weather-icon" src={hour.icon} alt="Weather Icon" />
                  <div className="temperature">
                    {Math.round(convertTemperature(hour.temperature, tempUnit))}°
                    {tempUnit}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="temperature-graph-container">
        <Line data={graphData} options={graphOptions} />
      </div>
    </div>
  );
}

export default HourlyForecast;