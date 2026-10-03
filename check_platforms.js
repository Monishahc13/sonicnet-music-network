const fs = require('fs');
const path = require('path');
const analyze = require('./analyze_data.js'); // wait, analyze_data.js runs directly

const csvPath = path.join(__dirname, 'Most Streamed Spotify Songs 2024.csv');
const rawData = fs.readFileSync(csvPath, 'utf8');

function parseNumber(str) {
  if (!str) return 0;
  const clean = str.replace(/,/g, '').trim();
  const n = Number(clean);
  return isNaN(n) ? 0 : n;
}

// Check platform metrics coverage
const lines = rawData.split(/\r?\n/).filter(l => l.trim().length > 0);
// Let's do a fast regex parse
const platformMetrics = {
  'Spotify': ['Spotify Streams', 'Spotify Playlist Count', 'Spotify Playlist Reach', 'Spotify Popularity'],
  'YouTube': ['YouTube Views', 'YouTube Likes', 'YouTube Playlist Reach'],
  'TikTok': ['TikTok Posts', 'TikTok Likes', 'TikTok Views'],
  'Apple Music': ['Apple Music Playlist Count'],
  'AirPlay': ['AirPlay Spins'],
  'SiriusXM': ['SiriusXM Spins'],
  'Deezer': ['Deezer Playlist Count', 'Deezer Playlist Reach'],
  'Amazon Music': ['Amazon Playlist Count'],
  'Pandora': ['Pandora Streams', 'Pandora Track Stations'],
  'SoundCloud': ['Soundcloud Streams'],
  'Shazam': ['Shazam Counts'],
  'TIDAL': ['TIDAL Popularity']
};

console.log('Platforms defined:', Object.keys(platformMetrics));
