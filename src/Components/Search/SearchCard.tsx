import React from 'react';
import './SearchCard.css';
import { Mountain } from '../../MountainDataInterface';
import { Link } from 'react-router-dom';

const SearchCard = ({
  mountain,
  index,
}: {
  mountain: Mountain;
  index: number;
}) => {
  return (
    <div className='SearchCard'>
      <div className='mountain-name'>
        {mountain.names.romaji}({mountain.names.kanji})
      </div>
      <div className='mountain-elevation'>
        {mountain.elevation.toLocaleString()}m
      </div>
      {mountain.description.length ? (
        <div className='mountain-description'>
          {mountain.description.substr(0, 120)}...
        </div>
      ) : (
        ''
      )}
      <Link to={`/mountains/${index}`}>Learn more</Link>
    </div>
  );
};

export default SearchCard;
