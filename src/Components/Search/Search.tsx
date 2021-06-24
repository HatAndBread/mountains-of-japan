import React, { useState } from 'react';
import './Search.css';
import { useAppContext } from '../../index';
import { Mountain } from '../../MountainDataInterface';

const Search = ({
  setSearchResults,
}: {
  setSearchResults: React.Dispatch<React.SetStateAction<Mountain[]>>;
}) => {
  const ctx = useAppContext();
  const mountains = ctx.mountainData;
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className='Search'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const s = searchTerm.toLowerCase();
          const results = mountains.filter((mountain) => {
            if (
              mountain.description.toLowerCase().includes(s) ||
              mountain.prefectures.prefecturesEnglish[0]?.includes(s) ||
              mountain.prefectures.prefecturesEnglish[1]?.includes(s) ||
              mountain.prefectures.prefecturesEnglish[2]?.includes(s) ||
              mountain.prefectures.prefecturesJapanese[0]?.includes(s) ||
              mountain.prefectures.prefecturesJapanese[1]?.includes(s) ||
              mountain.prefectures.prefecturesJapanese[2]?.includes(s) ||
              mountain.names.romaji.toLowerCase().includes(s) ||
              mountain.names.kana.includes(s) ||
              mountain.names.kanji?.includes(s) ||
              mountain.names.alternativeKanji?.includes(s) ||
              mountain.names.alternativeKana?.includes(s) ||
              mountain.names.alternativeRomaji?.toLowerCase().includes(s)
            ) {
              return mountain;
            }
          });
          const ordered: Mountain[] = [];
          results.map((result) => {
            if (
              result.names.romaji.toLowerCase().includes(s) ||
              result.names.kanji === s ||
              result.names.alternativeKanji === s ||
              result.names.alternativeRomaji?.toLowerCase() === s
            ) {
              ordered.unshift(result);
            } else {
              ordered.push(result);
            }
          });
          setSearchResults(ordered);
        }}>
        <input
          type='text'
          name='search'
          id='search'
          placeholder='Search by name or area'
          onChange={(e) => {
            setSearchTerm(e.currentTarget.value.toLowerCase());
          }}
        />
        <button type='submit'>Search</button>
      </form>
    </div>
  );
};

export default Search;
