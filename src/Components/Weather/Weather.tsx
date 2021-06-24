import React from 'react';
import './Weather.css';
const DAYS = [
  'SUN',
  'MON',
  'TUES',
  'WED',
  'THU',
  'FRI',
  'SAT',
  'SUN',
  'MON',
  'TUES',
  'WED',
  'THU',
  'FRI',
  'SAT',
];
const Weather = ({
  forecast,
  currentWeather,
}: {
  forecast: any;
  currentWeather: any;
}) => {
  const today = new Date().getDay();
  return (
    <div className='Weather'>
      <div className='forecast'>
        <div className='weather-forecast-day'>
          <div>
            <div>NOW</div>
            <img
              src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
              alt=''></img>
          </div>
          <div>{Math.round(currentWeather.temp)} ℃</div>
        </div>
        {forecast.map((cast: any, index: any) => {
          return (
            <div key={index} className='weather-forecast-day'>
              <div>{DAYS[index + today]}</div>
              <img
                src={`http://openweathermap.org/img/wn/${cast.weather[0].icon}@2x.png`}
                alt={''}></img>
              <div className='temp-high'>
                {Math.round(cast.temp.max)}° {Math.round(cast.temp.min)}°
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Weather;
