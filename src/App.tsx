import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Data {
  main: {
    temp: number;
  };
  weather: { description: string; icon: string }[];
  name: string;
}

interface Region {
  name: string;
  lat: string;
  lon: string;
}

const regions: Region[] = [
  { name: 'Toshkent', lat: '41.2995', lon: '69.2401' },
  { name: 'Fargona', lat: '40.3897', lon: '71.7843' },
  { name: 'Samarqand', lat: '39.6542', lon: '66.9597' },
  { name: 'Buxoro', lat: '39.7747', lon: '64.4286' },
  { name: 'Urganch', lat: '41.5531', lon: '60.6208' },
  { name: 'Qarshi', lat: '38.8606', lon: '65.7847' },
  { name: 'Nukus', lat: '42.4531', lon: '59.6101' },
  { name: 'Andijon', lat: '40.7836', lon: '72.3500' },
  { name: 'Namangan', lat: '41.00386984059317', lon: '71.63672248203974' },
  { name: 'Termiz', lat: '37.2245', lon: '67.2783' },
];

const API_KEY = '9aa04fe1eb26ada16faf0264d98fac2f';

const App: React.FC = () => {
  const [data, setData] = useState<{ [key: string]: Data | null }>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.all(
          regions.map(async (region) => {
            const res = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${region.lat}&lon=${region.lon}&units=metric&appid=${API_KEY}`
            );
            return { [region.name]: res.data };
          })
        );
        setData(Object.assign({}, ...results));
      } catch (error) {
        console.error('Xatolik yuz berdi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center text-blue-500">Yuklanmoqda...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex flex-wrap justify-center items-center gap-4 p-4">
      {regions.map((region) => {
        const regionData = data[region.name];
        return (
          <div
            key={region.name}
            className="bg-white rounded-lg shadow-lg p-4 w-64 text-center"
          >
            <h1 className="text-xl font-bold text-gray-800">{region.name} Ob-Havosi</h1>
            {regionData && (
              <div>
                <div className="flex justify-center items-center mb-4">
                  <img
                    src={`https://openweathermap.org/img/wn/${regionData.weather[0].icon}@2x.png`}
                    alt={regionData.weather[0].description}
                    className="w-16 h-16"
                  />
                </div>
                <p className="text-4xl font-bold text-blue-500">
                  {regionData.main.temp}°C
                </p>
                <p className="capitalize text-lg text-gray-600 mt-2">
                  {regionData.weather[0].description}
                </p>
                {regionData.weather[0].icon.includes('01') && (
                  <p className="mt-4 text-yellow-500">☀️ Quyoshli kun</p>
                )}
                {regionData.weather[0].icon.includes('02') && (
                  <p className="mt-4 text-gray-500">⛅ Qisman bulutli</p>
                )}
                {regionData.weather[0].icon.includes('03') ||
                regionData.weather[0].icon.includes('04') ? (
                  <p className="mt-4 text-gray-700">☁️ Bulutli</p>
                ) : null}
                {regionData.weather[0].icon.includes('09') ||
                regionData.weather[0].icon.includes('10') ? (
                  <p className="mt-4 text-blue-600">🌧️ Yomg‘ir</p>
                ) : null}
                {regionData.weather[0].icon.includes('11') && (
                  <p className="mt-4 text-purple-700">⛈️ Momaqaldiroq</p>
                )}
                {regionData.weather[0].icon.includes('13') && (
                  <p className="mt-4 text-blue-300">❄️ Qor yog‘moqda</p>
                )}
                {regionData.weather[0].icon.includes('50') && (
                  <p className="mt-4 text-gray-500">🌫️ Tuman</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default App;
