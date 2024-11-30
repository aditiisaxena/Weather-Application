### Notes

#### **Please Note**
The Geocode API tends to glitch sometimes. In case the App shows an error about not fetching weather details for your location, just refresh the page.

#### **General Overview**
- A weather application developed using React, featuring real-time weather data, hourly forecasts, and customizable settings.
- Responsive design adapts to different screen sizes, toggling visibility of left and right columns for smaller screens.
- User can search for weather by city name or use their current geolocation.

---

#### **Key Components**
1. **Main Component (`App`):**
   - Manages state for:
     - **City:** Currently selected location for weather data.
     - **Visibility:** Toggles for left and right columns based on screen size.
     - **Settings:** Temperature and speed units (Celsius/Fahrenheit, km/h/mph).
   - **Features:**
     - Responsive layout using `window.innerWidth` and `useEffect` for dynamic adjustments.
     - Includes a settings modal for toggling units.

2. **Search Component (`Search`):**
   - Allows user input to set the city for fetching weather data.

3. **Weather Display (`WeatherDisplay`):**
   - Fetches and displays:
     - Current weather details (temperature, chance of rain).
     - City name and weather icon based on API-provided weather codes.
   - **API Integrations:**
     - `OpenWeatherMap` API for city-specific weather.
     - `Open-Meteo` API for geolocation-based weather.

4. **Hourly Forecast (`HourlyForecast`):**
   - Displays hourly temperature and weather icons using cards.
   - **Graph Visualization:**
     - Line chart showing temperature variations over the day using `Chart.js`.
   - Fetches:
     - Hourly temperature, weather codes, and time.
   - Coordinates fetched through:
     - City search (via `Geocode API`).
     - User's geolocation.

5. **Other Data (`OtherData`):**
   - Fetches and displays additional weather-related metrics (e.g., wind speed).
   - Speed units toggle between `km/h` and `mph`.

6. **Weekly Forecast (`WeeklyForcast`):**
   - Provides a 7-day weather outlook, including temperature and weather icons.

7. **Settings Modal (`SettingsModal`):**
   - Allows users to toggle:
     - Temperature unit (Celsius ↔ Fahrenheit).
     - Speed unit (km/h ↔ mph).

8. **Detail Panel (`Detail`):**
   - Sidebar providing additional information or quick actions like opening settings.

---

#### **Functional Highlights**
1. **Dynamic Responsiveness:**
   - Left and right panels are hidden/shown depending on screen size (<992px).
   - Adjusts layout orientation using `isHorizontal` state.

2. **Geolocation Support:**
   - Fetches current location for weather if no city is specified.

3. **Error Handling:**
   - Displays user-friendly messages for:
     - Invalid city search.
     - Geolocation issues (e.g., denied access).

4. **Custom Icons:**
   - Weather conditions mapped to custom icons based on weather codes.

5. **Graphical Representation:**
   - Temperature trends visualized using a line chart for better clarity.

6. **API Integrations:**
   - `OpenWeatherMap`, `Open-Meteo`, and `Geocode API` for diverse and reliable weather data sources.

7. **Performance Optimization:**
   - Data fetching logic encapsulated within `useEffect` hooks to minimize redundant calls.
