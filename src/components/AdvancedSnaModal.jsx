import React from 'react';
import { X, Network, Share2, Activity, HelpCircle, Layers } from 'lucide-react';

export default function AdvancedSnaModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const metrics = [
    {
      title: 'Degree Centrality',
      badge: 'Connectivity Metric',
      color: 'border-cyan-500/40 text-cyan-400',
      simple: 'Shows how strongly a node is directly connected to other nodes in the network.',
      inSonicNet: 'Artists with high degree have larger song repertoires. Platforms have the highest degree because thousands of songs distribute through them.',
      formula: 'C_D(v) = deg(v) / (N - 1)'
    },
    {
      title: 'Betweenness Centrality',
      badge: 'Brokerage / Bridge Metric',
      color: 'border-purple-500/40 text-purple-400',
      simple: 'Shows nodes that act as important bridges or intermediaries between different parts of the network.',
      inSonicNet: 'Identifies artists whose catalogs cross multiple isolated genres or distribution mediums (e.g. bridging radio broadcast and viral social platforms).',
      formula: 'C_B(v) = \\sum_{s \\neq v \\neq t} \\frac{\\sigma_{st}(v)}{\\sigma_{st}}'
    },
    {
      title: 'Closeness Centrality',
      badge: 'Efficiency / Proximity Metric',
      color: 'border-emerald-500/40 text-emerald-400',
      simple: 'Measures how close a node is to all other nodes on average via the shortest paths.',
      inSonicNet: 'Nodes with high closeness can diffuse trends or reach the entire network with minimal intermediary hops.',
      formula: 'C_C(v) = \\frac{N - 1}{\\sum_{u \\neq v} d(v, u)}'
    },
    {
      title: 'PageRank & Eigenvector Centrality',
      badge: 'Prestige & Influence Metric',
      color: 'border-amber-500/40 text-amber-400',
      simple: 'Measures not just how many connections a node has, but the importance and prestige of the connected nodes.',
      inSonicNet: 'A song connected to high-reach platforms and influential artists gains a higher PageRank score than one connected to marginal platforms.',
      formula: 'PR(u) = \\frac{1-d}{N} + d \\sum_{v \\in B_u} \\frac{PR(v)}{L(v)}'
    },
    {
      title: 'Network Density & Connected Components',
      badge: 'Topology Metrics',
      color: 'border-rose-500/40 text-rose-400',
      simple: 'Density measures how close the network is to being fully interconnected (ratio of actual edges to possible edges). Connected components represent disconnected subgraphs.',
      inSonicNet: 'The Music Ecosystem has a dense core connected to platforms, with a few disconnected acoustic or regional single-platform clusters.',
      formula: 'Density = \\frac{2 \\times |E|}{|V|(|V| - 1)}'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-[#0D1322] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Social Network Analysis (SNA) Metrics Guide
              </h3>
              <p className="text-xs text-slate-400">
                Intuitive explanations and mathematical definitions for academic evaluation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 divide-y divide-slate-800/80 text-slate-200">
          {metrics.map((m, idx) => (
            <div key={idx} className={idx > 0 ? 'pt-5' : ''}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full bg-cyan-400`} />
                  {m.title}
                </h4>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border bg-slate-900 ${m.color}`}>
                  {m.badge}
                </span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl space-y-2 text-xs">
                <p className="text-slate-300">
                  <strong className="text-cyan-300 font-medium">Simple Meaning:</strong> "{m.simple}"
                </p>
                <p className="text-slate-400">
                  <strong className="text-purple-300 font-medium">In Music Ecosystem:</strong> {m.inSonicNet}
                </p>
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Standard Formula:</span>
                  <code className="text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {m.formula}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-colors"
          >
            Got it, return to Network
          </button>
        </div>

      </div>
    </div>
  );
}
