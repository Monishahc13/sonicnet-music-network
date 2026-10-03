import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { 
  Users, 
  Flame, 
  Award, 
  Activity, 
  Eye, 
  Radio, 
  Network,
  Share2,
  ExternalLink
} from 'lucide-react';
import topArtists from '../data/topArtists.json';
import { formatNumber, formatExactNumber, formatCentrality } from '../utils/formatters';

export default function TopArtistsSection({ onInspectArtistInNetwork }) {
  const [metricKey, setMetricKey] = useState('totalSpotifyStreams');
  const [topLimit, setTopLimit] = useState(10);

  const metricsConfig = {
    totalSpotifyStreams: {
      label: 'Spotify Streams',
      unit: 'Streams',
      color: '#10B981',
      icon: Flame,
      formatter: (v) => formatNumber(v)
    },
    totalTrackScore: {
      label: 'Average Track Score',
      unit: 'Score (0-1000)',
      color: '#F59E0B',
      icon: Award,
      accessor: (a) => a.avgTrackScore,
      formatter: (v) => v.toFixed(1)
    },
    avgPopularity: {
      label: 'Spotify Popularity',
      unit: 'Index (0-100)',
      color: '#06B6D4',
      icon: Activity,
      formatter: (v) => `${v}/100`
    },
    totalYouTubeViews: {
      label: 'YouTube Views',
      unit: 'Views',
      color: '#EF4444',
      icon: Eye,
      formatter: (v) => formatNumber(v)
    },
    totalTikTokViews: {
      label: 'TikTok Views',
      unit: 'Viral Views',
      color: '#8B5CF6',
      icon: Radio,
      formatter: (v) => formatNumber(v)
    },
    platformsCount: {
      label: 'Cross-Platform Reach',
      unit: 'Platforms (Max 12)',
      color: '#EC4899',
      icon: Network,
      formatter: (v) => `${v} Platforms`
    },
    degree: {
      label: 'Network Degree',
      unit: 'Degree Centrality',
      color: '#6366F1',
      icon: Share2,
      formatter: (v) => formatCentrality(v)
    }
  };

  const currentConfig = metricsConfig[metricKey];

  // Sorted list for chart & table
  const sortedArtists = useMemo(() => {
    return [...topArtists]
      .sort((a, b) => {
        const valA = currentConfig.accessor ? currentConfig.accessor(a) : a[metricKey];
        const valB = currentConfig.accessor ? currentConfig.accessor(b) : b[metricKey];
        return (valB || 0) - (valA || 0);
      })
      .slice(0, topLimit);
  }, [metricKey, topLimit, currentConfig]);

  const chartData = useMemo(() => {
    return sortedArtists.map(a => ({
      name: a.name,
      value: currentConfig.accessor ? currentConfig.accessor(a) : a[metricKey],
      raw: a
    }));
  }, [sortedArtists, currentConfig, metricKey]);

  return (
    <section id="artists" className="py-16 border-b border-slate-800 bg-[#090D16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                Artist Portfolio Analytics
              </span>
              <span className="text-xs text-slate-400">· Multi-Dimensional Rankings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
              Top Artists by Network & Engagement Metrics
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Compare artists across streaming volume, algorithmic popularity, viral social reach, and network centrality.
            </p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {Object.entries(metricsConfig).map(([k, cfg]) => {
              const Icon = cfg.icon;
              return (
                <button
                  key={k}
                  onClick={() => setMetricKey(k)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    metricKey === k
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Chart Container */}
        <div className="p-6 rounded-2xl bg-[#0D1220] border border-slate-800 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentConfig.color }} />
              <h3 className="text-sm font-semibold text-white">
                Top {topLimit} Artists by {currentConfig.label} ({currentConfig.unit})
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Show:</span>
              {[10, 15, 25].map(cnt => (
                <button
                  key={cnt}
                  onClick={() => setTopLimit(cnt)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                    topLimit === cnt
                      ? 'bg-purple-500 text-white border-purple-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {cnt}
                </button>
              ))}
            </div>
          </div>

          <div className="h-80 sm:h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 80, bottom: 5 }}
              >
                <XAxis
                  type="number"
                  tickFormatter={currentConfig.formatter}
                  stroke="#475569"
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#475569"
                  tick={{ fill: '#E2E8F0', fontSize: 11 }}
                  width={110}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const a = data.raw;
                      return (
                        <div className="p-3 bg-[#0B0F19] border border-slate-700 rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-bold text-white text-sm">{a.name}</p>
                          <p className="text-cyan-400 font-mono">
                            {currentConfig.label}: {currentConfig.formatter(data.value)}
                          </p>
                          <p className="text-slate-400">Catalog Songs in 2024: <strong className="text-white">{a.songCount}</strong></p>
                          <p className="text-slate-400">Spotify Streams: <strong className="text-emerald-400">{formatNumber(a.totalSpotifyStreams)}</strong></p>
                          <p className="text-slate-400">Platforms Represented: <strong className="text-purple-400">{a.platformsCount} / 12</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={currentConfig.color}
                      opacity={0.85 + (index === 0 ? 0.15 : 0)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 6 Artist Spotlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedArtists.slice(0, 6).map((artist, idx) => (
            <div
              key={artist.name}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Rank #{idx + 1}
                  </span>
                  <span className="text-xs text-slate-400">
                    {artist.songCount} Hit Tracks
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  {artist.name}
                </h3>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400">Spotify Streams</span>
                    <p className="font-bold text-emerald-400 mt-0.5">
                      {formatNumber(artist.totalSpotifyStreams)}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400">Avg Popularity</span>
                    <p className="font-bold text-cyan-400 mt-0.5">
                      {artist.avgPopularity}/100
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400">YouTube Views</span>
                    <p className="font-bold text-rose-400 mt-0.5">
                      {formatNumber(artist.totalYouTubeViews)}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400">TikTok Views</span>
                    <p className="font-bold text-indigo-400 mt-0.5">
                      {formatNumber(artist.totalTikTokViews)}
                    </p>
                  </div>
                </div>

                {/* Top Tracks snippet */}
                {artist.topSongs && artist.topSongs.length > 0 && (
                  <div className="mt-3 text-[11px] text-slate-400">
                    <span className="font-medium text-slate-300 block mb-1">Top Track:</span>
                    <p className="truncate text-slate-200">
                      "{artist.topSongs[0].track}" · <span className="text-cyan-400">{formatNumber(artist.topSongs[0].streams)}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Platforms: <strong className="text-purple-400">{artist.platformsCount} / 12</strong>
                </span>
                <button
                  onClick={() => onInspectArtistInNetwork(artist.name)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Locate in Network</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
