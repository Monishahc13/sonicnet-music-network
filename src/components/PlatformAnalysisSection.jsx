import React, { useState } from 'react';
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
  Layers, 
  Radio, 
  Music, 
  Users, 
  Share2, 
  HelpCircle,
  TrendingUp,
  Disc,
  Info
} from 'lucide-react';
import platformStats from '../data/platformStats.json';
import platformOverlap from '../data/platformOverlap.json';
import { formatNumber, formatExactNumber } from '../utils/formatters';

export default function PlatformAnalysisSection() {
  const [selectedPlatform, setSelectedPlatform] = useState(platformStats[0]);
  const [overlapHover, setOverlapHover] = useState(null);

  // Platform reach data sorted by song coverage count
  const coverageData = [...platformStats]
    .sort((a, b) => b.connectedSongsCount - a.connectedSongsCount)
    .map(p => ({
      name: p.name,
      songs: p.connectedSongsCount,
      coveragePercent: parseFloat(p.coveragePercent),
      color: p.color,
      raw: p
    }));

  const platformNames = platformStats.map(p => p.name);

  return (
    <section id="platforms" className="py-16 border-b border-slate-800 bg-[#090D16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Cross-Platform Network Topology
              </span>
              <span className="text-xs text-slate-400">· 12 Distinct Channels Analyzed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
              Platform Distribution, Reach & Overlap Analysis
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Understand how music traverses streaming services, short-form viral video, audio fingerprinting, and terrestrial radio. Metrics are cleanly segmented by native units.
            </p>
          </div>
        </div>

        {/* Coverage Chart & Selected Platform Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          
          {/* Main Coverage Bar Chart (2 cols) */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0D1220] border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Platform Catalog Penetration (% of 4,600 Top Tracks Present)</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Dataset Coverage</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Shows the proportion of charting songs that have active, measurable engagement across each platform.
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={coverageData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 75, bottom: 5 }}
                >
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    stroke="#475569"
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#475569"
                    tick={{ fill: '#E2E8F0', fontSize: 11 }}
                    width={95}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="p-3 bg-[#0B0F19] border border-slate-700 rounded-xl shadow-xl text-xs space-y-1">
                            <p className="font-bold text-white text-sm">{d.name}</p>
                            <p className="text-cyan-400 font-mono">
                              Coverage: {d.coveragePercent}% ({d.songs.toLocaleString()} tracks)
                            </p>
                            <p className="text-slate-400">Unique Artists: <strong className="text-purple-300">{d.raw.connectedArtistsCount}</strong></p>
                            <p className="text-slate-400">Total Activity: <strong className="text-emerald-400">{formatNumber(d.raw.totalVolume)} {d.raw.unit}</strong></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="coveragePercent"
                    radius={[0, 6, 6, 0]}
                    onClick={(entry) => setSelectedPlatform(entry.raw)}
                    className="cursor-pointer"
                  >
                    {coverageData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={selectedPlatform?.name === entry.name ? 1 : 0.75}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Click any bar to inspect platform details</span>
              <span>100% = 4,600 Songs</span>
            </div>
          </div>

          {/* Selected Platform Detailed Card (1 col) */}
          <div className="p-6 rounded-2xl bg-[#0D1220] border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Platform Spotlight
                </span>
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedPlatform.color }} />
              </div>

              <h3 className="text-xl font-bold text-white mb-1">
                {selectedPlatform.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Primary Metric: <span className="text-amber-400 font-semibold">{selectedPlatform.metricName}</span>
              </p>

              <div className="mt-5 space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Connected Songs:</span>
                  <span className="font-bold text-white font-mono text-sm">
                    {formatExactNumber(selectedPlatform.connectedSongsCount)} ({selectedPlatform.coveragePercent}%)
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Connected Artists:</span>
                  <span className="font-bold text-purple-300 font-mono text-sm">
                    {formatExactNumber(selectedPlatform.connectedArtistsCount)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Aggregate Activity:</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">
                    {formatNumber(selectedPlatform.totalVolume)} {selectedPlatform.unit}
                  </span>
                </div>
              </div>

              {/* Top Charting Track on this Platform */}
              {selectedPlatform.topSong && (
                <div className="mt-5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Top Platform Performer
                  </span>
                  <p className="font-semibold text-white truncate">
                    "{selectedPlatform.topSong.track}"
                  </p>
                  <p className="text-slate-400 truncate">
                    by {selectedPlatform.topSong.artist}
                  </p>
                  <p className="mt-1 text-cyan-400 font-mono text-[11px] font-semibold">
                    {formatNumber(selectedPlatform.topSong.value)} {selectedPlatform.unit}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
              Most Connected Artist: <strong className="text-white">{selectedPlatform.topArtist}</strong>
            </div>
          </div>

        </div>

        {/* Platform Overlap Matrix (Heatmap Grid) */}
        <div className="p-6 rounded-2xl bg-[#0D1220] border border-slate-800 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-purple-400" />
                <span>Cross-Platform Song Overlap Co-occurrence Matrix (12 × 12)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Cell value represents how many songs share simultaneous presence on both Platform A (row) and Platform B (column).
              </p>
            </div>
            {overlapHover && (
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 animate-in fade-in">
                {overlapHover.p1} ↔ {overlapHover.p2}: <strong>{formatExactNumber(overlapHover.count)}</strong> shared songs
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <table className="text-center text-[10px] font-mono border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-left text-slate-400 text-[11px]">Platform</th>
                    {platformNames.map(p => (
                      <th key={p} className="p-1.5 text-slate-300 font-semibold max-w-[50px] truncate" title={p}>
                        {p.split(' ')[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {platformNames.map(p1 => (
                    <tr key={p1} className="border-t border-slate-800/60">
                      <td className="p-2 text-left font-medium text-slate-300 text-xs whitespace-nowrap">
                        {p1}
                      </td>
                      {platformNames.map(p2 => {
                        const count = platformOverlap[p1]?.[p2] || 0;
                        const ratio = count / 4600;
                        // Intensity
                        const bg = p1 === p2 
                          ? 'rgba(99, 102, 241, 0.4)' 
                          : ratio > 0.6 
                          ? 'rgba(6, 182, 212, 0.35)' 
                          : ratio > 0.3 
                          ? 'rgba(6, 182, 212, 0.2)' 
                          : ratio > 0.1 
                          ? 'rgba(6, 182, 212, 0.1)' 
                          : 'rgba(30, 41, 59, 0.3)';

                        return (
                          <td
                            key={p2}
                            onMouseEnter={() => setOverlapHover({ p1, p2, count })}
                            onMouseLeave={() => setOverlapHover(null)}
                            style={{ backgroundColor: bg }}
                            className="p-1.5 cursor-pointer hover:border hover:border-cyan-400 text-slate-200 transition-colors"
                          >
                            {count > 999 ? `${(count / 1000).toFixed(1)}k` : count}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
            <span>Color intensity reflects joint song co-occurrence strength</span>
            <span className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded bg-cyan-900/60" /> Low Overlap
              <span className="inline-block w-2.5 h-2.5 rounded bg-cyan-500/40" /> High Overlap
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
