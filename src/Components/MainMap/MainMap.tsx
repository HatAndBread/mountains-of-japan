import React, { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MainMap.css';
import { useAppContext } from '../../index';
import Marker from './Marker';
import mapboxgl from 'mapbox-gl';
import { LngLatLike } from 'mapbox-gl';

const MainMap = ({
  mapCenter,
  setMapCenter,
  mapZoom,
  setMapZoom,
  appStarted,
  setAppStarted,
}: {
  mapCenter: LngLatLike;
  setMapCenter: React.Dispatch<React.SetStateAction<LngLatLike>>;
  mapZoom: number;
  setMapZoom: React.Dispatch<React.SetStateAction<number>>;
  appStarted: boolean;
  setAppStarted: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const [theMap, setTheMap] = useState<null | mapboxgl.Map>(null);
  const key = useAppContext().mapBoxKey;
  const mountains = useAppContext().mountainData;

  useEffect(() => {
    if (!theMap && key && mapContainer.current && hintRef.current) {
      mapboxgl.accessToken = key;
      if (!appStarted) {
        hintRef.current.style.display = 'block';
        setAppStarted(true);
      }
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/cjaudgl840gn32rnrepcb9b9g',
        center: mapCenter,
        zoom: mapZoom,
      });
      map.on('load', () => {
        map.addSource('dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        });
        map.addLayer(
          {
            id: 'hillshading',
            source: 'dem',
            type: 'hillshade',
          },
          'waterway-river-canal-shadow'
        );
        if (hintRef.current) {
          hintRef.current.style.opacity = '0';
        }
      });
      map.on('move', () => {
        setMapCenter(map.getCenter());
      });
      map.on('zoomend', () => {
        setMapZoom(map.getZoom());
      });
      setTheMap(map);
    }
  }, [
    theMap,
    key,
    mapCenter,
    mapContainer,
    setMapCenter,
    mapZoom,
    setMapZoom,
    hintRef,
    appStarted,
    setAppStarted,
  ]);

  return (
    <div className='MainMap'>
      {mountains &&
        theMap &&
        mountains.map((mountain, index) => (
          <Marker
            theMap={theMap}
            mountain={mountain}
            key={index}
            index={index}
          />
        ))}
      <div className='map-container' ref={mapContainer} id='map'>
        <div className='map-hint' ref={hintRef}>
          💡Click on any mountain to learn more about it
        </div>
      </div>
    </div>
  );
};

export default MainMap;
