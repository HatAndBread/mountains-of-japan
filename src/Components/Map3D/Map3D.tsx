import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../index';

import './Map3D.css';
import { Mountain } from '../../MountainDataInterface';
import mapboxgl, { LngLatLike } from 'mapbox-gl';

let rotating = false;
let rotatingPitch = false;
let changingAltitude = false;
const rotate = (theMap: mapboxgl.Map, direction: 1 | -1) => {
  theMap.setBearing(theMap.getBearing() + direction);
  rotating && window.requestAnimationFrame(() => rotate(theMap, direction));
};

const rotatePitch = (theMap: mapboxgl.Map, direction: 1 | -1) => {
  theMap.setPitch(theMap.getPitch() + direction);
  rotatingPitch &&
    window.requestAnimationFrame(() => rotatePitch(theMap, direction));
};

const Map3D = ({ myMountain }: { myMountain: Mountain }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const key = useAppContext().mapBoxKey;
  const [theMap, setTheMap] = useState<null | mapboxgl.Map>();

  useEffect(() => {
    if (!theMap && key && mapContainer.current) {
      mapboxgl.accessToken = key;
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        zoom: 11.53,
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

    return () => {};
  }, [theMap, key, mapContainer, myMountain]);

  return (
    <div className='Map3D'>
      <button
        onClick={() => {
          if (theMap) {
            theMap.setPitch(76);
            theMap.setBearing(0);
            theMap.setZoom(11.53);
            theMap.flyTo({
              center: [myMountain.coords.longitude, myMountain.coords.latitude],
              essential: true,
            });
          }
        }}>
        Reset
      </button>
      <button
        onMouseDown={() => {
          if (theMap) {
            rotating = true;
            rotate(theMap, 1);
          }
        }}
        onMouseUp={() => {
          rotating = false;
        }}>
        Rotate West👈
      </button>
      <button
        onMouseDown={() => {
          if (theMap) {
            rotating = true;
            rotate(theMap, -1);
          }
        }}
        onMouseUp={() => {
          if (theMap) {
            rotating = false;
          }
        }}>
        Rotate East👉
      </button>
      <button
        onMouseDown={() => {
          if (theMap) {
            rotatingPitch = true;
            rotatePitch(theMap, -1);
          }
        }}
        onMouseUp={() => {
          rotatingPitch = false;
        }}>
        Rotate Up
      </button>
      <button
        onMouseDown={() => {
          if (theMap) {
            rotatingPitch = true;
            rotatePitch(theMap, 1);
          }
        }}
        onMouseUp={() => {
          rotatingPitch = false;
        }}>
        Rotate Down
      </button>
      <div className='map-container' ref={mapContainer} id='map-3d'></div>
    </div>
  );
};

export default Map3D;
