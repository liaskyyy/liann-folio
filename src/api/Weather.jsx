
import React, { useEffect, useState } from "react";

function Weather() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {

        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=14.5995&longitude=120.9842&current_weather=true`
        );
        const data = await res.json();
        if (data.current_weather) {
          setWeather({
            temp: Math.round(data.current_weather.temperature),
            wind: data.current_weather.windspeed,
          });
        }
      } catch (err) {
        console.error("Weather fetch error:", err);
      }
    };

    fetchWeather();
  }, []);

  if (!weather) return <div className="text-gray-500">Loading weather...</div>;

  return (
    <div className="ml-4 px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-800 dark:text-gray-200">
      {weather.temp}°C 🌤️
    </div>
  );
}

export default Weather;
