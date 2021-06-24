import mountainJSON from './mountain-data.json';
import { Mountain } from './MountainDataInterface';

export type MountainType = Mountain[];

const mountainData: MountainType = mountainJSON;
export const getAllMountains = () => {
  return mountainData;
};
