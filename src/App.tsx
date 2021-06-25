import React, { useState, useEffect } from 'react';
import { useAppContext } from './index';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import Nav from './Components/Nav/Nav';
import Header from './Pages/Header/Header';
import Mountains from './Pages/Mountains/Mountains';
import Mountain from './Pages/Mountain/Mountain';
import MainMap from './Components/MainMap/MainMap';
import Explanation from './Components/Explanation/Explanation';
import Search from './Components/Search/Search';
import SearchCard from './Components/Search/SearchCard';
import { LngLatLike } from 'mapbox-gl';
import { Mountain as Mount } from './MountainDataInterface';

function App() {
  const [mapCenter, setMapCenter] = useState<LngLatLike>([
    138.72905,
    35.360638,
  ]);
  const [mapZoom, setMapZoom] = useState(8);
  const [appStarted, setAppStarted] = useState(false);
  const [searchResults, setSearchResults] = useState<Mount[]>([]);
  const [showAllResults, setShowAllResults] = useState(false);

  const ctx = useAppContext();

  return (
    <Router>
      <div className='App'>
        <Nav />
      </div>
      <Switch>
        <Route path='/' exact>
          <Header />
          {!searchResults.length ? (
            <Search setSearchResults={setSearchResults} />
          ) : (
            ''
          )}
          <div className='search-result-container'>
            {searchResults.length ? (
              <button onClick={() => setSearchResults([])}>
                Clear search results
              </button>
            ) : (
              ''
            )}
            {searchResults.map((result, index) => {
              if (showAllResults || (!showAllResults && index < 7)) {
                return (
                  <SearchCard
                    mountain={result}
                    key={index}
                    index={ctx.mountainData.indexOf(result)}
                  />
                );
              } else if (!showAllResults && index === 7) {
                return (
                  <button onClick={() => setShowAllResults(true)} key={index}>
                    Show all results
                  </button>
                );
              }
              return '';
            })}
          </div>
          <MainMap
            mapCenter={mapCenter}
            setMapCenter={setMapCenter}
            mapZoom={mapZoom}
            setMapZoom={setMapZoom}
            appStarted={appStarted}
            setAppStarted={setAppStarted}
          />
          <Explanation />
        </Route>
        <Route path='/mountains/:id' exact>
          <Mountain />
        </Route>
        <Route path='/mountains' exact>
          <Mountains />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
