import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Data {
  main: {
    temp: number;
  };
  weather: { description: string; icon: string }[];
  name: string;
  sys: {
    country: string;
  };
}

const API_KEY = '9aa04fe1eb26ada16faf0264d98fac2f';

// O‘zbekistonning barcha shaharlarini kiritish
const CITIES = [
  'Tashkent', 'Samarkand', 'Bukhara', 'Andijan', 'Namangan', 'Fergana', 'Nukus',
  'Karakalpakstan', 'Jizzakh', 'Khiva', 'Termiz', 'Shahrisabz', 'Zarafshan', 'Gulistan'
];

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uzbekCitiesWeather, setUzbekCitiesWeather] = useState<Data[]>([]);

  const fetchWeather = async () => {
    if (!searchTerm.trim()) {
      setError('Iltimos, shahar yoki davlat nomini kiriting.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&units=metric&appid=${API_KEY}`
      );
      setData(res.data);
    } catch (err) {
      setError('Shahar yoki davlat nomi topilmadi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUzbekCitiesWeather = async () => {
      try {
        const promises = CITIES.map((city) =>
          axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
          )
        );
        const responses = await Promise.all(promises);
        const citiesData = responses.map((res) => res.data);
        setUzbekCitiesWeather(citiesData);
      } catch (err) {
        console.error('O‘zbekiston shaharlari uchun ob-havo ma’lumotlari yuklanmadi.');
      }
    };

    fetchUzbekCitiesWeather();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-4 flex flex-col items-center">
      <div className="mb-6 w-full max-w-md">
        <input
          type="text"
          placeholder="Shahar yoki davlat nomini kiriting..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
        />
        <button
          onClick={fetchWeather}
          className="mt-2 p-2 bg-blue-500 text-white rounded-lg w-full hover:bg-blue-600"
        >
          Qidirish
        </button>
      </div>

      {loading && <p className="text-center text-white">Yuklanmoqda...</p>}

      {error && <p className="text-center text-red-500">{error}</p>}

      {data && (
        <div className="bg-white rounded-lg shadow-lg p-4 w-64 text-center">
          <h1 className="text-xl font-bold text-gray-800">
            {data.name}, {data.sys.country}
          </h1>
          <div className="flex justify-center items-center mb-4">
            <img
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt={data.weather[0].description}
              className="w-16 h-16"
            />
          </div>
          <p className="text-4xl font-bold text-blue-500">
            {data.main.temp}°C
          </p>
          <p className="capitalize text-lg text-gray-600 mt-2">
            {data.weather[0].description}
          </p>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white mb-4">O‘zbekiston shaharlari ob-havosi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {uzbekCitiesWeather.map((cityWeather, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-4 text-center">
              <h3 className="text-xl font-bold text-gray-800">
                {cityWeather.name}, {cityWeather.sys.country}
              </h3>
              <div className="flex justify-center items-center mb-4">
                <img
                  src={`https://openweathermap.org/img/wn/${cityWeather.weather[0].icon}@2x.png`}
                  alt={cityWeather.weather[0].description}
                  className="w-16 h-16"
                />
              </div>
              <p className="text-4xl font-bold text-blue-500">
                {cityWeather.main.temp}°C
              </p>
              <p className="capitalize text-lg text-gray-600 mt-2">
                {cityWeather.weather[0].description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
