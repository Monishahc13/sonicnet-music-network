import React from 'react';
import { Network, Database, Sparkles, Download, Layers, ShieldCheck, Heart } from 'lucide-react';
import summary from '../data/summary.json';

export default function Footer({ onOpenPresentation, onJumpToSection }) {
  const handleDownloadSummary = () => {
    const reportData = {
      project: 'SONICNET – Global Music Social Network Analytics',
      generatedDate: new Date().toISOString(),
      dataset: 'Most Streamed Spotify Songs 2024.csv',
      summary: summary.kpi,
      viewsSummary: summary.viewsSummary,
      insights: summary.insights
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sonicnet_sna_executive_summary.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <footer className="bg-[#06080E] border-t border-slate-800 text-xs text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white">
                <Network className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold text-white tracking-wider">
                SONICNET
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A comprehensive college-level Social Network Analysis & Music Data Analytics project. 
              Discovering how 4,600 charting songs, 2,000 artists, and 12 digital platforms connect to shape global music popularity in 2024.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-cyan-400 font-mono">
                React 18
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-purple-400 font-mono">
                Cytoscape.js
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-emerald-400 font-mono">
                Graphology SNA
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-amber-400 font-mono">
                Recharts
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-blue-400 font-mono">
                Tailwind CSS
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase font-mono tracking-wider mb-3">
              Application Sections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onJumpToSection('overview')} className="hover:text-cyan-400 transition-colors">
                  Overview & KPIs
                </button>
              </li>
              <li>
                <button onClick={() => onJumpToSection('network')} className="hover:text-cyan-400 transition-colors">
                  Interactive Music Network
                </button>
              </li>
              <li>
                <button onClick={() => onJumpToSection('artists')} className="hover:text-cyan-400 transition-colors">
                  Top Artists Analytics
                </button>
              </li>
              <li>
                <button onClick={() => onJumpToSection('songs')} className="hover:text-cyan-400 transition-colors">
                  Top Songs Catalog Table
                </button>
              </li>
              <li>
                <button onClick={() => onJumpToSection('platforms')} className="hover:text-cyan-400 transition-colors">
                  Platform Distribution & Overlap
                </button>
              </li>
              <li>
                <button onClick={() => onJumpToSection('footprint')} className="hover:text-cyan-400 transition-colors">
                  Where Does Music Travel?
                </button>
              </li>
            </ul>
          </div>

          {/* Presentation & Exports */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase font-mono tracking-wider mb-3">
              Evaluator Resources
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={onOpenPresentation}
                  className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Launch Presentation Deck</span>
                </button>
              </li>
              <li>
                <button
                  onClick={handleDownloadSummary}
                  className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Executive SNA Summary (JSON)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onJumpToSection('methodology')} className="hover:text-purple-400 transition-colors">
                  7-Step Data Science Methodology
                </button>
              </li>
              <li>
                <button onClick={() => onJumpToSection('insights')} className="hover:text-purple-400 transition-colors">
                  Mathematical Centrality Formulations
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>
            SONICNET · College Social Network Analysis (SNA) Project Demonstration · Dataset: Most Streamed Spotify Songs 2024
          </p>
          <p className="flex items-center gap-1">
            <span>Built with precision & graph theory</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
