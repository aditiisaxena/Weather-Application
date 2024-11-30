import React, { useState } from "react";
import "./Search.css";

function Search({ onCityChange }) {
  const [input, setInput] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      onCityChange(input.trim()); 
      setInput(""); 
    }
  };

  return (
    <form className="search-container" onSubmit={handleSearch}>
      <input
        className="search-input"
        type="text"
        placeholder="Enter City Name..."
        value={input}
        onChange={handleInputChange}
      />
      <button className="search-button" type="submit">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 3 10.5a7.5 7.5 0 0 0 13.65 6.15z" />
        </svg>
      </button>
    </form>
  );
}

export default Search;
