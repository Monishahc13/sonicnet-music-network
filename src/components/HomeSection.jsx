import React from 'react';
import { 
  Network, 
  Music2, 
  Users, 
  Disc, 
  Radio, 
  Flame, 
  ArrowRight, 
  Layers, 
  Activity,
  Share2,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';
import summary from '../data/summary.json';
import { formatNumber, formatExactNumber } from '../utils/formatters';

export default function HomeSection({ onExploreNetwork, onOpenPresentation, onSelectViewMode }) {
  const { kpi } = summary;

  const kpis = [
    {
      id: 'songs',
      label: 'Total Songs',
      value: formatExactNumber(kpi.totalSongs),
      unit: 'Tracks Analyzed',
      icon: Music2,
      color: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-400'
    },
    {
      id: 'artists',
      label: 'Total Artists',
      value: formatExactNumber(kpi.totalArtists),
      unit: 'Unique Performers',
      icon: Users,
      color: 'from-purple-500 to-indigo-600',
      textColor: 'text-purple-400'
    },
    {
      id: 'albums',
      label: 'Total Albums',
      value: formatExactNumber(kpi.totalAlbums),
      unit: 'Releases & Singles',
      icon: Disc,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-400'
    },
    {
      id: 'streams',
      label: 'Total Spotify Streams',
      value: kpi.formattedSpotifyStreams,
      unit: `${formatExactNumber(kpi.totalSpotifyStreams)} Exact`,
      icon: Flame,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-400'
    },
    {
      id: 'popularity',
      label: 'Avg Spotify Popularity',
      value: `${kpi.avgPopularity} / 100`,
      unit: `Avg Track Score: ${kpi.avgTrackScore}`,
      icon: Activity,
      color: 'from-rose-500 to-pink-600',
      textColor: 'text-rose-400'
    },
    {
      id: 'platforms',
      label: 'Platforms Analysed',
      value: `${kpi.platformsCount} Platforms`,
      unit: 'Streaming · Video · Radio',
      icon: Radio,
      color: 'from-blue-500 to-cyan-600',
      textColor: 'text-blue-400'
    }
  ];

  const networkViewsCards = [
    {
      mode: 'ecosystem',
      title: 'View 4: Music Ecosystem',
      badge: 'Tripartite Graph',
      desc: 'The master combined network. Artists connect to their Songs, and Songs connect to the 12 digital streaming and broadcast platforms.',
      nodesText: 'Artists → Songs → Platforms',
      accent: 'border-cyan-500/40 hover:border-cyan-400'
    },
    {
      mode: 'artist_song',
      title: 'View 1: Artist–Song Network',
      badge: 'Bipartite Graph',
      desc: 'Visualizes authoring, repertoire scale, and hit catalog clustering. See which artists dominate with deep multi-song footprints.',
      nodesText: 'Artists → Songs',
      accent: 'border-purple-500/40 hover:border-purple-400'
    },
    {
      mode: 'song_platform',
      title: 'View 2: Song–Platform Network',
      badge: 'Distribution Graph',
      desc: 'Maps how songs proliferate across platforms (Spotify, YouTube, TikTok, Apple Music, AirPlay, Deezer, etc.) based on measurable activity.',
      nodesText: 'Songs → Digital Platforms',
      accent: 'border-emerald-500/40 hover:border-emerald-400'
    },
    {
      mode: 'artist_platform',
      title: 'View 3: Artist–Platform Influence',
      badge: 'Influence Projection',
      desc: 'Shows how strongly an artist’s catalog bridges different platform ecosystems, identifying terrestrial vs streaming powerhouses.',
      nodesText: 'Artists → Digital Platforms',
      accent: 'border-amber-500/40 hover:border-amber-400'
    }
  ];

  return (
    <section id="overview" className="relative pt-12 pb-20 overflow-hidden border-b border-slate-800/80">
      
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Project Tag Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
              Social Network Analysis · Academic Project 2024
            </span>
          </div>
        </div>

        {/* Hero Title & Subtitles */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              SONICNET
            </span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-medium text-slate-200">
            Discover how songs, artists and platforms connect to shape music popularity
          </p>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            SONICNET transforms music streaming data into an interactive network, revealing relationships 
            between artists, songs and digital platforms. Powered by Graph Theory, Centrality Metrics, and Cross-Platform Distribution Analytics.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExploreNetwork}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-95 transition-all group"
            >
              <Network className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span>EXPLORE MUSIC NETWORK</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenPresentation}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 shadow-md active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Project Presentation Mode</span>
            </button>
          </div>
        </div>

        {/* Dynamic KPI Cards */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {kpis.map((kpiItem) => {
            const Icon = kpiItem.icon;
            return (
              <div
                key={kpiItem.id}
                className="relative p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 shadow-lg backdrop-blur-sm transition-all hover:-translate-y-0.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">{kpiItem.label}</span>
                  <div className={`p-1.5 rounded-lg bg-slate-800/80 text-slate-300 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className={`mt-2 text-xl sm:text-2xl font-bold tracking-tight ${kpiItem.textColor}`}>
                  {kpiItem.value}
                </div>
                <div className="mt-1 text-[11px] text-slate-400 truncate">
                  {kpiItem.unit}
                </div>
              </div>
            );
          })}
        </div>

        {/* The 4 Network Modes Preview */}
        <div className="mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
            <div>
              <span className="text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase">
                Core Architecture
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Four Distinct Network Perspectives
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 sm:mt-0 max-w-md">
              Switch between these 4 graph models dynamically inside the interactive network engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {networkViewsCards.map((v) => (
              <div
                key={v.mode}
                onClick={() => {
                  onSelectViewMode(v.mode);
                  onExploreNetwork();
                }}
                className={`p-5 rounded-xl bg-[#0F1626]/80 border ${v.accent} cursor-pointer hover:bg-slate-800/50 transition-all flex flex-col justify-between group shadow-lg`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                      {v.badge}
                    </span>
                    <Share2 className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400/90 font-medium">
                    {v.nodesText}
                  </span>
                  <span className="text-xs text-slate-400 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
