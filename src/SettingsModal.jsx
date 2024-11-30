import React from "react";
import "./SettingsModal.css";

function SettingsModal({ closeModal, tempUnit, speedUnit, toggleTempUnit, toggleSpeedUnit }) {
  return (
    <div className="settings-modal">
      <div className="settings-modal-content">
        <h3>Settings</h3>
        <label className="switch">
          <span>Celsius to Fahrenheit</span>
          <input
            type="checkbox"
            checked={tempUnit === "F"}
            onChange={toggleTempUnit}
          />
          <span className="slider"></span>
        </label>
        <label className="switch">
          <span>km/h to mph</span>
          <input
            type="checkbox"
            checked={speedUnit === "mph"}
            onChange={toggleSpeedUnit}
          />
          <span className="slider"></span>
        </label>
        <button className="close-modal" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
}

export default SettingsModal;