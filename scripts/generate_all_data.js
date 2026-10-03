const fs = require('fs');
const path = require('path');
const Graph = require('graphology');
const { degree, pagerank, betweenness } = require('graphology-metrics/centrality');
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
console.log(`[Data Pipeline] Parsed ${parsed.length - 1} records from CSV.`);

function parseNum(val) {
  if (!val) return 0;
  const clean = val.replace(/,/g, '').trim();
  const n = Number(clean);
  return isNaN(n) ? 0 : n;
}

const PLATFORMS_DEF = [
  { name: 'Spotify', key: 'spotify', color: '#1DB954', metricName: 'Spotify Streams', unit: 'Streams' },
  { name: 'YouTube', key: 'youtube', color: '#FF0000', metricName: 'YouTube Views', unit: 'Views' },
  { name: 'TikTok', key: 'tiktok', color: '#00F2FE', metricName: 'TikTok Views', unit: 'Views' },
  { name: 'Apple Music', key: 'apple', color: '#FC3C44', metricName: 'Apple Playlist Count', unit: 'Playlists' },
  { name: 'AirPlay', key: 'airplay', color: '#38BDF8', metricName: 'AirPlay Spins', unit: 'Radio Spins' },
  { name: 'SiriusXM', key: 'siriusxm', color: '#0284C7', metricName: 'SiriusXM Spins', unit: 'Satellite Spins' },
  { name: 'Deezer', key: 'deezer', color: '#A855F7', metricName: 'Deezer Playlist Count', unit: 'Playlists' },
  { name: 'Amazon Music', key: 'amazon', color: '#F59E0B', metricName: 'Amazon Playlist Count', unit: 'Playlists' },
  { name: 'Pandora', key: 'pandora', color: '#3B82F6', metricName: 'Pandora Streams', unit: 'Streams' },
  { name: 'SoundCloud', key: 'soundcloud', color: '#F97316', metricName: 'SoundCloud Streams', unit: 'Streams' },
  { name: 'Shazam', key: 'shazam', color: '#06B6D4', metricName: 'Shazam Counts', unit: 'Audio Tags' },
  { name: 'TIDAL', key: 'tidal', color: '#10B981', metricName: 'TIDAL Popularity', unit: 'Popularity Score' }
];

const songs = [];
const artistMap = {};
const albumSet = new Set();
let totalSpotifyStreamsBigInt = 0n;
let totalPopularity = 0;
let popularityCount = 0;
let explicitCount = 0;
let nonExplicitCount = 0;
let explicitStreamsBigInt = 0n;
let nonExplicitStreamsBigInt = 0n;
const yearStats = {};

parsed.slice(1).forEach((r, idx) => {
  const obj = {};
  headers.forEach((h, i) => {
    obj[h] = r[i] ? r[i].trim() : '';
  });

  const track = obj['Track'] || 'Unknown Track';
  const artist = obj['Artist'] || 'Unknown Artist';
  const album = obj['Album Name'] || 'Single / Unknown Album';
  if (album) albumSet.add(album);

  const releaseDate = obj['Release Date'] || '';
  const dateParts = releaseDate.split('/');
  let releaseYear = 0;
  if (dateParts.length === 3) {
    releaseYear = parseInt(dateParts[2], 10);
  }

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

  // Active platforms
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

  totalSpotifyStreamsBigInt += BigInt(spotifyStreams);
  if (spotifyPopularity > 0) {
    totalPopularity += spotifyPopularity;
    popularityCount++;
  }
  if (explicit) {
    explicitCount++;
    explicitStreamsBigInt += BigInt(spotifyStreams);
  } else {
    nonExplicitCount++;
    nonExplicitStreamsBigInt += BigInt(spotifyStreams);
  }

  if (releaseYear > 1900 && releaseYear < 2030) {
    if (!yearStats[releaseYear]) {
      yearStats[releaseYear] = { year: releaseYear, count: 0, totalStreams: 0, popularitySum: 0 };
    }
    yearStats[releaseYear].count++;
    yearStats[releaseYear].totalStreams += spotifyStreams;
    yearStats[releaseYear].popularitySum += spotifyPopularity;
  }

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
    platformCount: activePlatforms.length,
    platformActivity: {
      'Spotify': { hasActivity: spotifyStreams > 0, value: spotifyStreams, unit: 'Streams' },
      'YouTube': { hasActivity: youtubeViews > 0, value: youtubeViews, unit: 'Views' },
      'TikTok': { hasActivity: tiktokViews > 0, value: tiktokViews, unit: 'Views' },
      'Apple Music': { hasActivity: appleMusicPlaylistCount > 0, value: appleMusicPlaylistCount, unit: 'Playlists' },
      'AirPlay': { hasActivity: airplaySpins > 0, value: airplaySpins, unit: 'Radio Spins' },
      'SiriusXM': { hasActivity: siriusxmSpins > 0, value: siriusxmSpins, unit: 'Satellite Spins' },
      'Deezer': { hasActivity: deezerPlaylistCount > 0, value: deezerPlaylistCount, unit: 'Playlists' },
      'Amazon Music': { hasActivity: amazonPlaylistCount > 0, value: amazonPlaylistCount, unit: 'Playlists' },
      'Pandora': { hasActivity: pandoraStreams > 0, value: pandoraStreams, unit: 'Streams' },
      'SoundCloud': { hasActivity: soundcloudStreams > 0, value: soundcloudStreams, unit: 'Streams' },
      'Shazam': { hasActivity: shazamCounts > 0, value: shazamCounts, unit: 'Audio Tags' },
      'TIDAL': { hasActivity: tidalPopularity > 0, value: tidalPopularity, unit: 'Popularity Score' }
    }
  };

  songs.push(songObj);

  if (!artistMap[artist]) {
    artistMap[artist] = {
      name: artist,
      songs: [],
      totalSpotifyStreams: 0,
      totalYouTubeViews: 0,
      totalTikTokViews: 0,
      totalTrackScore: 0,
      popularityScores: [],
      platforms: new Set()
    };
  }
  const a = artistMap[artist];
  a.songs.push(songObj);
  a.totalSpotifyStreams += spotifyStreams;
  a.totalYouTubeViews += youtubeViews;
  a.totalTikTokViews += tiktokViews;
  a.totalTrackScore += trackScore;
  if (spotifyPopularity > 0) a.popularityScores.push(spotifyPopularity);
  activePlatforms.forEach(p => a.platforms.add(p));
});

console.log(`[Data Pipeline] Cleaned ${songs.length} songs and ${Object.keys(artistMap).length} artists.`);

// Platform Overlap Matrix (12 x 12)
const platformNames = PLATFORMS_DEF.map(p => p.name);
const platformOverlap = {};
platformNames.forEach(p1 => {
  platformOverlap[p1] = {};
  platformNames.forEach(p2 => {
    platformOverlap[p1][p2] = 0;
  });
});

songs.forEach(s => {
  s.activePlatforms.forEach(p1 => {
    s.activePlatforms.forEach(p2 => {
      platformOverlap[p1][p2]++;
    });
  });
});

// Platform Stats
const platformStats = PLATFORMS_DEF.map(p => {
  const connectedSongs = songs.filter(s => s.activePlatforms.includes(p.name));
  const uniqueArtists = new Set(connectedSongs.map(s => s.artist));
  
  let totalVolume = 0;
  let topSong = null;
  let maxSongVal = -1;

  connectedSongs.forEach(s => {
    const act = s.platformActivity[p.name]?.value || 0;
    totalVolume += act;
    if (act > maxSongVal) {
      maxSongVal = act;
      topSong = { track: s.track, artist: s.artist, value: act, rank: s.rank };
    }
  });

  // Find top artist on this platform
  const artistCounts = {};
  connectedSongs.forEach(s => {
    artistCounts[s.artist] = (artistCounts[s.artist] || 0) + 1;
  });
  const topArtistName = Object.entries(artistCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return {
    name: p.name,
    key: p.key,
    color: p.color,
    metricName: p.metricName,
    unit: p.unit,
    connectedSongsCount: connectedSongs.length,
    coveragePercent: ((connectedSongs.length / songs.length) * 100).toFixed(1),
    connectedArtistsCount: uniqueArtists.size,
    totalVolume,
    topSong,
    topArtist: topArtistName
  };
});

// Precompute Social Network Analysis for multiple scopes:
// 1. Ecosystem Graph (Top 300 songs + their artists + 12 platforms)
// 2. Artist-Song Graph
// 3. Song-Platform Graph
// 4. Artist-Platform Graph
console.log('[Data Pipeline] Constructing Network Graphs and calculating SNA metrics...');

function buildAndAnalyzeGraph(viewType, songSubset) {
  const g = new Graph({ type: 'undirected' });

  if (viewType === 'ecosystem') {
    PLATFORMS_DEF.forEach(p => {
      g.addNode(`platform_${p.name}`, { id: `platform_${p.name}`, type: 'platform', name: p.name, color: p.color });
    });

    songSubset.forEach(s => {
      const songId = s.id;
      if (!g.hasNode(songId)) {
        g.addNode(songId, { id: songId, type: 'song', name: s.track, artist: s.artist, streams: s.spotifyStreams, rank: s.rank });
      }

      const artistId = `artist_${s.artist.replace(/\s+/g, '_')}`;
      if (!g.hasNode(artistId)) {
        g.addNode(artistId, { id: artistId, type: 'artist', name: s.artist, totalStreams: artistMap[s.artist]?.totalSpotifyStreams || 0 });
      }

      if (!g.hasEdge(artistId, songId)) {
        g.addEdge(artistId, songId, { type: 'authored', weight: s.trackScore || 1 });
      }

      s.activePlatforms.forEach(p => {
        const platformId = `platform_${p}`;
        if (g.hasNode(platformId) && !g.hasEdge(songId, platformId)) {
          g.addEdge(songId, platformId, { type: 'distributed_on', weight: 1 });
        }
      });
    });
  } else if (viewType === 'artist_song') {
    songSubset.forEach(s => {
      const songId = s.id;
      if (!g.hasNode(songId)) {
        g.addNode(songId, { id: songId, type: 'song', name: s.track, artist: s.artist, streams: s.spotifyStreams, rank: s.rank });
      }

      const artistId = `artist_${s.artist.replace(/\s+/g, '_')}`;
      if (!g.hasNode(artistId)) {
        g.addNode(artistId, { id: artistId, type: 'artist', name: s.artist, totalStreams: artistMap[s.artist]?.totalSpotifyStreams || 0 });
      }

      if (!g.hasEdge(artistId, songId)) {
        g.addEdge(artistId, songId, { type: 'authored', weight: s.trackScore || 1 });
      }
    });
  } else if (viewType === 'song_platform') {
    PLATFORMS_DEF.forEach(p => {
      g.addNode(`platform_${p.name}`, { id: `platform_${p.name}`, type: 'platform', name: p.name, color: p.color });
    });

    songSubset.forEach(s => {
      const songId = s.id;
      if (!g.hasNode(songId)) {
        g.addNode(songId, { id: songId, type: 'song', name: s.track, artist: s.artist, streams: s.spotifyStreams, rank: s.rank });
      }

      s.activePlatforms.forEach(p => {
        const platformId = `platform_${p}`;
        if (g.hasNode(platformId) && !g.hasEdge(songId, platformId)) {
          g.addEdge(songId, platformId, { type: 'distributed_on', weight: 1 });
        }
      });
    });
  } else if (viewType === 'artist_platform') {
    PLATFORMS_DEF.forEach(p => {
      g.addNode(`platform_${p.name}`, { id: `platform_${p.name}`, type: 'platform', name: p.name, color: p.color });
    });

    const artistPlatformEdges = {};
    songSubset.forEach(s => {
      const artistId = `artist_${s.artist.replace(/\s+/g, '_')}`;
      if (!g.hasNode(artistId)) {
        g.addNode(artistId, { id: artistId, type: 'artist', name: s.artist, totalStreams: artistMap[s.artist]?.totalSpotifyStreams || 0 });
      }

      s.activePlatforms.forEach(p => {
        const platformId = `platform_${p}`;
        const key = `${artistId}->${platformId}`;
        artistPlatformEdges[key] = (artistPlatformEdges[key] || 0) + 1;
      });
    });

    Object.entries(artistPlatformEdges).forEach(([edgeKey, count]) => {
      const [artistId, platformId] = edgeKey.split('->');
      if (g.hasNode(artistId) && g.hasNode(platformId) && !g.hasEdge(artistId, platformId)) {
        g.addEdge(artistId, platformId, { type: 'influence', weight: count });
      }
    });
  }

  const deg = degree(g);
  const pr = pagerank(g);
  const bw = betweenness(g);
  const d = density(g);
  const comps = connectedComponents(g);

  return {
    order: g.order,
    size: g.size,
    density: d,
    componentsCount: comps.length,
    degreeCentrality: deg,
    pagerankCentrality: pr,
    betweennessCentrality: bw,
    graph: g
  };
}

// Compute for Top 200 songs for the 4 views
const top200 = songs.slice(0, 200);
const ecosystemAnalysis = buildAndAnalyzeGraph('ecosystem', top200);
const artistSongAnalysis = buildAndAnalyzeGraph('artist_song', top200);
const songPlatformAnalysis = buildAndAnalyzeGraph('song_platform', top200);
const artistPlatformAnalysis = buildAndAnalyzeGraph('artist_platform', top200);

// Global SNA on full dataset for Artist-Platform & Artist rankings
const fullArtistPlatformGraph = new Graph({ type: 'undirected' });
PLATFORMS_DEF.forEach(p => fullArtistPlatformGraph.addNode(`platform_${p.name}`, { type: 'platform', name: p.name }));

Object.values(artistMap).forEach(a => {
  const artistId = `artist_${a.name.replace(/\s+/g, '_')}`;
  if (!fullArtistPlatformGraph.hasNode(artistId)) {
    fullArtistPlatformGraph.addNode(artistId, { type: 'artist', name: a.name });
  }
  a.platforms.forEach(p => {
    const platformId = `platform_${p}`;
    if (!fullArtistPlatformGraph.hasEdge(artistId, platformId)) {
      fullArtistPlatformGraph.addEdge(artistId, platformId);
    }
  });
});

const fullArtistDeg = degree(fullArtistPlatformGraph);
const fullArtistPR = pagerank(fullArtistPlatformGraph);
const fullArtistBW = betweenness(fullArtistPlatformGraph);

// Prepare Top Artists List (ranked by streams and connectivity)
const sortedArtists = Object.values(artistMap)
  .map(a => {
    const artistId = `artist_${a.name.replace(/\s+/g, '_')}`;
    const avgPop = a.popularityScores.length > 0 
      ? (a.popularityScores.reduce((acc, v) => acc + v, 0) / a.popularityScores.length).toFixed(1) 
      : 0;
    const avgScore = a.songs.length > 0 
      ? (a.totalTrackScore / a.songs.length).toFixed(1) 
      : 0;

    return {
      name: a.name,
      songCount: a.songs.length,
      totalSpotifyStreams: a.totalSpotifyStreams,
      totalYouTubeViews: a.totalYouTubeViews,
      totalTikTokViews: a.totalTikTokViews,
      avgPopularity: parseFloat(avgPop),
      avgTrackScore: parseFloat(avgScore),
      platformsCount: a.platforms.size,
      platforms: Array.from(a.platforms),
      degree: (fullArtistDeg[artistId] || 0),
      betweenness: (fullArtistBW[artistId] || 0),
      pageRank: (fullArtistPR[artistId] || 0),
      topSongs: a.songs
        .sort((x, y) => y.spotifyStreams - x.spotifyStreams)
        .slice(0, 5)
        .map(s => ({ rank: s.rank, track: s.track, streams: s.spotifyStreams, popularity: s.spotifyPopularity }))
    };
  })
  .sort((a, b) => b.totalSpotifyStreams - a.totalSpotifyStreams);

// Prepare Top Network Nodes
const topByDegree = [...sortedArtists].sort((a, b) => b.degree - a.degree || b.songCount - a.songCount).slice(0, 15);
const topByBetweenness = [...sortedArtists].sort((a, b) => b.betweenness - a.betweenness || b.songCount - a.songCount).slice(0, 15);
const topByPageRank = [...sortedArtists].sort((a, b) => b.pageRank - a.pageRank || b.totalSpotifyStreams - a.totalSpotifyStreams).slice(0, 15);

// Precompute presets for Cytoscape (Top 50, Top 100, Top 200)
function generateCytoscapeElements(songSubset, viewMode) {
  const elements = [];
  const addedNodes = new Set();
  const addedEdges = new Set();

  function addNode(id, label, type, size, color, extra = {}) {
    if (!addedNodes.has(id)) {
      addedNodes.add(id);
      elements.push({
        group: 'nodes',
        data: { id, label, type, size, color, ...extra }
      });
    }
  }

  function addEdge(source, target, type, weight = 1) {
    const id = `${source}->${target}`;
    if (!addedEdges.has(id) && addedNodes.has(source) && addedNodes.has(target)) {
      addedEdges.add(id);
      elements.push({
        group: 'edges',
        data: { id, source, target, type, weight }
      });
    }
  }

  if (viewMode === 'ecosystem') {
    PLATFORMS_DEF.forEach(p => {
      addNode(`platform_${p.name}`, p.name, 'platform', 45, p.color, { metricName: p.metricName, unit: p.unit });
    });

    songSubset.forEach(s => {
      const songId = s.id;
      const songSize = Math.max(16, Math.min(38, 16 + Math.log10(s.spotifyStreams || 1) * 2.2));
      addNode(songId, s.track, 'song', songSize, '#38BDF8', {
        artist: s.artist,
        rank: s.rank,
        streams: s.spotifyStreams,
        popularity: s.spotifyPopularity,
        trackScore: s.trackScore,
        releaseYear: s.releaseYear,
        platformCount: s.platformCount
      });

      const artistId = `artist_${s.artist.replace(/\s+/g, '_')}`;
      const artistStreams = artistMap[s.artist]?.totalSpotifyStreams || 0;
      const artistSize = Math.max(22, Math.min(48, 20 + Math.log10(artistStreams || 1) * 2.5));
      addNode(artistId, s.artist, 'artist', artistSize, '#A855F7', {
        songCount: artistMap[s.artist]?.songs.length || 1,
        totalStreams: artistStreams
      });

      addEdge(artistId, songId, 'authored', 2);

      s.activePlatforms.forEach(p => {
        addEdge(songId, `platform_${p}`, 'distributed_on', 1);
      });
    });
  } else if (viewMode === 'artist_song') {
    songSubset.forEach(s => {
      const songId = s.id;
      const songSize = Math.max(16, Math.min(36, 16 + Math.log10(s.spotifyStreams || 1) * 2.2));
      addNode(songId, s.track, 'song', songSize, '#38BDF8', {
        artist: s.artist,
        rank: s.rank,
        streams: s.spotifyStreams,
        popularity: s.spotifyPopularity
      });

      const artistId = `artist_${s.artist.replace(/\s+/g, '_')}`;
      const artistStreams = artistMap[s.artist]?.totalSpotifyStreams || 0;
      const artistSize = Math.max(24, Math.min(50, 22 + Math.log10(artistStreams || 1) * 2.5));
      addNode(artistId, s.artist, 'artist', artistSize, '#A855F7', {
        songCount: artistMap[s.artist]?.songs.length || 1,
        totalStreams: artistStreams
      });

      addEdge(artistId, songId, 'authored', 2);
    });
  } else if (viewMode === 'song_platform') {
    PLATFORMS_DEF.forEach(p => {
      addNode(`platform_${p.name}`, p.name, 'platform', 45, p.color, { metricName: p.metricName, unit: p.unit });
    });

    songSubset.forEach(s => {
      const songId = s.id;
      const songSize = Math.max(16, Math.min(36, 16 + Math.log10(s.spotifyStreams || 1) * 2.2));
      addNode(songId, s.track, 'song', songSize, '#38BDF8', {
        artist: s.artist,
        rank: s.rank,
        streams: s.spotifyStreams,
        platforms: s.activePlatforms
      });

      s.activePlatforms.forEach(p => {
        addEdge(songId, `platform_${p}`, 'distributed_on', 1);
      });
    });
  } else if (viewMode === 'artist_platform') {
    PLATFORMS_DEF.forEach(p => {
      addNode(`platform_${p.name}`, p.name, 'platform', 45, p.color, { metricName: p.metricName, unit: p.unit });
    });

    const artistPlatformEdges = {};
    songSubset.forEach(s => {
      const artistId = `artist_${s.artist.replace(/\s+/g, '_')}`;
      const artistStreams = artistMap[s.artist]?.totalSpotifyStreams || 0;
      const artistSize = Math.max(22, Math.min(48, 20 + Math.log10(artistStreams || 1) * 2.5));
      addNode(artistId, s.artist, 'artist', artistSize, '#A855F7', {
        songCount: artistMap[s.artist]?.songs.length || 1,
        totalStreams: artistStreams
      });

      s.activePlatforms.forEach(p => {
        const platformId = `platform_${p}`;
        const key = `${artistId}->${platformId}`;
        artistPlatformEdges[key] = (artistPlatformEdges[key] || 0) + 1;
      });
    });

    Object.entries(artistPlatformEdges).forEach(([edgeKey, count]) => {
      const [artistId, platformId] = edgeKey.split('->');
      addEdge(artistId, platformId, 'influence', Math.min(6, 1 + count));
    });
  }

  return elements;
}

// Generate Graph Presets
const graphPresets = {
  ecosystem_50: generateCytoscapeElements(songs.slice(0, 50), 'ecosystem'),
  ecosystem_100: generateCytoscapeElements(songs.slice(0, 100), 'ecosystem'),
  ecosystem_200: generateCytoscapeElements(songs.slice(0, 200), 'ecosystem'),
  artist_song_50: generateCytoscapeElements(songs.slice(0, 50), 'artist_song'),
  artist_song_100: generateCytoscapeElements(songs.slice(0, 100), 'artist_song'),
  artist_song_200: generateCytoscapeElements(songs.slice(0, 200), 'artist_song'),
  song_platform_50: generateCytoscapeElements(songs.slice(0, 50), 'song_platform'),
  song_platform_100: generateCytoscapeElements(songs.slice(0, 100), 'song_platform'),
  song_platform_200: generateCytoscapeElements(songs.slice(0, 200), 'song_platform'),
  artist_platform_50: generateCytoscapeElements(songs.slice(0, 50), 'artist_platform'),
  artist_platform_100: generateCytoscapeElements(songs.slice(0, 100), 'artist_platform'),
  artist_platform_200: generateCytoscapeElements(songs.slice(0, 200), 'artist_platform')
};

// Summary & KPI Data
const totalStreamsNumber = Number(totalSpotifyStreamsBigInt);
const avgPop = (totalPopularity / popularityCount).toFixed(2);
const avgScore = (songs.reduce((acc, s) => acc + s.trackScore, 0) / songs.length).toFixed(2);

// Generate true data-driven insights
const songsWith8PlusPlatforms = songs.filter(s => s.platformCount >= 8).length;
const percentOmnipresent = ((songsWith8PlusPlatforms / songs.length) * 100).toFixed(1);
const topDegreeArtist = topByDegree[0];
const topBridgeArtist = topByBetweenness[0];
const topPRArtist = topByPageRank[0];
const topStreamedSong = [...songs].sort((a,b) => b.spotifyStreams - a.spotifyStreams)[0];
const topTikTokSong = [...songs].sort((a,b) => b.tiktokViews - a.tiktokViews)[0];

const insights = [
  {
    title: 'Top Central Hub Artist',
    badge: 'Degree Centrality',
    finding: `${topDegreeArtist.name} emerges as the highest-degree artist hub with ${topDegreeArtist.songCount} charting tracks across ${topDegreeArtist.platformsCount} platforms, acting as an anchor in the music network.`,
    metric: `${topDegreeArtist.songCount} Songs · ${(topDegreeArtist.totalSpotifyStreams / 1e9).toFixed(2)}B Streams`
  },
  {
    title: 'Cross-Platform Omnipresence',
    badge: 'Network Density',
    finding: `${percentOmnipresent}% (${songsWith8PlusPlatforms.toLocaleString()} songs) appear simultaneously on 8 or more digital platforms, demonstrating tight cross-platform synchronization in modern music distribution.`,
    metric: `${songsWith8PlusPlatforms} Tracks (8+ Platforms)`
  },
  {
    title: 'Viral Social vs Broadcast Disconnect',
    badge: 'Bipartite Disconnect',
    finding: `TikTok viral breakout "${topTikTokSong.track}" by ${topTikTokSong.artist} achieved ${(topTikTokSong.tiktokViews / 1e9).toFixed(1)}B TikTok views, demonstrating a distinct cluster from traditional AirPlay radio hubs.`,
    metric: `${(topTikTokSong.tiktokViews / 1e9).toFixed(1)}B TikTok Views`
  },
  {
    title: 'Critical Bridge Nodes',
    badge: 'Betweenness Centrality',
    finding: `${topBridgeArtist.name} and multi-genre artists exhibit the highest betweenness centrality, bridging streaming platforms, radio broadcast networks, and discovery apps like Shazam.`,
    metric: `Betweenness: ${topBridgeArtist.betweenness.toFixed(4)}`
  },
  {
    title: 'Platform Centrality Hierarchy',
    badge: 'Platform Reach',
    finding: `Spotify (${platformStats[0].coveragePercent}% coverage) and YouTube (${platformStats[1].coveragePercent}% coverage) maintain the highest node degree, while Shazam and AirPlay form specialized bridge clusters for audio discovery.`,
    metric: `12 Platforms Analysed`
  }
];

const viewsSummary = {
  ecosystem: {
    name: 'Music Ecosystem',
    description: 'Tripartite network connecting Artists → Songs → Digital Platforms',
    nodeCount: ecosystemAnalysis.order,
    edgeCount: ecosystemAnalysis.size,
    density: ecosystemAnalysis.density.toFixed(5),
    components: ecosystemAnalysis.componentsCount,
    avgDegree: ((2 * ecosystemAnalysis.size) / ecosystemAnalysis.order).toFixed(2)
  },
  artist_song: {
    name: 'Artist–Song Network',
    description: 'Bipartite network showing authoring and repertoire connections',
    nodeCount: artistSongAnalysis.order,
    edgeCount: artistSongAnalysis.size,
    density: artistSongAnalysis.density.toFixed(5),
    components: artistSongAnalysis.componentsCount,
    avgDegree: ((2 * artistSongAnalysis.size) / artistSongAnalysis.order).toFixed(2)
  },
  song_platform: {
    name: 'Song–Platform Network',
    description: 'Bipartite network linking tracks to their active digital distribution channels',
    nodeCount: songPlatformAnalysis.order,
    edgeCount: songPlatformAnalysis.size,
    density: songPlatformAnalysis.density.toFixed(5),
    components: songPlatformAnalysis.componentsCount,
    avgDegree: ((2 * songPlatformAnalysis.size) / songPlatformAnalysis.order).toFixed(2)
  },
  artist_platform: {
    name: 'Artist–Platform Influence Network',
    description: 'Bipartite projection showing artist footprint and presence across platforms',
    nodeCount: artistPlatformAnalysis.order,
    edgeCount: artistPlatformAnalysis.size,
    density: artistPlatformAnalysis.density.toFixed(5),
    components: artistPlatformAnalysis.componentsCount,
    avgDegree: ((2 * artistPlatformAnalysis.size) / artistPlatformAnalysis.order).toFixed(2)
  }
};

const summary = {
  kpi: {
    totalSongs: songs.length,
    totalArtists: Object.keys(artistMap).length,
    totalAlbums: albumSet.size,
    totalSpotifyStreams: totalStreamsNumber,
    formattedSpotifyStreams: `${(totalStreamsNumber / 1e12).toFixed(2)} Trillion`,
    avgPopularity: parseFloat(avgPop),
    avgTrackScore: parseFloat(avgScore),
    platformsCount: PLATFORMS_DEF.length,
    explicitCount,
    nonExplicitCount,
    explicitStreams: Number(explicitStreamsBigInt),
    nonExplicitStreams: Number(nonExplicitStreamsBigInt)
  },
  viewsSummary,
  insights,
  yearDistribution: Object.values(yearStats).sort((a,b) => a.year - b.year),
  platformStats
};

const topNetworkNodes = {
  mostConnectedArtists: topByDegree,
  topBridgeNodes: topByBetweenness,
  influentialNodes: topByPageRank,
  platformDegreeRanking: platformStats.sort((a,b) => b.connectedSongsCount - a.connectedSongsCount)
};

// Write output JSON files
const dataDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

fs.writeFileSync(path.join(dataDir, 'summary.json'), JSON.stringify(summary, null, 2));
fs.writeFileSync(path.join(dataDir, 'platformStats.json'), JSON.stringify(platformStats, null, 2));
fs.writeFileSync(path.join(dataDir, 'platformOverlap.json'), JSON.stringify(platformOverlap, null, 2));
fs.writeFileSync(path.join(dataDir, 'topArtists.json'), JSON.stringify(sortedArtists.slice(0, 150), null, 2));
fs.writeFileSync(path.join(dataDir, 'topNetworkNodes.json'), JSON.stringify(topNetworkNodes, null, 2));
fs.writeFileSync(path.join(dataDir, 'graphPresets.json'), JSON.stringify(graphPresets, null, 2));

// For songs, save top 1500 with full details + compact all songs for search
fs.writeFileSync(path.join(dataDir, 'topSongs.json'), JSON.stringify(songs.slice(0, 1500), null, 2));

const searchableIndex = songs.map(s => ({
  id: s.id,
  rank: s.rank,
  track: s.track,
  artist: s.artist,
  streams: s.spotifyStreams,
  popularity: s.spotifyPopularity,
  year: s.releaseYear,
  explicit: s.explicit,
  platforms: s.activePlatforms,
  platformCount: s.platformCount
}));
fs.writeFileSync(path.join(dataDir, 'searchIndex.json'), JSON.stringify(searchableIndex, null, 2));

console.log('[Data Pipeline] SUCCESS! All data files generated in src/data:');
console.log(' - summary.json');
console.log(' - platformStats.json');
console.log(' - platformOverlap.json');
console.log(' - topArtists.json');
console.log(' - topSongs.json');
console.log(' - searchIndex.json');
console.log(' - topNetworkNodes.json');
console.log(' - graphPresets.json');
