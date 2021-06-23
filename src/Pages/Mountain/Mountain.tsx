import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useAppContext } from '../../index';
import Map3D from '../../Components/Map3D/Map3D';
import FlickrImages from '../../Components/FlickrImages/FlickrImages';
import Image from '../../Components/Image/Image';
import './Mountain.css';

const Mountain = () => {
  const ctx = useAppContext();
  const id = parseInt(useParams<{ id: string }>().id);
  const myMountain = ctx.mountainData[id];
  const [flickrUrls, setFlickrUrls] = useState([]);
  const [noMainImage, setNoMainImage] = useState(
    myMountain.imageUrl ? false : true
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
              const arr = data.photos.photo.map((item: any) => {
                console.log(item);
                if (item.ispublic) {
                  return `https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}_m.jpg`;
                }
              });
              setFlickrUrls(arr);
            }
          });
      } catch (err) {
        console.log(err);
      }
    };
    callFlickr();
  }, [myMountain]);

  return (
    <div>
      {!myMountain ? (
        <div>Oops! It looks like that page doesn't exist.</div>
      ) : (
        <div className='Mountain'>
          <h1>
            {myMountain.names.romaji} ({myMountain.names.kanji})
          </h1>
          <h2>{myMountain.elevation.toLocaleString()}m</h2>
          <Map3D myMountain={myMountain} fullWidth={true} />
          {myMountain.description && (
            <p className='mountain-description'>
              {!noMainImage && (
                <Image
                  src={myMountain.imageUrl}
                  alt='🏔'
                  onLoadFail={() => {
                    setNoMainImage(true);
                  }}
                />
              )}
              {myMountain.description}
            </p>
          )}
        </div>
      )}

      {flickrUrls.length && (
        <FlickrImages urls={flickrUrls} myMountain={myMountain} />
      )}
    </div>
  );
};

export default Mountain;
