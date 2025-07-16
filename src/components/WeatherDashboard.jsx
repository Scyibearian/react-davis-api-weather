import React, { useEffect, useState } from 'react';

const WEATHERLINK_URL = "/v1/current_conditions"; // Local IP of your WLL

export default function WeatherDashboard() {
  const [data, setData] = useState(null);

  const fetchWeather = async () => {
    try {
      const response = await fetch(WEATHERLINK_URL);
      const json = await response.json();
      setData(json.data.conditions);
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, []);

  if (!data) return <p>Loading weather data...</p>;

  const mainSensor = data.find(d => d.txid === 1);
  const indoor = data.find(d => d.data_structure_type === 4);
  const pressure = data.find(d => d.data_structure_type === 3);

  return (
    <div className="p-4 max-w-lg mx-auto text-center bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Weather Dashboard</h1>
      <p><strong>Outdoor Temp:</strong> {mainSensor?.temp} °F</p>
      <p><strong>Humidity:</strong> {mainSensor?.hum} %</p>
      <p><strong>Dew Point:</strong> {mainSensor?.dew_point} °F</p>
      <p><strong>UV Index:</strong> {mainSensor?.uv_index}</p>
      <p><strong>Solar Radiation:</strong> {mainSensor?.solar_rad} W/m²</p>
      <p><strong>Rain (24h):</strong> {mainSensor?.rainfall_last_24_hr} in</p>
      <p><strong>Indoor Temp:</strong> {indoor?.temp_in} °F</p>
      <p><strong>Barometric Pressure:</strong> {pressure?.bar_sea_level} inHg</p>
    </div>
  );
}
