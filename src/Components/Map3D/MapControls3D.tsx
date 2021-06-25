import React, { useEffect } from 'react';
import { Map } from 'mapbox-gl';
import { Mountain } from '../../MountainDataInterface';
import './MapControls3D.css';

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

const MapControls3D = ({
  theMap,
  myMountain,
}: {
  theMap: Map;
  myMountain: Mountain;
}) => {
  useEffect(() => {
    return () => {
      rotating = false;
      rotatingPitch = false;
    };
  }, []);
  const start = (num: 1 | -1) => {
    if (theMap) {
      rotatingPitch = true;
      rotatePitch(theMap, num);
    }
  };
  const end = () => (rotatingPitch = false);
  return (
    <div className='MapControls3d'>
      <table>
        <tbody>
          <tr>
            <td></td>
            <td>
              {' '}
              <button
                onMouseDown={() => {
                  start(-1);
                }}
                onMouseUp={end}
                onTouchStart={() => start(1)}
                onTouchEnd={() => end}>
                👆
              </button>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              {' '}
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
                👈
              </button>
            </td>
            <td>
              {' '}
              <button
                onClick={() => {
                  if (theMap) {
                    theMap.setPitch(76);
                    theMap.setBearing(0);
                    theMap.setZoom(11.53);
                    theMap.flyTo({
                      center: [
                        myMountain.coords.longitude,
                        myMountain.coords.latitude,
                      ],
                      essential: true,
                    });
                  }
                }}>
                ⛰
              </button>
            </td>
            <td>
              {' '}
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
                👉
              </button>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              {' '}
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
                👇
              </button>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MapControls3D;
