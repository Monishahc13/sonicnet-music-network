import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Presentation, 
  Network, 
  Database, 
  Layers, 
  Cpu, 
  Award, 
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import summary from '../data/summary.json';
import { formatNumber, formatExactNumber } from '../utils/formatters';

export default function PresentationModal({ isOpen, onClose, onJumpToSection }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      step: '1. PROBLEM STATEMENT',
      title: 'How Do Songs, Artists & Platforms Interconnect?',
      subtitle: 'The Motivation Behind SONICNET',
      icon: Network,
      color: 'text-cyan-400',
      badge: 'Research Objective',
      content: (
        <div className="space-y-4 text-sm text-slate-300">
          <p className="leading-relaxed">
            In modern digital music, popularity is no longer driven by a single radio broadcast chart. Instead, songs diffuse dynamically across <strong>streaming platforms</strong> (Spotify, Apple Music), <strong>viral video engines</strong> (TikTok, YouTube), and <strong>audio discovery apps</strong> (Shazam).
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <strong className="text-white block text-sm">Key Research Questions:</strong>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>How do artist repertoires form structural hubs in digital distribution?</li>
              <li>Which artists serve as bridges connecting disparate streaming and broadcast channels?</li>
              <li>What percentage of global hits achieve true cross-platform omnipresence?</li>
            </ul>
          </div>
          <p className="text-xs text-slate-400">
            SONICNET applies formal <strong>Social Network Analysis (SNA)</strong> to decode these structural connections rather than treating music as static tabular data.
          </p>
        </div>
      )
    },
    {
      step: '2. DATASET PROFILE',
      title: 'Global Streaming Ecosystem (2024)',
      subtitle: '4,600 Top Charting Tracks & 12 Digital Channels',
      icon: Database,
      color: 'text-purple-400',
      badge: 'Data Foundation',
      content: (
        <div className="space-y-4 text-sm text-slate-300">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">TOTAL TRACKS</span>
              <span className="text-lg font-bold text-cyan-400">4,600</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">UNIQUE ARTISTS</span>
              <span className="text-lg font-bold text-purple-400">2,000</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">SPOTIFY STREAMS</span>
              <span className="text-lg font-bold text-emerald-400">2.01 Trillion</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The dataset spans 29 discrete attributes across 12 distinct platforms: Spotify, YouTube, TikTok, Apple Music, AirPlay, SiriusXM, Deezer, Amazon Music, Pandora, SoundCloud, Shazam, and TIDAL.
          </p>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            <strong className="text-white block mb-1">Preprocessing Handled:</strong>
            Regex sanitization of commas inside numbers, date extraction (1980–2024), missing specialized metric imputation, and boolean explicit tagging.
          </div>
        </div>
      )
    },
    {
      step: '3. NETWORK CONSTRUCTION',
      title: 'Multi-Partite Graph Architecture',
      subtitle: 'From Tabular Rows to Graph Topologies',
      icon: Layers,
      color: 'text-emerald-400',
      badge: 'Graph Modeling',
      content: (
        <div className="space-y-4 text-sm text-slate-300">
          <p className="text-xs text-slate-300 leading-relaxed">
            We model music distribution as an interconnected multi-partite network with three distinct node classes:
          </p>
          <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <strong className="text-purple-300 block">ARTISTS</strong>
              <span className="text-[10px] text-slate-400">Hexagonal Nodes</span>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <strong className="text-cyan-300 block">SONGS</strong>
              <span className="text-[10px] text-slate-400">Circular Nodes</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <strong className="text-amber-300 block">PLATFORMS</strong>
              <span className="text-[10px] text-slate-400">Diamond Nodes</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-slate-400">Artist → Song:</span> <strong className="text-white font-mono">Authored Relationship</strong></div>
            <div className="flex justify-between"><span className="text-slate-400">Song → Platform:</span> <strong className="text-cyan-300 font-mono">Measurable Distribution Edge</strong></div>
            <div className="flex justify-between"><span className="text-slate-400">Artist → Platform:</span> <strong className="text-amber-300 font-mono">Aggregated Influence Projection</strong></div>
          </div>
        </div>
      )
    },
    {
      step: '4. SOCIAL NETWORK ANALYSIS',
      title: 'Centrality Metrics & Mathematical Formulations',
      subtitle: 'Quantifying Structural Connectivity',
      icon: Cpu,
      color: 'text-amber-400',
      badge: 'SNA Metrics',
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex justify-between items-center">
              <strong className="text-cyan-300">Degree Centrality (Connectivity):</strong>
              <span className="font-mono text-slate-400">C_D(v)</span>
            </div>
            <p className="text-slate-400 text-[11px]">Identifies major hubs with wide catalogs (Drake, Taylor Swift, Bad Bunny) and primary distribution channels.</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex justify-between items-center">
              <strong className="text-purple-300">Betweenness Centrality (Bridge Nodes):</strong>
              <span className="font-mono text-slate-400">C_B(v)</span>
            </div>
            <p className="text-slate-400 text-[11px]">Calculated via Brandes' algorithm to pinpoint artists whose songs link viral social channels to broadcast radio.</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex justify-between items-center">
              <strong className="text-amber-300">PageRank Centrality (Influence):</strong>
              <span className="font-mono text-slate-400">PR(v)</span>
            </div>
            <p className="text-slate-400 text-[11px]">Measures prestige derived from connections to high-reach, highly authoritative platforms.</p>
          </div>
        </div>
      )
    },
    {
      step: '5. RESULTS & DISCOVERIES',
      title: 'Key Academic Findings',
      subtitle: 'What the 2024 Network Reveals',
      icon: Award,
      color: 'text-rose-400',
      badge: 'Empirical Findings',
      content: (
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Cross-Platform Omnipresence:</strong>
              <p className="text-slate-400 mt-0.5">Over 70% of top tracks appear across 8 or more platforms simultaneously, proving synchronized global distribution.</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">TikTok Viral vs AirPlay Radio Disconnect:</strong>
              <p className="text-slate-400 mt-0.5">Tracks with multi-billion TikTok view counts often show low AirPlay spins, revealing two divergent promotion pathways.</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">The Power of Catalog Depth:</strong>
              <p className="text-slate-400 mt-0.5">Artists with &gt;20 charting tracks act as structural anchors in the network, maintaining high eigenvector influence regardless of single-track churn.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, slides.length, onClose]);

  if (!isOpen) return null;

  const current = slides[currentSlide];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0D1322] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Presentation Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                College Project Presentation Mode
              </span>
              <h3 className="text-base font-bold text-white">
                SONICNET: Music Social Network Analytics
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slide Body */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto flex flex-col justify-between space-y-6">
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                {current.step}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {current.badge}
              </span>
            </div>

            <div className="flex items-start gap-3 mt-1 mb-4">
              <div className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 ${current.color} flex-shrink-0 mt-1`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {current.title}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {current.subtitle}
                </p>
              </div>
            </div>

            {/* Slide Interactive Content */}
            <div className="mt-4">
              {current.content}
            </div>
          </div>

        </div>

        {/* Presentation Footer & Controls */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx 
                    ? 'w-6 bg-cyan-400' 
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Slide ${idx + 1}`}
              />
            ))}
            <span className="text-[11px] font-mono text-slate-400 ml-2">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              disabled={currentSlide === 0}
              onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            {currentSlide < slides.length - 1 ? (
              <button
                onClick={() => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1))}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onJumpToSection('network');
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                <span>Launch Interactive Network</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
