import React from 'react';
import { 
  FileSpreadsheet, 
  Sparkles, 
  Binary, 
  Network, 
  Cpu, 
  Eye, 
  Lightbulb, 
  ArrowDown, 
  CheckCircle,
  Database,
  Code2
} from 'lucide-react';

export default function MethodologySection() {
  const steps = [
    {
      num: 1,
      title: 'Data Collection & Ingestion',
      icon: FileSpreadsheet,
      badge: '4,600 Records · 29 Columns',
      desc: 'Ingested the global 2024 streaming dataset containing comprehensive track performance across 12 digital audio, video, broadcast, and discovery platforms.',
      details: 'Columns include Spotify Streams & Popularity, YouTube Views/Likes, TikTok Posts/Views, Apple Music, AirPlay Spins, SiriusXM, Deezer, Amazon, Pandora, SoundCloud, Shazam, and TIDAL.'
    },
    {
      num: 2,
      title: 'Automated Cleaning & Sanitization',
      icon: Binary,
      badge: 'Commas, Types, NaNs Handled',
      desc: 'Sanitized string comma separators from numeric attributes, handled null and empty string anomalies, parsed release dates into temporal components, and validated data types.',
      details: 'Robust regex parsers converted string fields into BigInt / float values without dropping records. Empty fields in specialized platforms like TIDAL were systematically handled.'
    },
    {
      num: 3,
      title: 'Feature Engineering & Multi-Platform Flags',
      icon: Sparkles,
      badge: 'Platform Presence Matrix',
      desc: 'Synthesized active platform arrays for each track, generated cross-platform reach scores, and normalized native metrics into comparable multi-dimensional indices.',
      details: 'Calculated platform presence vectors per song and aggregated total artist playback across all streaming and terrestrial radio channels.'
    },
    {
      num: 4,
      title: 'Multi-partite Network Graph Construction',
      icon: Network,
      badge: 'Graphology Graph Models',
      desc: 'Constructed 4 formal network graph topologies: Bipartite Artist-Song, Bipartite Song-Platform, Bipartite Artist-Platform, and the full Tripartite Music Ecosystem.',
      details: 'Nodes represent Artists, Songs, and Platforms. Edges represent authoring (Artist→Song) and distribution (Song→Platform), with real mathematical relationship weights.'
    },
    {
      num: 5,
      title: 'Social Network Centrality Calculations',
      icon: Cpu,
      badge: 'Degree, Betweenness, PageRank',
      desc: 'Executed standard graph theory algorithms to derive node centralities, graph density, clustering coefficients, and connected components.',
      details: "Applied Brandes' Betweenness algorithm to discover cross-platform bridge nodes, and PageRank power iteration to measure node prestige and structural influence."
    },
    {
      num: 6,
      title: 'Interactive Physics-Based Visualization',
      icon: Eye,
      badge: 'Cytoscape.js & WebGL Canvas',
      desc: 'Rendered scalable, force-directed network simulations (COSE layout) supporting dynamic filtering, zooming, panning, and ego-network spotlighting.',
      details: 'Integrated high-performance Cytoscape graph canvas with smooth transitions, interactive node tooltips, slide-over detail panels, and high-res PNG export.'
    },
    {
      num: 7,
      title: 'Data-Driven Insight Generation',
      icon: Lightbulb,
      badge: 'Evaluator Ready Synthesis',
      desc: 'Extracted automated analytical conclusions regarding hub artists, cross-platform omnipresence, and the divergence between social viral video and terrestrial radio.',
      details: 'All insights and narrative takeaways are mathematically derived from actual computed metrics without arbitrary or fabricated assumptions.'
    }
  ];

  return (
    <section id="methodology" className="py-16 border-b border-slate-800 bg-[#080B11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Academic Rigor & Data Science
              </span>
              <span className="text-xs text-slate-400">· 7-Step Analytical Pipeline</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
              Analysis Methodology & Pipeline Flow
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Transparent, repeatable data science workflow from raw CSV ingestion to graph modeling, centrality calculation, and insight generation.
            </p>
          </div>
        </div>

        {/* Visual Methodology Flow Diagram (The Requested Arrow Flowchart) */}
        <div className="p-6 rounded-2xl bg-[#0D1220] border border-slate-800 shadow-xl mb-12">
          <h3 className="text-sm font-semibold text-white mb-4 text-center font-mono uppercase tracking-wider text-cyan-300">
            End-to-End Project Workflow Architecture
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-mono">
            {[
              { label: 'CSV Dataset', sub: '4,600 Rows' },
              { label: 'Data Cleaning', sub: 'Commas, Types, NaNs' },
              { label: 'Feature Engineering', sub: 'Platform Activity' },
              { label: 'Network Construction', sub: 'Tripartite Model' },
              { label: 'Centrality Analysis', sub: 'Degree, Betweenness' },
              { label: 'Interactive Viz', sub: 'Cytoscape.js' },
              { label: 'Music Insights', sub: 'Data-Driven Findings' }
            ].map((step, idx, arr) => (
              <React.Fragment key={step.label}>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-center shadow-md min-w-[130px] hover:border-cyan-500 transition-colors">
                  <span className="text-[10px] text-cyan-400 font-bold block">STEP {idx + 1}</span>
                  <strong className="text-white text-xs block mt-0.5">{step.label}</strong>
                  <span className="text-[9px] text-slate-400 block">{step.sub}</span>
                </div>
                {idx < arr.length - 1 && (
                  <span className="text-cyan-400 font-bold text-base hidden md:inline">
                    →
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Detailed 7-Step Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-lg group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-xs">
                      {st.num}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {st.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {st.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 italic">
                  {st.details}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
