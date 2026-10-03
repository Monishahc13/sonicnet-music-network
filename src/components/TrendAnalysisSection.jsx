import React, { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { TrendingUp, Calendar, Disc, Activity, Flame, ShieldAlert } from 'lucide-react';
import summary from '../data/summary.json';
import { formatNumber, formatExactNumber } from '../utils/formatters';

export default function TrendAnalysisSection() {
  const { yearDistribution, kpi } = summary;

  // Filter year distribution for modern streaming era (2010 to 2024)
  const recentYearsData = useMemo(() => {
    return yearDistribution
      .filter(y => y.year >= 2012 && y.year <= 2024)
      .map(y => ({
        year: `${y.year}`,
        songs: y.count,
        streams: y.totalStreams,
        avgPopularity: y.count > 0 ? (y.popularitySum / y.count).toFixed(1) : 0
      }));
  }, [yearDistribution]);

  // Explicit vs Clean distribution
  const explicitPieData = [
    { name: 'Clean Tracks', value: kpi.nonExplicitCount, streams: kpi.nonExplicitStreams, color: '#10B981' },
    { name: 'Explicit Tracks', value: kpi.explicitCount, streams: kpi.explicitStreams, color: '#F43F5E' }
  ];

  return (
    <section id="trends" className="py-16 border-b border-slate-800 bg-[#090D16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                Temporal Streaming Evolution
              </span>
              <span className="text-xs text-slate-400">· Release Date Patterns (2012–2024)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
              Release Year Trends & Content Dynamics
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Examine how release era influences streaming longevity, catalog popularity, and explicit lyric prevalence across 4,600 charting tracks.
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Chart 1: Song Volume & Total Streams by Year */}
          <div className="p-6 rounded-2xl bg-[#0D1220] border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>Charting Track Density by Release Year</span>
                </h3>
                <span className="text-[11px] font-mono text-cyan-300">Track Influx</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                2023 and 2024 dominate the dataset, accounting for over 40% of the active streaming network.
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recentYearsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="year" stroke="#475569" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <YAxis stroke="#475569" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="p-3 bg-[#0B0F19] border border-slate-700 rounded-xl text-xs space-y-1">
                            <p className="font-bold text-white">Year {d.year}</p>
                            <p className="text-cyan-400 font-mono">Charting Tracks: {d.songs}</p>
                            <p className="text-emerald-400 font-mono">Spotify Streams: {formatNumber(d.streams)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="songs" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-[10px] text-slate-400 text-center font-mono">
              Release Year Distribution across Top Streamed Tracks
            </div>
          </div>

          {/* Chart 2: Spotify Streams Accumulation over time */}
          <div className="p-6 rounded-2xl bg-[#0D1220] border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Cumulative Spotify Streams by Release Vintage</span>
                </h3>
                <span className="text-[11px] font-mono text-amber-300">Streaming Volume</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Older tracks (2016–2021) maintain massive aggregate streams, while 2023–2024 tracks exhibit explosive current velocity.
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={recentYearsData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="streamGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#475569" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <YAxis stroke="#475569" tickFormatter={(v) => formatNumber(v)} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="p-3 bg-[#0B0F19] border border-slate-700 rounded-xl text-xs space-y-1">
                            <p className="font-bold text-white">Year {d.year}</p>
                            <p className="text-amber-400 font-mono">Total Streams: {formatExactNumber(d.streams)}</p>
                            <p className="text-slate-400">Avg Popularity: {d.avgPopularity}/100</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="streams" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#streamGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-[10px] text-slate-400 text-center font-mono">
              Aggregate Playback Accumulation by Vintage Year
            </div>
          </div>

        </div>

        {/* Content Rating & Explicit Track Dynamics */}
        <div className="p-6 rounded-2xl bg-[#0D1220] border border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          <div className="lg:col-span-1 flex flex-col justify-center">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 inline-block w-fit mb-2">
              Content Rating Analysis
            </span>
            <h3 className="text-lg font-bold text-white mb-2">
              Explicit vs Clean Content Topology
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              35.9% of charting songs carry an Explicit advisory tag. However, non-explicit tracks account for <strong>63.6%</strong> of total Spotify playback volume, reflecting wider broadcast, retail, and editorial playlist suitability.
            </p>
            <div className="mt-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-emerald-400">Clean: {kpi.nonExplicitCount.toLocaleString()} songs</span>
                <span className="text-white">{formatNumber(kpi.nonExplicitStreams)} Streams</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-rose-400">Explicit: {kpi.explicitCount.toLocaleString()} songs</span>
                <span className="text-white">{formatNumber(kpi.explicitStreams)} Streams</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={explicitPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {explicitPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="p-3 bg-[#0B0F19] border border-slate-700 rounded-xl text-xs space-y-1">
                          <p className="font-bold text-white">{d.name}</p>
                          <p className="font-mono" style={{ color: d.color }}>Tracks: {d.value.toLocaleString()} ({((d.value/4600)*100).toFixed(1)}%)</p>
                          <p className="text-slate-300 font-mono">Streams: {formatNumber(d.streams)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value, entry) => <span className="text-xs text-slate-300 mr-4">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>
    </section>
  );
}
