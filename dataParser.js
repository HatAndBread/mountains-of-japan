const fs = require('fs');
const wanakana = require('wanakana');
const getPrefecture = require('./getPrefecture');

const getLines = (path) => fs.readFileSync(path).toString().split('\n');
const coords = getLines('./coords.txt').map((el) => {
  const split = el.split(/\s/);
  const latAndLng = split.filter((item) => item !== '');
  const newEntry = { latitude: null, longitude: null };
  latAndLng.forEach((item, index) => {
    const degrees = parseInt(item.match(/^\d+/)[0]);
    const minutes = parseInt(item.match(/\d+(?=′)/)[0]) / 60;
    const seconds = parseInt(item.match(/\d+(?=″)/)[0]) / 3600;
    const result = degrees + minutes + seconds;
    index ? (newEntry.longitude = result) : (newEntry.latitude = result);
  });
  return newEntry;
});

const elevations = getLines('./elevation.txt').map((el) =>
  parseInt(el.match(/\d+(?=m)/)[0])
);
const replaceStupidChars = (string) => {
  return string
    .replace('）', '')
    .replace('（', '')
    .replace('[', '')
    .replace(']', '')
    .replace(')', '')
    .replace('(', '');
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const mountainNames = getLines('./mountainNames.txt').map((el) => {
  const split = el
    .split(/\s/)
    .filter((i) => i !== '')
    .filter((i) => !i.includes('3D表示'));
  const newEntry = {
    kana: null,
    alternativeKana: null,
    romaji: null,
    alternativeRomaji: null,
    kanji: null,
    alternativeKanji: null,
  };
  if (split.length > 2) split.pop();
  split.forEach((i, index) => {
    const a = i.split('（');
    if (index) {
      newEntry.kanji = replaceStupidChars(a[0]);
      if (a[1]) newEntry.alternativeKanji = replaceStupidChars(a[1]);
    } else {
      newEntry.kana = replaceStupidChars(a[0]);
      if (a[1]) {
        newEntry.alternativeKana = replaceStupidChars(a[1]);
        newEntry.alternativeRomaji = capitalize(
          replaceStupidChars(wanakana.toRomaji(a[1]))
        );
      }
      newEntry.romaji = capitalize(replaceStupidChars(wanakana.toRomaji(a[0])));
    }
  });
  return newEntry;
});

const prefectures = getLines('./prefectureNames.txt').map((el) => {
  const newEntry = {
    prefecturesJapanese: el.split(/\s/),
    prefecturesEnglish: [],
  };
  newEntry.prefecturesJapanese.forEach((prefecture) => {
    newEntry.prefecturesEnglish.push(capitalize(getPrefecture(prefecture)));
  });
  return newEntry;
});

const apiData = [];

for (let i = 0; i < mountainNames.length; i++) {
  apiData.push({
    names: mountainNames[i],
    prefectures: prefectures[i],
    elevation: elevations[i],
    coords: coords[i],
  });
}

fs.writeFile('API.json', JSON.stringify(apiData), function (err) {
  if (err) return console.log(err);
  console.log('Success ✨');
});
