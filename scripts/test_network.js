const fs = require('fs');
const path = require('path');
const Graph = require('graphology');
const { degree, pagerank, betweenness, closeness } = require('graphology-metrics/centrality');
const { density } = require('graphology-metrics/graph/density');
const { connectedComponents } = require('graphology-components');

const csvPath = path.join(__dirname, '..', 'Most Streamed Spotify Songs 2024.csv');
const rawData = fs.readFileSync(csvPath, 'utf8');

function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let field = '';

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push(field);
      field = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      row.push(field);
      field = '';
      if (row.some(f => f.trim().length > 0)) lines.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field || row.length > 0) {
    row.push(field);
    if (row.some(f => f.trim().length > 0)) lines.push(row);
  }
  return lines;
}

const parsed = parseCSV(rawData);
const headers = parsed[0].map(h => h.trim());
console.log('Parsed rows:', parsed.length - 1);

function parseNum(val) {
  if (!val) return 0;
  const clean = val.replace(/,/g, '').trim();
  const n = Number(clean);
  return isNaN(n) ? 0 : n;
}

const songs = [];
const artistMap = {};
const platforms = [
  'Spotify', 'YouTube', 'TikTok', 'Apple Music', 'AirPlay',
  'SiriusXM', 'Deezer', 'Amazon Music', 'Pandora', 'SoundCloud',
  'Shazam', 'TIDAL'
];

parsed.slice(1).forEach((r, idx) => {
  const obj = {};
  headers.forEach((h, i) => {
    obj[h] = r[i] ? r[i].trim() : '';
  });

  const track = obj['Track'] || 'Unknown Track';
  const artist = obj['Artist'] || 'Unknown Artist';
  const album = obj['Album Name'] || '';
  const releaseDate = obj['Release Date'] || '';
  const dateParts = releaseDate.split('/');
  const releaseYear = dateParts.length === 3 ? parseInt(dateParts[2], 10) : 0;
  
  const spotifyStreams = parseNum(obj['Spotify Streams']);
  const spotifyPopularity = parseNum(obj['Spotify Popularity']);
  const trackScore = parseFloat(obj['Track Score']) || 0;
  const allTimeRank = parseInt(obj['All Time Rank'], 10) || (idx + 1);
  const explicit = obj['Explicit Track'] === '1' || obj['Explicit Track'] === 'true';

  const youtubeViews = parseNum(obj['YouTube Views']);
  const youtubeLikes = parseNum(obj['YouTube Likes']);
  const tiktokViews = parseNum(obj['TikTok Views']);
  const tiktokLikes = parseNum(obj['TikTok Likes']);
  const tiktokPosts = parseNum(obj['TikTok Posts']);
  const appleMusicPlaylistCount = parseNum(obj['Apple Music Playlist Count']);
  const airplaySpins = parseNum(obj['AirPlay Spins']);
  const siriusxmSpins = parseNum(obj['SiriusXM Spins']);
  const deezerPlaylistCount = parseNum(obj['Deezer Playlist Count']);
  const amazonPlaylistCount = parseNum(obj['Amazon Playlist Count']);
  const pandoraStreams = parseNum(obj['Pandora Streams']);
  const soundcloudStreams = parseNum(obj['Soundcloud Streams']);
  const shazamCounts = parseNum(obj['Shazam Counts']);
  const tidalPopularity = parseNum(obj['TIDAL Popularity']);

  // Platform presence rules
  const activePlatforms = [];
  if (spotifyStreams > 0 || spotifyPopularity > 0) activePlatforms.push('Spotify');
  if (youtubeViews > 0 || youtubeLikes > 0) activePlatforms.push('YouTube');
  if (tiktokViews > 0 || tiktokPosts > 0 || tiktokLikes > 0) activePlatforms.push('TikTok');
  if (appleMusicPlaylistCount > 0) activePlatforms.push('Apple Music');
  if (airplaySpins > 0) activePlatforms.push('AirPlay');
  if (siriusxmSpins > 0) activePlatforms.push('SiriusXM');
  if (deezerPlaylistCount > 0) activePlatforms.push('Deezer');
  if (amazonPlaylistCount > 0) activePlatforms.push('Amazon Music');
  if (pandoraStreams > 0) activePlatforms.push('Pandora');
  if (soundcloudStreams > 0) activePlatforms.push('SoundCloud');
  if (shazamCounts > 0) activePlatforms.push('Shazam');
  if (tidalPopularity > 0) activePlatforms.push('TIDAL');

  const songObj = {
    id: `song_${idx + 1}`,
    index: idx + 1,
    rank: allTimeRank,
    track,
    artist,
    album,
    releaseDate,
    releaseYear,
    isrc: obj['ISRC'],
    trackScore,
    spotifyStreams,
    spotifyPopularity,
    spotifyPlaylistCount: parseNum(obj['Spotify Playlist Count']),
    spotifyPlaylistReach: parseNum(obj['Spotify Playlist Reach']),
    youtubeViews,
    youtubeLikes,
    youtubePlaylistReach: parseNum(obj['YouTube Playlist Reach']),
    tiktokPosts,
    tiktokLikes,
    tiktokViews,
    appleMusicPlaylistCount,
    airplaySpins,
    siriusxmSpins,
    deezerPlaylistCount,
    deezerPlaylistReach: parseNum(obj['Deezer Playlist Reach']),
    amazonPlaylistCount,
    pandoraStreams,
    pandoraTrackStations: parseNum(obj['Pandora Track Stations']),
    soundcloudStreams,
    shazamCounts,
    tidalPopularity,
    explicit,
    activePlatforms,
    platformCount: activePlatforms.length
  };

  songs.push(songObj);

  if (!artistMap[artist]) {
    artistMap[artist] = {
      name: artist,
      songs: [],
      totalSpotifyStreams: 0,
      totalYouTubeViews: 0,
      totalTikTokViews: 0,
      popularityScores: [],
      trackScores: [],
      platforms: new Set()
    };
  }
  const a = artistMap[artist];
  a.songs.push(songObj);
  a.totalSpotifyStreams += spotifyStreams;
  a.totalYouTubeViews += youtubeViews;
  a.totalTikTokViews += tiktokViews;
  if (spotifyPopularity > 0) a.popularityScores.push(spotifyPopularity);
  if (trackScore > 0) a.trackScores.push(trackScore);
  activePlatforms.forEach(p => a.platforms.add(p));
});

console.log('Songs loaded:', songs.length);
console.log('Artists loaded:', Object.keys(artistMap).length);

// Build graph for Top 200 songs to test speed of SNA metrics
const topSongs = songs.slice(0, 200);
const g = new Graph({ type: 'undirected' });

// Add platforms
platforms.forEach(p => {
  g.addNode(`platform_${p}`, { type: 'platform', name: p });
});

topSongs.forEach(s => {
  const songNodeId = s.id;
  if (!g.hasNode(songNodeId)) {
    g.addNode(songNodeId, { type: 'song', name: s.track, artist: s.artist, rank: s.rank });
  }

  const artistNodeId = `artist_${s.artist.replace(/\s+/g, '_')}`;
  if (!g.hasNode(artistNodeId)) {
    g.addNode(artistNodeId, { type: 'artist', name: s.artist });
  }

  // Edge Artist -> Song
  if (!g.hasEdge(artistNodeId, songNodeId)) {
    g.addEdge(artistNodeId, songNodeId, { type: 'authored' });
  }

  // Edge Song -> Platform
  s.activePlatforms.forEach(p => {
    const platformNodeId = `platform_${p}`;
    if (!g.hasEdge(songNodeId, platformNodeId)) {
      g.addEdge(songNodeId, platformNodeId, { type: 'distributed_on' });
    }
  });
});

console.log(`Test Graph: Nodes = ${g.order}, Edges = ${g.size}`);
const t0 = Date.now();
const deg = degree(g);
const pr = pagerank(g);
const bw = betweenness(g);
const cl = closeness(g);
console.log(`Centrality calculated in ${Date.now() - t0}ms`);
console.log('Density:', density(g));
console.log('Components:', connectedComponents(g).length);

// Print Top 5 degree nodes
const sortedByDeg = Object.entries(deg).sort((a,b) => b[1] - a[1]).slice(0, 10);
console.log('Top 10 nodes by Degree Centrality:');
sortedByDeg.forEach(([id, val]) => {
  const attrs = g.getNodeAttributes(id);
  console.log(` - ${attrs.name} (${attrs.type}): degree = ${val}`);
});

// Print Top 5 betweenness nodes
const sortedByBw = Object.entries(bw).sort((a,b) => b[1] - a[1]).slice(0, 10);
console.log('Top 10 nodes by Betweenness Centrality (Bridges):');
sortedByBw.forEach(([id, val]) => {
  const attrs = g.getNodeAttributes(id);
  console.log(` - ${attrs.name} (${attrs.type}): betweenness = ${val.toFixed(5)}`);
});
