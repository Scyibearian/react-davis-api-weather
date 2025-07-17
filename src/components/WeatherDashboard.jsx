import React, { useEffect, useState } from 'react';

//import { Wind } from 'lucide-react'; // Optional if using lucide instead of heroicons
import { ArrowPathIcon, CloudIcon, SunIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

const WEATHERLINK_URL = "/v1/current_conditions"; // Local IP of WeatherLink Live

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
    const interval = setInterval(fetchWeather, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  if (!data) return <p className="text-center text-gray-500 mt-10">Loading weather data...</p>;

  const mainSensor = data.find(d => d.txid === 1);
  const indoor = data.find(d => d.data_structure_type === 4);
  const pressure = data.find(d => d.data_structure_type === 3);
  const windSensor = data.find(d => d.txid === 6);

  const toCelsius = f => ((f - 32) * 5) / 9;  

  const Card = ({ label, value, unit, icon: Icon, spin = false }) => (
    <div className="bg-white shadow rounded-xl p-4 flex flex-col items-center justify-center">
      {Icon && (
        <Icon className={`h-6 w-6 text-blue-400 mb-1 ${spin ? 'animate-spin-slow' : ''}`} />
      )}
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-blue-600">
        {value} <span className="text-sm">{unit}</span>
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 p-8 overflow-x-auto">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">Stone Lane Weather</h1>
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Temperature & Environment Column */}
        <section className="flex-1 min-w-[300px]">
          <h2 className="text-xl font-semibold text-blue-700 mb-4 border-b border-blue-300 pb-2 text-center">🌡️ Temperature</h2>
          <div className="grid grid-cols-1 gap-6">
            <Card label="Outdoor Temp" value={`${mainSensor?.temp}°F / ${toCelsius(mainSensor?.temp).toFixed(1)}°C`} />
            <Card label="Humidity" value={mainSensor?.hum} unit="%" />
            <Card label="Indoor Temp" value={`${indoor?.temp_in}°F / ${toCelsius(indoor?.temp_in).toFixed(1)}°C`} />
            <Card label="Dew Point" value={`${mainSensor?.dew_point}°F / ${toCelsius(mainSensor?.dew_point).toFixed(1)}°C`} />
          </div>
        </section>

        {/* Indoor & Pressure Column */}
        <section className="flex-1 min-w-[300px]">
          <h2 className="text-xl font-semibold text-blue-700 mb-4 border-b border-blue-300 pb-2 text-center">🌤️ Weather</h2>
          <div className="grid grid-cols-1 gap-6">
            <Card label="UV Index" value={mainSensor?.uv_index} unit="" />
            <Card label="Solar Radiation" value={mainSensor?.solar_rad} unit="W/m²" icon={SunIcon} spin />
            <Card label="Rain (24h)" value={mainSensor?.rainfall_last_24_hr} unit="in" />
            <Card label="Pressure" value={pressure?.bar_sea_level} unit="inHg" />
          </div>
        </section>

        {/* Wind Column */}
        <section className="flex-1 min-w-[300px]">
          <h2 className="text-xl font-semibold text-blue-700 mb-4 border-b border-blue-300 pb-2 text-center">💨 Wind</h2>
          <div className="grid grid-cols-1 gap-6">
            <Card label="Wind Speed (Last)" value={windSensor?.wind_speed_last} unit="mph" icon={ArrowPathIcon} spin />
            <Card label="Wind Dir (Last)" value={windSensor?.wind_dir_last} unit="°" icon={ArrowUpIcon} />
            <Card label="Wind Avg (10 min)" value={windSensor?.wind_speed_avg_last_10_min} unit="mph" icon={ArrowPathIcon} spin />
            <Card label="Wind Gust (10 min)" value={windSensor?.wind_speed_hi_last_10_min} unit="mph" icon={CloudIcon} />
          </div>
        </section>
      </div>
    </div>
  );

//store data and make history into graphs
}