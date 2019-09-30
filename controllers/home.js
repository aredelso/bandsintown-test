const fetch = require('node-fetch');
const moment = require('moment');
const artistUrl = 'https://rest.bandsintown.com/artists';
const appId = 'test';

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
};


/**
 * GET /
 * Home page.
 */
exports.index = asyncMiddleware(async (req, res) => {
  // Access the provided 'artist' query parameter
  let artistName = req.query.artist;
  let artist

  if (artistName) {
    artistName = artistName.replace(/_/g, " ");
    console.log('Fetching artist info...');

    artist = await getArtist(artistName)

    if (artist.upcoming_event_count) {
      console.log('Fetching artist events...');

      artist.events = await fetch(`${artistUrl}/${encodeURIComponent(artistName)}/events?app_id=${appId}`)
        .then(res => res.json());
    }
  }

  console.log(JSON.stringify(artist))

  res.render('home', {
	moment,
	artist
  });
});

const getArtist = artistName => fetch(`${artistUrl}/${encodeURIComponent(artistName)}?app_id=${appId}`)
	.then(res => res.json());

const getArtistEvents = artistName => fetch(`${artistUrl}/${encodeURIComponent(artistName)}/events?app_id=${appId}`)
	.then(res => res.json());