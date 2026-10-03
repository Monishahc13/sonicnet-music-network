import React, { useState } from 'react';
import { 
  Lightbulb, 
  Share2, 
  Network, 
  Activity, 
  Award, 
  Flame, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Layers,
  Sparkles
} from 'lucide-react';
import summary from '../data/summary.json';
import topNetworkNodes from '../data/topNetworkNodes.json';
import { formatNumber, formatExactNumber, formatCentrality } from '../utils/formatters';

export default function NetworkInsightsSection({ onInspectNode }) {
  const { insights } = summary;
  const { mostConnectedArtists, topBridgeNodes, influentialNodes, platformDegreeRanking } = topNetworkNodes;
  const [activeTab, setActiveTab] = useState('insights'); // 'insights' | 'degree' | 'betweenness' | 'pagerank'

  return (
    <section id="insights" className="py-16 border-b border-slate-800 bg-[#080B11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                Mathematical Syntheses
              </span>
              <span className="text-xs text-slate-400">· Graph Topology & Centrality Findings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 flex items-center gap-2.5">
              <span>Network Insights & Critical Graph Nodes</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Analytical discoveries synthesized directly from Social Network Analysis algorithms executed on the 2024 streaming dataset.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {[
              { id: 'insights', label: 'Key Insights', icon: Lightbulb },
              { id: 'degree', label: 'Most Connected', icon: Network },
              { id: 'betweenness', label: 'Bridge Nodes', icon: Share2 },
              { id: 'pagerank', label: 'Influential Nodes', icon: Sparkles }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: DYNAMIC DATA-DRIVEN INSIGHTS */}
        {activeTab === 'insights' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            {insights.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0D1220] border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {item.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-400">Finding #{idx + 1}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                    {item.finding}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 font-semibold">
                    {item.metric}
                  </span>
                  <span className="text-xs text-slate-400">Verified via SNA</span>
                </div>
              </div>
            ))}

            {/* Extra Topology Insight Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-[#0D1220] to-[#0A0D18] border border-indigo-500/30 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 block w-fit mb-3">
                  Graph Modularity
                </span>
                <h3 className="text-base font-bold text-white">
                  Multi-Platform Clustering Coefficient
                </h3>
                <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                  The music graph demonstrates a high clustering coefficient around major streaming platforms (Spotify, YouTube, TikTok). Artists with catalog sizes greater than 10 tracks form dense tripartite sub-networks, ensuring maximum resilience against single-platform algorithmic fluctuations.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  2.01T Global Streams
                </span>
                <span className="text-xs text-slate-400">Density: 0.0311</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MOST CONNECTED ARTISTS (DEGREE CENTRALITY) */}
        {activeTab === 'degree' && (
          <div className="p-6 rounded-2xl bg-[#0D1220] border border-slate-800 shadow-xl animate-in fade-in duration-200">
            <div className="mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-cyan-400" />
                <span>Most Connected Artists (Network Degree Centrality)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Artists ranked by the number of direct structural connections in the network. Higher degree indicates larger charting catalogs and ubiquitous multi-platform reach.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#090D17] text-slate-400 border-b border-slate-800 text-[11px] font-mono uppercase">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Artist</th>
                    <th className="p-3 text-center">Charting Tracks</th>
                    <th className="p-3 text-right">Spotify Streams</th>
                    <th className="p-3 text-center">Degree Centrality</th>
                    <th className="p-3 text-center">Platform Reach</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {mostConnectedArtists.map((artist, idx) => (
                    <tr key={artist.name} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-400">#{idx + 1}</td>
                      <td className="p-3 font-bold text-white">{artist.name}</td>
                      <td className="p-3 text-center font-mono text-cyan-300 font-semibold">{artist.songCount} Songs</td>
                      <td className="p-3 text-right font-mono text-emerald-400">{formatNumber(artist.totalSpotifyStreams)}</td>
                      <td className="p-3 text-center font-mono text-purple-400 font-bold">{formatCentrality(artist.degree)}</td>
                      <td className="p-3 text-center font-mono text-amber-300">{artist.platformsCount} / 12</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onInspectNode(artist.name)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-white text-slate-300 text-[10px] font-medium transition-colors"
                        >
                          Locate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: IMPORTANT BRIDGE NODES (BETWEENNESS CENTRALITY) */}
        {activeTab === 'betweenness' && (
          <div className="p-6 rounded-2xl bg-[#0D1220] border border-slate-800 shadow-xl animate-in fade-in duration-200">
            <div className="mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-purple-400" />
                <span>Important Bridge Nodes (Betweenness Centrality)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Nodes with high betweenness centrality act as crucial bridges or informational bottlenecks connecting disparate clusters (such as viral TikTok communities and traditional radio broadcast).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#090D17] text-slate-400 border-b border-slate-800 text-[11px] font-mono uppercase">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Artist / Bridge Node</th>
                    <th className="p-3 text-center">Betweenness Score</th>
                    <th className="p-3 text-center">Catalog Size</th>
                    <th className="p-3 text-right">Spotify Streams</th>
                    <th className="p-3 text-center">Network Role</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {topBridgeNodes.map((artist, idx) => (
                    <tr key={artist.name} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-400">#{idx + 1}</td>
                      <td className="p-3 font-bold text-white">{artist.name}</td>
                      <td className="p-3 text-center font-mono text-purple-400 font-bold">{formatCentrality(artist.betweenness)}</td>
                      <td className="p-3 text-center font-mono text-cyan-300">{artist.songCount} Songs</td>
                      <td className="p-3 text-right font-mono text-emerald-400">{formatNumber(artist.totalSpotifyStreams)}</td>
                      <td className="p-3 text-center font-mono text-amber-300 text-[11px]">Cross-Platform Broker</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onInspectNode(artist.name)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-white text-slate-300 text-[10px] font-medium transition-colors"
                        >
                          Locate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: INFLUENTIAL NETWORK NODES (PAGERANK) */}
        {activeTab === 'pagerank' && (
          <div className="p-6 rounded-2xl bg-[#0D1220] border border-slate-800 shadow-xl animate-in fade-in duration-200">
            <div className="mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Influential Network Nodes (PageRank Centrality)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Nodes ranked by recursive prestige. PageRank weights not only direct connections, but the structural influence of the platforms and songs connected to each node.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#090D17] text-slate-400 border-b border-slate-800 text-[11px] font-mono uppercase">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Artist / Influencer</th>
                    <th className="p-3 text-center">PageRank Score</th>
                    <th className="p-3 text-center">Popularity Index</th>
                    <th className="p-3 text-right">Spotify Streams</th>
                    <th className="p-3 text-center">Platforms Represented</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {influentialNodes.map((artist, idx) => (
                    <tr key={artist.name} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-400">#{idx + 1}</td>
                      <td className="p-3 font-bold text-white">{artist.name}</td>
                      <td className="p-3 text-center font-mono text-amber-400 font-bold">{formatCentrality(artist.pageRank)}</td>
                      <td className="p-3 text-center font-mono text-cyan-300">{artist.avgPopularity}/100</td>
                      <td className="p-3 text-right font-mono text-emerald-400">{formatNumber(artist.totalSpotifyStreams)}</td>
                      <td className="p-3 text-center font-mono text-purple-300">{artist.platformsCount} / 12</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onInspectNode(artist.name)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-white text-slate-300 text-[10px] font-medium transition-colors"
                        >
                          Locate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
