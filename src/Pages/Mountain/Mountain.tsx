import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useAppContext } from '../../index';
import Map3D from '../../Components/Map3D/Map3D';
import FlickrImages from '../../Components/FlickrImages/FlickrImages';
import Image from '../../Components/Image/Image';
import Weather from '../../Components/Weather/Weather';
import './Mountain.css';

const Mountain = () => {
  const ctx = useAppContext();
  const id = parseInt(useParams<{ id: string }>().id);
  const myMountain = ctx.mountainData[id];
  const [flickrUrls, setFlickrUrls] = useState<string[]>([]);
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [noMainImage, setNoMainImage] = useState(
    myMountain.imageUrl === '' ? false : true
  );
  const [randomImageNumber, setRandomImageNumber] = useState(
    Math.floor(Math.random() * flickrUrls.length)
  );
  useEffect(() => {
    const callFlickr = async () => {
      try {
        const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${ctx.flickrKey}&lat=${myMountain.coords.latitude}&lon=${myMountain.coords.longitude}&format=json&nojsoncallback=1&geo_context=2&radius=1`;
        fetch(url)
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (data?.photos?.photo) {
              const arr = data.photos.photo
                .map((item: any) => {
                  if (item.ispublic) {
                    return `https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}_m.jpg`;
                  }
                  return null;
                })
                .filter((el: any) => el !== null);
              setFlickrUrls(arr);
            }
          });
      } catch (err) {
        console.log(err);
      }
    };

    const getWeather = () => {
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${myMountain.coords.latitude}&lon=${myMountain.coords.longitude}&exclude=minutely,alerts&appid=${ctx.weatherKey}&units=metric`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.daily && data.current) {
            setForecast(data.daily);
            setCurrentWeather(data.current);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    callFlickr();
    getWeather();
  }, [myMountain, ctx.flickrKey, ctx.weatherKey, setFlickrUrls]);

  useEffect(() => {
    setRandomImageNumber(Math.floor(Math.random() * flickrUrls.length));
  }, [flickrUrls, setRandomImageNumber]);

  return (
    <div>
      {!myMountain ? (
        <div>Oops! It looks like that page doesn't exist.</div>
      ) : (
        <div className='Mountain'>
          <h1>
            {myMountain.names.romaji} ({myMountain.names.kanji})
          </h1>
          <div className='main-elevation'>
            {myMountain.prefectures.prefecturesEnglish.map(
              (p, index) =>
                `${p}${
                  index !== myMountain.prefectures.prefecturesEnglish.length - 1
                    ? ', '
                    : ''
                }`
            )}
          </div>
          <div className='main-elevation'>
            {myMountain.elevation.toLocaleString()}m
          </div>
          {!noMainImage || flickrUrls.length > 0 ? (
            <p className='mountain-description'>
              {!noMainImage && (
                <Image
                  src={myMountain.imageUrl}
                  alt=''
                  onLoadFail={() => {
                    setNoMainImage(true);
                  }}
                />
              )}
              {noMainImage && flickrUrls.length > 0 && (
                <Image
                  src={`${flickrUrls[randomImageNumber].substring(
                    0,
                    flickrUrls[randomImageNumber].length - 5
                  )}b.jpg`}
                  alt=''
                />
              )}
              {myMountain.description}
            </p>
          ) : (
            <p className='mountain-description'>{myMountain.description}</p>
          )}
          {forecast && currentWeather && (
            <Weather forecast={forecast} currentWeather={currentWeather} />
          )}
          <Map3D myMountain={myMountain} fullWidth={true} />

          {flickrUrls.length && (
            <FlickrImages urls={flickrUrls} myMountain={myMountain} />
          )}
        </div>
      )}
    </div>
  );
};

export default Mountain;
