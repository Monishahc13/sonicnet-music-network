import React, { useState, useMemo } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { 
  Radio, 
  Compass, 
  Music, 
  Eye, 
  Flame, 
  Share2, 
  CheckCircle2, 
  Search,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import topSongs from '../data/topSongs.json';
import { formatNumber, formatExactNumber } from '../utils/formatters';

export default function CrossPlatformFootprint({ selectedSongId, onSelectSongId }) {
  // Default to song rank 1 (MILLION DOLLAR BABY) or passed ID
  const [selectedSong, setSelectedSong] = useState(() => {
    if (selectedSongId) {
      const match = topSongs.find(s => s.id === selectedSongId);
      if (match) return match;
    }
    return topSongs[0];
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Handle external selection change
  React.useEffect(() => {
    if (selectedSongId) {
      const match = topSongs.find(s => s.id === selectedSongId);
      if (match) setSelectedSong(match);
    }
  }, [selectedSongId]);

  // Search filtered candidate songs
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return topSongs.slice(0, 20);
    const q = searchQuery.toLowerCase().trim();
    return topSongs.filter(s => 
      s.track.toLowerCase().includes(q) || 
      s.artist.toLowerCase().includes(q)
    ).slice(0, 15);
  }, [searchQuery]);

  // Calculate normalized Radar dimensions (0 - 100) based on actual dataset limits
  const radarData = useMemo(() => {
    if (!selectedSong) return [];

    // Max bounds from 2024 dataset for proper scaling
    const maxSpotifyStreams = 2.5e9;
    const maxYouTubeViews = 1.5e9;
    const maxTikTokViews = 15e9;
    const maxPlaylists = 400; // Apple Music
    const maxAirPlaySpins = 1.5e6;
    const maxShazam = 15e6;

    const streamScore = Math.min(100, Math.round((selectedSong.spotifyStreams / maxSpotifyStreams) * 100));
    const videoScore = Math.min(100, Math.round((selectedSong.youtubeViews / maxYouTubeViews) * 100));
    const viralScore = Math.min(100, Math.round((selectedSong.tiktokViews / maxTikTokViews) * 100));
    const curationScore = Math.min(100, Math.round((selectedSong.appleMusicPlaylistCount / maxPlaylists) * 100));
    const radioScore = Math.min(100, Math.round((selectedSong.airplaySpins / maxAirPlaySpins) * 100));
    const discoveryScore = Math.min(100, Math.round((selectedSong.shazamCounts / maxShazam) * 100));

    return [
      { subject: 'Spotify Streaming', score: Math.max(15, streamScore), fullMark: 100, realVal: `${formatNumber(selectedSong.spotifyStreams)} Streams` },
      { subject: 'YouTube Video', score: Math.max(10, videoScore), fullMark: 100, realVal: `${formatNumber(selectedSong.youtubeViews)} Views` },
      { subject: 'TikTok Virality', score: Math.max(10, viralScore), fullMark: 100, realVal: `${formatNumber(selectedSong.tiktokViews)} Views` },
      { subject: 'Curated Playlists', score: Math.max(10, curationScore), fullMark: 100, realVal: `${selectedSong.appleMusicPlaylistCount} Apple Playlists` },
      { subject: 'Radio Broadcast', score: Math.max(10, radioScore), fullMark: 100, realVal: `${formatNumber(selectedSong.airplaySpins)} Spins` },
      { subject: 'Shazam Discovery', score: Math.max(10, discoveryScore), fullMark: 100, realVal: `${formatNumber(selectedSong.shazamCounts)} Tags` }
    ];
  }, [selectedSong]);

  // Platform sequential flow cards
  const platformsFlow = [
    {
      name: 'Spotify',
      color: '#1DB954',
      metric: `${formatNumber(selectedSong.spotifyStreams)} Streams`,
      detail: `Popularity ${selectedSong.spotifyPopularity}/100 · ${formatNumber(selectedSong.spotifyPlaylistReach)} Reach`,
      isActive: selectedSong.spotifyStreams > 0
    },
    {
      name: 'YouTube',
      color: '#FF0000',
      metric: `${formatNumber(selectedSong.youtubeViews)} Views`,
      detail: `${formatNumber(selectedSong.youtubeLikes)} Likes`,
      isActive: selectedSong.youtubeViews > 0
    },
    {
      name: 'TikTok',
      color: '#00F2FE',
      metric: `${formatNumber(selectedSong.tiktokViews)} Views`,
      detail: `${formatNumber(selectedSong.tiktokPosts)} Posts Created`,
      isActive: selectedSong.tiktokViews > 0 || selectedSong.tiktokPosts > 0
    },
    {
      name: 'Apple Music',
      color: '#FC3C44',
      metric: `${selectedSong.appleMusicPlaylistCount} Playlists`,
      detail: `Curation Placements`,
      isActive: selectedSong.appleMusicPlaylistCount > 0
    },
    {
      name: 'Radio AirPlay',
      color: '#38BDF8',
      metric: `${formatNumber(selectedSong.airplaySpins)} Spins`,
      detail: `Terrestrial Broadcast`,
      isActive: selectedSong.airplaySpins > 0
    },
    {
      name: 'SiriusXM',
      color: '#0284C7',
      metric: `${formatNumber(selectedSong.siriusxmSpins)} Spins`,
      detail: `Satellite Radio`,
      isActive: selectedSong.siriusxmSpins > 0
    },
    {
      name: 'Deezer',
      color: '#A855F7',
      metric: `${selectedSong.deezerPlaylistCount} Playlists`,
      detail: `${formatNumber(selectedSong.deezerPlaylistReach)} Reach`,
      isActive: selectedSong.deezerPlaylistCount > 0
    },
    {
      name: 'Amazon Music',
      color: '#F59E0B',
      metric: `${selectedSong.amazonPlaylistCount} Playlists`,
      detail: `Prime & Unlimited`,
      isActive: selectedSong.amazonPlaylistCount > 0
    },
    {
      name: 'Pandora',
      color: '#3B82F6',
      metric: `${formatNumber(selectedSong.pandoraStreams)} Streams`,
      detail: `${formatNumber(selectedSong.pandoraTrackStations)} Stations`,
      isActive: selectedSong.pandoraStreams > 0
    },
    {
      name: 'SoundCloud',
      color: '#F97316',
      metric: `${formatNumber(selectedSong.soundcloudStreams)} Streams`,
      detail: `Direct Creator Stream`,
      isActive: selectedSong.soundcloudStreams > 0
    },
    {
      name: 'Shazam',
      color: '#06B6D4',
      metric: `${formatNumber(selectedSong.shazamCounts)} Tags`,
      detail: `Audio Fingerprinting`,
      isActive: selectedSong.shazamCounts > 0
    },
    {
      name: 'TIDAL',
      color: '#10B981',
      metric: selectedSong.tidalPopularity ? `Popularity ${selectedSong.tidalPopularity}` : 'Catalog Sync',
      detail: `Hi-Fi Streaming`,
      isActive: selectedSong.tidalPopularity > 0
    }
  ];

  return (
    <section id="footprint" className="py-16 border-b border-slate-800 bg-[#080B11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Core Unique Feature
              </span>
              <span className="text-xs text-slate-400">· Cross-Platform Diffusion Mapping</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 flex items-center gap-2">
              <span>Where Does Music Travel?</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Inspect how any individual hit song disperses through streaming, short video, terrestrial airplay, and discovery engines. All numbers are exact values from the 2024 dataset.
            </p>
          </div>

          {/* Quick Song Selector Dropdown / Search */}
          <div className="w-full md:w-80">
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              Select or Search Track:
            </label>
            <div className="relative">
              <select
                value={selectedSong.id}
                onChange={(e) => {
                  const s = topSongs.find(song => song.id === e.target.value);
                  if (s) {
                    setSelectedSong(s);
                    if (onSelectSongId) onSelectSongId(s.id);
                  }
                }}
                className="w-full px-3 py-2 bg-slate-900 text-xs text-white rounded-xl border border-slate-700 outline-none focus:border-cyan-500 cursor-pointer shadow-inner"
              >
                {topSongs.slice(0, 50).map(s => (
                  <option key={s.id} value={s.id}>
                    #{s.rank} · {s.track} – {s.artist}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Selected Song Meta Banner */}
        <div className="p-6 rounded-2xl bg-[#0D1220] border border-slate-800 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20 flex-shrink-0">
              #{selectedSong.rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  {selectedSong.track}
                </h3>
                {selectedSong.explicit && (
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                    EXPLICIT
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-purple-300 mt-0.5">
                {selectedSong.artist} <span className="text-slate-500">·</span> <span className="text-slate-400">{selectedSong.album} ({selectedSong.releaseYear})</span>
              </p>
            </div>
          </div>

          {/* Quick Omnipresence Badge */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">
                Platform Footprint
              </span>
              <span className="text-lg font-bold text-emerald-400 font-mono">
                {selectedSong.platformCount} / 12 Active Platforms
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Digital Footprint Visualization: Radar Chart & Sequential Journey */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* 6-Dimension Multi-Platform Radar Chart */}
          <div className="p-6 rounded-2xl bg-[#0D1220] border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Multi-Dimensional Platform Footprint</span>
                </h4>
                <span className="text-[11px] font-mono text-cyan-300">Normalized Index</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Balances streaming, video views, viral social penetration, broadcast spins, and audio tags on a normalized scale.
              </p>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#E2E8F0', fontSize: 11, fontWeight: 500 }} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={{ fill: '#64748B', fontSize: 9 }} 
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="p-3 bg-[#0B0F19] border border-slate-700 rounded-xl shadow-xl text-xs space-y-1">
                            <p className="font-bold text-white">{item.subject}</p>
                            <p className="text-cyan-400 font-mono">Footprint Index: {item.score}/100</p>
                            <p className="text-slate-300 font-medium">Actual Dataset Value: <strong className="text-emerald-400">{item.realVal}</strong></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Radar
                    name="Footprint"
                    dataKey="score"
                    stroke="#06B6D4"
                    fill="#06B6D4"
                    fillOpacity={0.35}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 text-[11px] text-slate-400 text-center font-mono">
              Hover over radar vertices to inspect calibrated platform strength
            </div>
          </div>

          {/* Sequential Diffusion Pipeline */}
          <div className="p-6 rounded-2xl bg-[#0D1220] border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-purple-400" />
                  <span>Sequential Distribution Pipeline</span>
                </h4>
                <span className="text-[11px] font-mono text-purple-300">Diffusion Flow</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                The journey of a global hit: streaming inception → video visualization → TikTok virality → terrestrial airplay & discovery.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { stage: '1. Streaming Anchor', platform: 'Spotify', val: `${formatNumber(selectedSong.spotifyStreams)} Streams`, note: `Popularity ${selectedSong.spotifyPopularity}/100`, color: 'border-emerald-500/40 text-emerald-400' },
                { stage: '2. Video Production', platform: 'YouTube', val: `${formatNumber(selectedSong.youtubeViews)} Views`, note: `${formatNumber(selectedSong.youtubeLikes)} Likes`, color: 'border-red-500/40 text-red-400' },
                { stage: '3. Viral Propagation', platform: 'TikTok', val: `${formatNumber(selectedSong.tiktokViews)} Views`, note: `${formatNumber(selectedSong.tiktokPosts)} Creator Posts`, color: 'border-cyan-500/40 text-cyan-400' },
                { stage: '4. Editorial Curation', platform: 'Apple & Deezer', val: `${selectedSong.appleMusicPlaylistCount + selectedSong.deezerPlaylistCount} Playlists`, note: 'Global High-Value Editorial Reach', color: 'border-purple-500/40 text-purple-400' },
                { stage: '5. Radio Broadcast', platform: 'AirPlay & SiriusXM', val: `${formatNumber(selectedSong.airplaySpins + selectedSong.siriusxmSpins)} Spins`, note: 'Terrestrial & Satellite Radio Penetration', color: 'border-blue-500/40 text-blue-400' },
                { stage: '6. Audio Recognition', platform: 'Shazam', val: `${formatNumber(selectedSong.shazamCounts)} Audio Tags`, note: 'Listener Identification & Search', color: 'border-amber-500/40 text-amber-400' }
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.stage}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">{item.platform}</p>
                      <p className="text-[10px] text-slate-400">{item.note}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-bold ${item.color}`}>
                    {item.val}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
              <span>Overall Track Score: <strong className="text-amber-400 font-mono">{selectedSong.trackScore}</strong></span>
              <span>All-Time Rank: <strong className="text-cyan-400 font-mono">#{selectedSong.rank}</strong></span>
            </div>
          </div>

        </div>

        {/* 12-Platform Footprint Grid */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Complete 12-Platform Footprint Ledger for "{selectedSong.track}"</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {platformsFlow.map((pf) => (
              <div 
                key={pf.name}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  pf.isActive 
                    ? 'bg-slate-900/90 border-slate-700/80 shadow-md' 
                    : 'bg-slate-950/40 border-slate-900/80 opacity-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">{pf.name}</span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pf.color }} />
                  </div>
                  <p className="text-xs font-mono font-bold text-cyan-300 mt-1 truncate">
                    {pf.isActive ? pf.metric : 'No Data / Inactive'}
                  </p>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 truncate">
                  {pf.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
