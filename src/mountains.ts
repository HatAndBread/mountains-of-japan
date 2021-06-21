import mountainJSON from './mountain-data.json';
import { Mountain } from './MountainDataInterface';

export type MountainType = Mountain[];

const mountainData: MountainType = mountainJSON;
export const getAllMountains = () => {
  return mountainData;
};

export const findMountainByPrefecture = (prefectureName: string) => {
  const kana = mountainData.find(
    (mountain) => mountain.names.kana === prefectureName
  );
  if (kana) return kana;
  const romaji = mountainData.find(
    (mountain) => mountain.names.romaji === prefectureName
  );
  if (romaji) return romaji;
  const kanji = mountainData.find(
    (mountain) => mountain.names.kanji === prefectureName
  );
  if (kanji) return kanji;
  const altKana = mountainData.find(
    (mountain) => mountain.names.alternativeKana === prefectureName
  );
  if (altKana) return altKana;
  const altKanji = mountainData.find(
    (mountain) => mountain.names.alternativeKanji === prefectureName
  );
  if (altKanji) return altKanji;
  const altRomaji = mountainData.find(
    (mountain) => mountain.names.alternativeRomaji === prefectureName
  );
  if (altRomaji) return altRomaji;
};
