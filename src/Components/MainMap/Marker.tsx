import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import smallMountainMarker from '../../Assets/small-mountain.svg';
import bigMountainMarker from '../../Assets/big-mountain.svg';
import fujiMarker from '../../Assets/fuji.svg';
import { Mountain } from '../../MountainDataInterface';

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
    const label = document.createElement('div');
    const labelTitle = document.createElement('p');
    const labelElevation = document.createElement('p');
    labelTitle.innerText = `${mountain.names.romaji} (${mountain.names.kanji})`;
    labelTitle.className = 'label-title';
    labelElevation.innerText = `${mountain.elevation.toLocaleString()}m`;
    label.appendChild(labelTitle);
    label.appendChild(labelElevation);
    label.className = 'mountain-label';
    document.body.appendChild(label);
    const handleMouseEnter = () => {
      label.style.opacity = '0.8';
      label.style.top = `${div.getBoundingClientRect().y}px`;
      label.style.left = `${div.getBoundingClientRect().x}px`;
    };
    const handleMouseLeave = () => {
      label.style.opacity = '0';
    };

    div.className = 'marker';
    div.addEventListener('click', onClick);
    div.addEventListener('mouseenter', handleMouseEnter);
    div.addEventListener('mouseleave', handleMouseLeave);
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
      label.remove();
      div.removeEventListener('click', onClick);
      div.removeEventListener('mouseenter', handleMouseEnter);
      div.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [theMap, mountain, index, history]);
  return null;
};

export default Marker;
