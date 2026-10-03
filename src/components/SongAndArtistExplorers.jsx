import React, { useState, useEffect, useRef, useMemo } from 'react';
import cytoscape from 'cytoscape';
import { 
  Music, 
  User, 
  Search, 
  Disc, 
  Flame, 
  Eye, 
  Radio, 
  Layers, 
  Share2, 
  Calendar, 
  Award,
  Sparkles,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import topSongs from '../data/topSongs.json';
import topArtists from '../data/topArtists.json';
import { formatNumber, formatExactNumber } from '../utils/formatters';

export default function SongAndArtistExplorers({ initialArtistName, initialSongId }) {
  const [activeTab, setActiveTab] = useState('song'); // 'song' | 'artist'
  
  // Song Explorer States
  const [selectedSong, setSelectedSong] = useState(topSongs[0]);
  const [songSearch, setSongSearch] = useState('');

  // Artist Explorer States
  const [selectedArtist, setSelectedArtist] = useState(topArtists[0]);
  const [artistSearch, setArtistSearch] = useState('');
  const artistCyContainerRef = useRef(null);
  const artistCyRef = useRef(null);

  // Sync with props if provided
  useEffect(() => {
    if (initialSongId) {
      const match = topSongs.find(s => s.id === initialSongId);
      if (match) {
        setSelectedSong(match);
        setActiveTab('song');
      }
    }
  }, [initialSongId]);

  useEffect(() => {
    if (initialArtistName) {
      const match = topArtists.find(a => a.name.toLowerCase() === initialArtistName.toLowerCase());
      if (match) {
        setSelectedArtist(match);
        setActiveTab('artist');
      }
    }
  }, [initialArtistName]);

  // Filtered Song options
  const filteredSongOptions = useMemo(() => {
    if (!songSearch.trim()) return topSongs.slice(0, 30);
    const q = songSearch.toLowerCase().trim();
    return topSongs.filter(s => 
      s.track.toLowerCase().includes(q) || 
      s.artist.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [songSearch]);

  // Filtered Artist options
  const filteredArtistOptions = useMemo(() => {
    if (!artistSearch.trim()) return topArtists.slice(0, 30);
    const q = artistSearch.toLowerCase().trim();
    return topArtists.filter(a => a.name.toLowerCase().includes(q)).slice(0, 20);
  }, [artistSearch]);

  // Dynamic Artist Ego-Network Subgraph
  useEffect(() => {
    if (activeTab !== 'artist' || !artistCyContainerRef.current || !selectedArtist) return;

    if (artistCyRef.current) {
      artistCyRef.current.destroy();
    }

    // Find all songs by this artist from topSongs dataset
    const artistTracks = topSongs.filter(s => s.artist.toLowerCase() === selectedArtist.name.toLowerCase()).slice(0, 10);
    
    // Collect platforms connected to these songs
    const activePlatformsSet = new Set();
    artistTracks.forEach(s => s.activePlatforms.forEach(p => activePlatformsSet.add(p)));

    const elements = [];
    const artistId = `artist_${selectedArtist.name.replace(/\s+/g, '_')}`;

    // Center Artist Node
    elements.push({
      group: 'nodes',
      data: {
        id: artistId,
        label: selectedArtist.name,
        type: 'artist',
        color: '#A855F7',
        size: 55
      }
    });

    // Song Nodes & Artist->Song Edges
    artistTracks.forEach(s => {
      const songId = `art_song_${s.id}`;
      elements.push({
        group: 'nodes',
        data: {
          id: songId,
          label: s.track,
          type: 'song',
          color: '#38BDF8',
          size: 32
        }
      });

      elements.push({
        group: 'edges',
        data: {
          id: `${artistId}->${songId}`,
          source: artistId,
          target: songId,
          type: 'authored'
        }
      });

      // Song -> Platform Edges
      s.activePlatforms.slice(0, 6).forEach(p => {
        const platId = `art_plat_${p}`;
        if (!elements.some(e => e.data.id === platId)) {
          elements.push({
            group: 'nodes',
            data: {
              id: platId,
              label: p,
              type: 'platform',
              color: '#F59E0B',
              size: 40
            }
          });
        }

        elements.push({
          group: 'edges',
          data: {
            id: `${songId}->${platId}`,
            source: songId,
            target: platId,
            type: 'distributed_on'
          }
        });
      });
    });

    const cy = cytoscape({
      container: artistCyContainerRef.current,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'color': '#F1F5F9',
            'font-family': 'Inter, sans-serif',
            'font-size': '10px',
            'font-weight': 600,
            'text-valign': 'bottom',
            'text-margin-y': 4,
            'background-color': 'data(color)',
            'width': 'data(size)',
            'height': 'data(size)',
            'border-width': 2,
            'border-color': '#1E293B'
          }
        },
        {
          selector: 'node[type="artist"]',
          style: {
            'shape': 'hexagon',
            'font-size': '12px',
            'border-color': '#8B5CF6'
          }
        },
        {
          selector: 'node[type="platform"]',
          style: {
            'shape': 'diamond',
            'border-color': '#F59E0B'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': '#475569',
            'curve-style': 'bezier',
            'opacity': 0.6
          }
        },
        {
          selector: 'edge[type="authored"]',
          style: {
            'line-color': '#A855F7',
            'width': 2.5
          }
        },
        {
          selector: 'edge[type="distributed_on"]',
          style: {
            'line-color': '#38BDF8'
          }
        }
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        roots: `#${artistId}`,
        padding: 25,
        spacingFactor: 1.3
      }
    });

    artistCyRef.current = cy;

    return () => {
      if (artistCyRef.current) {
        artistCyRef.current.destroy();
      }
    };
  }, [selectedArtist, activeTab]);

  return (
    <section id="explorers" className="py-16 border-b border-slate-800 bg-[#090D16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Tab Selector */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Specialized Explorers
              </span>
              <span className="text-xs text-slate-400">· Granular Entity Inspectors</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
              Song & Artist Ego-Network Explorers
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Inspect granular platform metrics for any song, or generate dynamic ego-networks showcasing an artist's full distribution footprint.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setActiveTab('song')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'song'
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>SONG EXPLORER</span>
            </button>
            <button
              onClick={() => setActiveTab('artist')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'artist'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>ARTIST EXPLORER</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 1. SONG EXPLORER TAB */}
        {/* ============================================================== */}
        {activeTab === 'song' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Song Selector Search Bar */}
            <div className="p-4 rounded-xl bg-[#0D1220] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Search className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-300 font-semibold whitespace-nowrap">
                  Choose Song:
                </span>
                <select
                  value={selectedSong.id}
                  onChange={(e) => {
                    const match = topSongs.find(s => s.id === e.target.value);
                    if (match) setSelectedSong(match);
                  }}
                  className="w-full sm:w-96 px-3 py-1.5 rounded-lg bg-slate-900 text-xs text-white border border-slate-700 outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {topSongs.slice(0, 100).map(s => (
                    <option key={s.id} value={s.id}>
                      #{s.rank} · {s.track} — {s.artist}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>Release: <strong className="text-white">{selectedSong.releaseDate || selectedSong.releaseYear}</strong></span>
                <span>·</span>
                <span>ISRC: <strong className="text-cyan-300">{selectedSong.isrc || 'N/A'}</strong></span>
              </div>
            </div>

            {/* Song Meta Header Card */}
            <div className="p-6 rounded-2xl bg-[#0D1220] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold text-xl shadow-lg">
                  #{selectedSong.rank}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    {selectedSong.track}
                  </h3>
                  <p className="text-sm font-medium text-purple-300 mt-0.5">
                    {selectedSong.artist} <span className="text-slate-500">·</span> Album: <span className="text-slate-300">{selectedSong.album}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-mono">TRACK SCORE</span>
                  <span className="text-base font-bold text-amber-400 font-mono">{selectedSong.trackScore}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-mono">POPULARITY</span>
                  <span className="text-base font-bold text-cyan-400 font-mono">{selectedSong.spotifyPopularity}/100</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-mono">CONTENT</span>
                  <span className={`text-xs font-bold font-mono ${selectedSong.explicit ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedSong.explicit ? 'EXPLICIT' : 'CLEAN'}
                  </span>
                </div>
              </div>
            </div>

            {/* Platform Metrics Breakdown Grids */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* SPOTIFY METRICS */}
              <div className="p-5 rounded-xl bg-slate-900/70 border border-emerald-500/30 shadow-lg space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Spotify Analytics</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">Audio Streaming</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60">
                    <span className="text-slate-400">Streams:</span>
                    <span className="font-bold text-white font-mono">{formatExactNumber(selectedSong.spotifyStreams)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60">
                    <span className="text-slate-400">Popularity Score:</span>
                    <span className="font-bold text-cyan-300 font-mono">{selectedSong.spotifyPopularity} / 100</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60">
                    <span className="text-slate-400">Playlist Count:</span>
                    <span className="font-bold text-white font-mono">{formatExactNumber(selectedSong.spotifyPlaylistCount)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60">
                    <span className="text-slate-400">Playlist Reach:</span>
                    <span className="font-bold text-emerald-400 font-mono">{formatNumber(selectedSong.spotifyPlaylistReach)}</span>
                  </div>
                </div>
              </div>

              {/* YOUTUBE METRICS */}
              <div className="p-5 rounded-xl bg-slate-900/70 border border-red-500/30 shadow-lg space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-red-400 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span>YouTube Analytics</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">Video Platform</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60">
                    <span className="text-slate-400">Video Views:</span>
                    <span className="font-bold text-white font-mono">{formatExactNumber(selectedSong.youtubeViews)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60">
                    <span className="text-slate-400">Video Likes:</span>
                    <span className="font-bold text-red-300 font-mono">{formatExactNumber(selectedSong.youtubeLikes)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60">
                    <span className="text-slate-400">Playlist Reach:</span>
                    <span className="font-bold text-white font-mono">{formatNumber(selectedSong.youtubePlaylistReach)}</span>
                  </div>
                </div>
              </div>

              {/* TIKTOK METRICS */}
              <div className="p-5 rounded-xl bg-slate-900/70 border border-cyan-500/30 shadow-lg space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span>TikTok Analytics</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">Short Video Virality</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60">
                    <span className="text-slate-400">TikTok Views:</span>
                    <span className="font-bold text-white font-mono">{formatExactNumber(selectedSong.tiktokViews)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60">
                    <span className="text-slate-400">TikTok Likes:</span>
                    <span className="font-bold text-indigo-300 font-mono">{formatExactNumber(selectedSong.tiktokLikes)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60">
                    <span className="text-slate-400">TikTok Posts:</span>
                    <span className="font-bold text-cyan-300 font-mono">{formatExactNumber(selectedSong.tiktokPosts)}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* OTHER PLATFORMS BREAKDOWN */}
            <div className="p-6 rounded-2xl bg-[#0D1220] border border-slate-800 shadow-xl">
              <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Other Streaming, Broadcast & Discovery Platforms</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Apple Music</span>
                  <p className="font-bold text-white font-mono mt-1">{selectedSong.appleMusicPlaylistCount} Playlists</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400">AirPlay Radio</span>
                  <p className="font-bold text-cyan-400 font-mono mt-1">{formatExactNumber(selectedSong.airplaySpins)} Spins</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400">SiriusXM</span>
                  <p className="font-bold text-blue-400 font-mono mt-1">{formatExactNumber(selectedSong.siriusxmSpins)} Spins</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Deezer</span>
                  <p className="font-bold text-purple-400 font-mono mt-1">{selectedSong.deezerPlaylistCount} Playlists</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Amazon Music</span>
                  <p className="font-bold text-amber-400 font-mono mt-1">{selectedSong.amazonPlaylistCount} Playlists</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Shazam Counts</span>
                  <p className="font-bold text-emerald-400 font-mono mt-1">{formatExactNumber(selectedSong.shazamCounts)} Tags</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* 2. ARTIST EXPLORER TAB */}
        {/* ============================================================== */}
        {activeTab === 'artist' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Artist Selector Bar */}
            <div className="p-4 rounded-xl bg-[#0D1220] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Search className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-300 font-semibold whitespace-nowrap">
                  Choose Artist:
                </span>
                <select
                  value={selectedArtist.name}
                  onChange={(e) => {
                    const match = topArtists.find(a => a.name === e.target.value);
                    if (match) setSelectedArtist(match);
                  }}
                  className="w-full sm:w-80 px-3 py-1.5 rounded-lg bg-slate-900 text-xs text-white border border-slate-700 outline-none focus:border-purple-500 cursor-pointer"
                >
                  {topArtists.slice(0, 50).map(a => (
                    <option key={a.name} value={a.name}>
                      {a.name} ({a.songCount} charting tracks)
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-slate-400">
                Connected across <strong className="text-purple-300">{selectedArtist.platformsCount} / 12</strong> digital platforms
              </div>
            </div>

            {/* Artist Career Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-xs text-slate-400">Total Spotify Streams</span>
                <p className="text-xl font-bold text-emerald-400 font-mono mt-1">
                  {formatNumber(selectedArtist.totalSpotifyStreams)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-xs text-slate-400">Total YouTube Views</span>
                <p className="text-xl font-bold text-rose-400 font-mono mt-1">
                  {formatNumber(selectedArtist.totalYouTubeViews)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-xs text-slate-400">Total TikTok Views</span>
                <p className="text-xl font-bold text-cyan-400 font-mono mt-1">
                  {formatNumber(selectedArtist.totalTikTokViews)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-xs text-slate-400">Charting Catalog Tracks</span>
                <p className="text-xl font-bold text-purple-400 font-mono mt-1">
                  {selectedArtist.songCount} Songs
                </p>
              </div>
            </div>

            {/* Dynamic Hierarchical Ego-Network Graph Canvas */}
            <div className="p-6 rounded-2xl bg-[#0D1220] border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-purple-400" />
                    <span>Dynamic Artist Distribution Ego-Network (Artist → Songs → Platforms)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Hierarchical bipartite/tripartite tree dynamically generated from {selectedArtist.name}'s actual charting songs and platform placements.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-purple-500" /> Artist</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-cyan-400" /> Song</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-400" /> Platform</span>
                </div>
              </div>

              {/* Subgraph Container */}
              <div 
                ref={artistCyContainerRef} 
                className="w-full h-96 rounded-xl border border-slate-800/80 bg-[#070A10]" 
              />
              <div className="mt-2 text-center text-[10px] text-slate-400">
                Drag nodes or scroll to zoom · Nodes positioned via hierarchical BFS tree layout
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
