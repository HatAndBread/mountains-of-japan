import React, { createContext, useContext } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { getAllMountains } from './mountains';

const initialContext = {
  mountainData: getAllMountains(),
  mapBoxKey: process.env.REACT_APP_MAPBOX_KEY,
  flickrKey: process.env.REACT_APP_FLICKR_KEY,
  weatherKey: process.env.REACT_APP_WEATHER_KEY,
};

export const useAppContext = () => useContext(Context);

export const Context = createContext(initialContext);
ReactDOM.render(
  <React.StrictMode>
    <Context.Provider value={initialContext}>
      <App />
    </Context.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
