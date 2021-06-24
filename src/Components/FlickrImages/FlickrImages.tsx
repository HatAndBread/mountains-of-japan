import React from 'react';
import './FlickrImages.css';
import Image from '../../Components/Image/Image';
import { Mountain } from '../../MountainDataInterface';

const FlickrImages = ({
  urls,
  myMountain,
}: {
  urls: string[];
  myMountain: Mountain;
}) => {
  const bigImageUrls = urls.map((el) => `${el.substr(0, el.length - 5)}b.jpg`);
  return (
    <div className='FlickrImages'>
      <h2>Photos around {myMountain.names.romaji}</h2>
      <div className='flickr-images'>
        {urls.map((url, index) =>
          index < 10 ? (
            <Image
              pointer={true}
              src={url}
              alt=''
              key={index}
              onClick={() => {
                window.open(bigImageUrls[index], '_blank');
              }}
            />
          ) : (
            ''
          )
        )}
      </div>
    </div>
  );
};
export default FlickrImages;
