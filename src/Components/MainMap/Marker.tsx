import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import smallMountainMarker from '../../Assets/small-mountain.svg';
import bigMountainMarker from '../../Assets/big-mountain.svg';
import fujiMarker from '../../Assets/fuji.svg';
import { Mountain } from '../../MountainDataInterface';
import './MainMap.css';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Props {
  theMap: null | mapboxgl.Map;
  mountain: Mountain;
  index: number;
}
const Marker = ({ theMap, mountain, index }: Props) => {
  const history = useHistory();
  useEffect(() => {
    const onClick = () => {
      history.push(`/mountains/${index}`);
    };
    const div = document.createElement('div');
    div.className = 'marker';
    div.addEventListener('click', onClick);
    if (mountain.names.romaji === 'Fujisan') {
      div.style.backgroundImage = `url('${fujiMarker}')`;
      div.style.height = '60px';
      div.style.width = '60px';
      div.style.zIndex = '100';
    } else {
      div.style.backgroundImage = `url('${
        mountain.elevation < 2000 ? smallMountainMarker : bigMountainMarker
      }')`;
    }
    if (theMap) {
      new mapboxgl.Marker(div)
        .setLngLat([mountain.coords.longitude, mountain.coords.latitude])
        .addTo(theMap);
    }
    return () => {
      div.remove();
      div.removeEventListener('click', onClick);
    };
  }, [theMap, mountain, index, history]);
  return null;
};

export default Marker;
