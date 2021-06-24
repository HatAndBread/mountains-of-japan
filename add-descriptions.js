const fs = require('fs');
const db = require('./src/mountain-data.json');

const newApiData = db.map((mountain) => {
  if (mountain.description === '') {
    mountain.description = `${mountain.names.romaji} (${
      mountain.names.kanji
    }), is a ${mountain.elevation.toLocaleString()}m tall mountain located ${
      mountain.prefectures.prefecturesEnglish.length > 1
        ? `on the border of ${mountain.prefectures.prefecturesEnglish.map(
            (p, i) =>
              `${p}${
                i < mountain.prefectures.prefecturesEnglish.length - 1
                  ? ' and '
                  : ''
              }`
          )} prefectures.`.replace(',', '')
        : `in ${
            mountain.prefectures.prefecturesEnglish[0]
          } prefecture. Its peak is located at ${mountain.coords.latitude.toFixed(
            3
          )}° north and ${mountain.coords.longitude.toFixed(3)}° east. ${
            mountain.names.alternativeRomaji && mountain.names.alternativeKanji
              ? `${mountain.names.romaji} is also sometimes known as ${mountain.names.alternativeRomaji} (${mountain.names.alternativeKanji}).`
              : ''
          }`
    }`;
  }
  return mountain;
});

fs.writeFile('TEST.json', JSON.stringify(newApiData), function (err) {
  if (err) return console.log(err);
  console.log('Success ✨');
});
