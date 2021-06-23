import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../index';
import './Map3D.css';
import { Mountain } from '../../MountainDataInterface';
import mapboxgl from 'mapbox-gl';
import MapControls3D from './MapControls3D';
import hikerMarker from '../../Assets/hiker.svg';

let rotating = false;
let rotatingPitch = false;
const rotate = (theMap: mapboxgl.Map, direction: 1 | -1) => {
  theMap.setBearing(theMap.getBearing() + direction);
  rotating && window.requestAnimationFrame(() => rotate(theMap, direction));
};

const rotatePitch = (theMap: mapboxgl.Map, direction: 1 | -1) => {
  theMap.setPitch(theMap.getPitch() + direction);
  rotatingPitch &&
    window.requestAnimationFrame(() => rotatePitch(theMap, direction));
};

const Map3D = ({
  myMountain,
  fullWidth,
}: {
  myMountain: Mountain;
  fullWidth?: boolean;
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const key = useAppContext().mapBoxKey;
  const [theMap, setTheMap] = useState<null | mapboxgl.Map>();
  const [marker, setMarker] = useState<null | mapboxgl.Marker>();

  useEffect(() => {
    if (!theMap && key && mapContainer.current) {
      mapboxgl.accessToken = key;
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        zoom: 12,
        center: [myMountain.coords.longitude, myMountain.coords.latitude],
        pitch: 76,
        bearing: 0,
        style: 'mapbox://styles/mapbox/satellite-v9',
        interactive: true,
      });

      map.on('load', function () {
        map.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14,
        });
        map.setTerrain({ source: 'mapbox-dem', exaggeration: 1 });

        map.addLayer({
          id: 'sky',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [1.0, 40.0],
            'sky-atmosphere-sun-intensity': 15,
          },
        });
      });

      setTheMap(map);
    }

    return () => {
      rotatingPitch = false;
      rotating = false;
    };
  }, [theMap, key, mapContainer, myMountain]);

  useEffect(() => {
    if (markerRef.current && theMap) {
      markerRef.current.style.width = `${42}px`;
      markerRef.current.style.height = `${42}px`;
      setMarker(
        new mapboxgl.Marker(markerRef.current)
          .setLngLat([myMountain.coords.longitude, myMountain.coords.latitude])
          .addTo(theMap)
      );
      markerRef.current.style.backgroundImage = `url('${hikerMarker}')`;
    }
  }, [markerRef, myMountain, theMap]);

  return (
    <div className='Map3D'>
      <div
        className='map-container'
        ref={mapContainer}
        id='map-3d'
        style={fullWidth ? { width: '95vw' } : {}}>
        {theMap && <MapControls3D theMap={theMap} myMountain={myMountain} />}
      </div>
      <div className='marker' ref={markerRef}></div>
    </div>
  );
};

export default Map3D;
