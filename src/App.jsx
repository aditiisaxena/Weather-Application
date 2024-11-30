import React, { useState, useEffect } from "react";
import Search from "./Search";
import WeatherDisplay from "./WeatherDisplay";
import HourlyForecast from "./HourlyForecast";
import OtherData from "./OtherData";
import WeeklyForcast from "./WeeklyForcast";
import Detail from "./Deet.jsx";
import SettingsModal from "./SettingsModal";
import './App.css';

function App() {

  // State Management
  const [city, setCity] = useState("");
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempUnit, setTempUnit] = useState("C"); 
  const [speedUnit, setSpeedUnit] = useState("km/h"); 

  // hides or shows left and right coluumns based on the size of the window  
  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth < 992; 
      setIsHorizontal(isSmallScreen); 
      setShowLeft(isSmallScreen); 
      setShowRight(isSmallScreen); 
    };

    handleResize(); 
    window.addEventListener("resize", handleResize); 
    return () => window.removeEventListener("resize", handleResize); 
  }, []);

  const toggleTempUnit = () => setTempUnit(tempUnit === "C" ? "F" : "C");
  const toggleSpeedUnit = () => setSpeedUnit(speedUnit === "km/h" ? "mph" : "km/h");

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Left Column */}
        <div
          className={`${
            isHorizontal ? "horizontal-container" : "col-lg-2"
          } ${showLeft ? "d-block" : "d-none d-lg-block"}`}
        >
          <div className="p-3">
            <Detail isHorizontal={isHorizontal} openSettings={() => setIsSettingsOpen(true)} />
          </div>
        </div>

        {/* Middle Column */}
        <div
          className="col-lg-7 middle-column"
          style={{ paddingTop: isHorizontal ? "50px" : "0px" }}
        >
          <div className="sticky-search-bar">
            <Search onCityChange={setCity} />
          </div>
          <div className="p-3">
            <WeatherDisplay city={city} tempUnit={tempUnit} />
          </div>
          <div className="p-3">
            <h3 className="forecast-heading">Today's Forecast</h3>
            <HourlyForecast city={city} tempUnit={tempUnit} />
          </div>
          <div className="p-4">
            <OtherData city={city} tempUnit={tempUnit} speedUnit={speedUnit} />
          </div>
        </div>

        {/* Right Column */}
        <div className={`col-lg-3 ${showRight ? "d-block" : "d-none d-lg-block"}`}>
          <div className="p-3">
            <h3 className="forecast-heading">7 Days Forecast</h3>
            <WeeklyForcast city={city} tempUnit={tempUnit} />
          </div>
        </div>
      </div>

      {/* Settings Window */}
      {isSettingsOpen && (
        <>
          <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}></div>
          <div className="settings-modal">
            <SettingsModal
              closeModal={() => setIsSettingsOpen(false)}
              tempUnit={tempUnit}
              speedUnit={speedUnit}
              toggleTempUnit={toggleTempUnit}
              toggleSpeedUnit={toggleSpeedUnit}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;