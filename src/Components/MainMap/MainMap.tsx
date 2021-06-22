import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useAppContext } from '../../index';
import Marker from './Marker';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MainMap.css';

const MainMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [theMap, setTheMap] = useState<null | mapboxgl.Map>(null);
  const key = useAppContext().mapBoxKey;
  const mountains = useAppContext().mountainData;

  useEffect(() => {
    if (!theMap && key && mapContainer.current) {
      mapboxgl.accessToken = key;
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/cjaudgl840gn32rnrepcb9b9g',
        center: [138.72905, 35.360638],
        zoom: 10,
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
      });
      setTheMap(map);
    }
  }, [theMap, key, mapContainer]);
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
      <div className='map-container' ref={mapContainer} id='map'></div>
    </div>
  );
};

export default MainMap;
