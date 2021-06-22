import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useAppContext } from '../../index';
import Map3D from '../../Components/Map3D/Map3D';

const Mountain = () => {
  const ctx = useAppContext();
  const id = parseInt(useParams<{ id: string }>().id);
  const myMountain = ctx.mountainData[id];
  const [wikiPicture, setWikiPicture] = useState();
  const [englishArticle, setEnglishArticle] = useState();
  useEffect(() => {
    if (myMountain) {
      const getRebuiltName = (s: string) => {
        if (s.match(/san$/)) {
          return s.substring(0, s.length - 3);
        } else if (s.match(/yama$/) || s.match(/dake$/)) {
          return s.substring(0, s.length - 4);
        }
        return s;
      };
      const parseResponseData = (data: any) => {
        if (data?.query?.pages) {
          const response: any = data.query.pages;
          const keys = Object.keys(response);
          if (response[keys[0]]) {
            return response[keys[0]];
          }
        }
      };
      const wikiCall = async () => {
        try {
          const res = await fetch(
            `https://ja.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=pageimages&piprop=thumbnail&pithumbsize=600&titles=${myMountain.names.kanji}`
          );
          const data = await res.json();
          const result = parseResponseData(data);
          if (result?.thumbnail?.source) {
            setWikiPicture(result.thumbnail.source);
          } else {
            setWikiPicture(undefined);
          }
        } catch (err) {
          setWikiPicture(undefined);
        }
      };
      const getEnglishWikiArticle = async () => {
        try {
          const res = await fetch(
            `https://en.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts&exintro&explaintext&redirects=1&titles=Mount_${getRebuiltName(
              myMountain.names.romaji
            )}`
          );
          const data = await res.json();
          const result = parseResponseData(data);
          if (result?.extract) {
            if (!result.missing && !result.extract.includes('may refer to')) {
              setEnglishArticle(result.extract);
            } else {
              setEnglishArticle(undefined);
            }
          } else {
            setEnglishArticle(undefined);
          }
        } catch (err) {
          setEnglishArticle(undefined);
        }
      };
      wikiCall();
      getEnglishWikiArticle();
    }
  }, [setWikiPicture, myMountain]);

  return (
    <div className='Mountain'>
      {!myMountain ? (
        <div>Oops! It looks like that page doesn't exist.</div>
      ) : (
        <div>
          <h1>{myMountain.names.romaji}</h1>
          {wikiPicture && <img src={wikiPicture} alt='🏔'></img>}
          {englishArticle && <p>{englishArticle}</p>}
        </div>
      )}
      <Map3D myMountain={myMountain} />
    </div>
  );
};

export default Mountain;
