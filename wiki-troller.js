const fetch = require('node-fetch');
const { URL } = require('url');
const fs = require('fs');
const database = require('./TEST.json');

const getRebuiltName = (s) => {
  if (s.match(/san$/)) {
    return s.substring(0, s.length - 3);
  } else if (s.match(/yama$/) || s.match(/dake$/)) {
    return s.substring(0, s.length - 4);
  }
  return s;
};

const parseResponseData = (data) => {
  if (data?.query?.pages) {
    const response = data.query.pages;
    const keys = Object.keys(response);
    if (response[keys[0]]) {
      return response[keys[0]];
    }
  }
};

const fetchDescription = async (mountainName) => {
  try {
    const res = await fetch(
      new URL(
        `https://ja.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=pageimages&piprop=thumbnail&pithumbsize=600&titles=${mountainName}`
      )
    );
    const data = await res.json();
    const result = parseResponseData(data);
    if (result?.thumbnail?.source) {
      return result.thumbnail.source;
    }
  } catch (err) {
    console.log(err);
    return err;
  }
  return '';
};

const getDescriptions = async () => {
  const urls = [];
  for (let i = 0; i < database.length; i++) {
    const res = await fetchDescription(database[i].names.kanji);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 600);
    });
    console.log(i, res);
    urls.push(res);
  }
  return urls;
};

const saveDescriptions = async () => {
  const urls = await getDescriptions();
  fs.writeFile('image-urls.json', JSON.stringify(urls), (err) => {
    if (err) return console.log(err);
    console.log('All finished!✨');
  });
};

saveDescriptions();
