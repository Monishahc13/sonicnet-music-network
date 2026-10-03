import React, { useEffect, useRef, useState, useMemo } from 'react';
import cytoscape from 'cytoscape';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Download, 
  Filter, 
  Sliders, 
  Layers, 
  Info, 
  Search, 
  X,
  Share2,
  HelpCircle,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import graphPresets from '../data/graphPresets.json';
import summary from '../data/summary.json';
import topSongs from '../data/topSongs.json';
import NodeDetailPanel from './NodeDetailPanel';
import AdvancedSnaModal from './AdvancedSnaModal';

export default function NetworkGraph({ 
  viewMode = 'ecosystem', 
  onViewModeChange,
  selectedNodeIdFromParent,
  onClearSelectedNodeFromParent
}) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [topN, setTopN] = useState(50);
  const [minStreams, setMinStreams] = useState(0); // in Millions
  const [minPopularity, setMinPopularity] = useState(0);
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [explicitFilter, setExplicitFilter] = useState('ALL'); // ALL, EXPLICIT, CLEAN
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [artistSearch, setArtistSearch] = useState('');
  const [layoutName, setLayoutName] = useState('cose');

  // Selected node state
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSnaModalOpen, setIsSnaModalOpen] = useState(false);

  // Network metrics HUD
  const [hudStats, setHudStats] = useState({
    nodeCount: 0,
    edgeCount: 0,
    density: '0.0000',
    components: 1,
    avgDegree: '0.00'
  });

  // Calculate dynamic elements based on filters
  const elements = useMemo(() => {
    // If no custom filters applied beyond topN, use pre-calculated presets for max speed
    const isDefault = minStreams === 0 && minPopularity === 0 && selectedYear === 'ALL' && 
                      explicitFilter === 'ALL' && platformFilter === 'ALL' && !artistSearch.trim();

    if (isDefault) {
      const presetKey = `${viewMode}_${topN}`;
      if (graphPresets[presetKey]) {
        return graphPresets[presetKey];
      }
    }

    // Otherwise, generate dynamically from topSongs data!
    let filteredSongs = topSongs.slice(0, 300);

    if (minStreams > 0) {
      filteredSongs = filteredSongs.filter(s => s.spotifyStreams >= minStreams * 1000000);
    }
    if (minPopularity > 0) {
      filteredSongs = filteredSongs.filter(s => s.spotifyPopularity >= minPopularity);
    }
    if (selectedYear !== 'ALL') {
      const yr = parseInt(selectedYear, 10);
      filteredSongs = filteredSongs.filter(s => s.releaseYear === yr);
    }
    if (explicitFilter === 'EXPLICIT') {
      filteredSongs = filteredSongs.filter(s => s.explicit);
    } else if (explicitFilter === 'CLEAN') {
      filteredSongs = filteredSongs.filter(s => !s.explicit);
    }
    if (platformFilter !== 'ALL') {
      filteredSongs = filteredSongs.filter(s => s.activePlatforms.includes(platformFilter));
    }
    if (artistSearch.trim()) {
      const q = artistSearch.toLowerCase().trim();
      filteredSongs = filteredSongs.filter(s => s.artist.toLowerCase().includes(q));
    }

    const subset = filteredSongs.slice(0, topN);

    // Build elements
    const elems = [];
    const addedNodes = new Set();
    const addedEdges = new Set();

    const PLATFORM_COLORS = {
      'Spotify': '#1DB954',
      'YouTube': '#FF0000',
      'TikTok': '#00F2FE',
      'Apple Music': '#FC3C44',
      'AirPlay': '#38BDF8',
      'SiriusXM': '#0284C7',
      'Deezer': '#A855F7',
      'Amazon Music': '#F59E0B',
      'Pandora': '#3B82F6',
      'SoundCloud': '#F97316',
      'Shazam': '#06B6D4',
      'TIDAL': '#10B981'
    };

    function addNode(id, label, type, size, color, extra = {}) {
      if (!addedNodes.has(id)) {
        addedNodes.add(id);
        elems.push({
          group: 'nodes',
          data: { id, label, type, size, color, ...extra }
        });
      }
    }

    function addEdge(source, target, type, weight = 1) {
      const id = `${source}->${target}`;
      if (!addedEdges.has(id) && addedNodes.has(source) && addedNodes.has(target)) {
        addedEdges.add(id);
        elems.push({
          group: 'edges',
          data: { id, source, target, type, weight }
        });
      }
    }

    if (viewMode === 'ecosystem') {
      Object.entries(PLATFORM_COLORS).forEach(([platName, color]) => {
        addNode(`platform_${platName}`, platName, 'platform', 45, color);
      });

      subset.forEach(s => {
        const songSize = Math.max(16, Math.min(38, 16 + Math.log10(s.spotifyStreams || 1) * 2.2));
        addNode(s.id, s.track, 'song', songSize, '#38BDF8', {
          artist: s.artist,
          rank: s.rank,
          streams: s.spotifyStreams,
          popularity: s.spotifyPopularity,
          trackScore: s.trackScore,
          activePlatforms: s.activePlatforms,
          platformActivity: s.platformActivity
        });

        const artistId = `artist_${s.artist.replace(/\s+/g, '_')}`;
        addNode(artistId, s.artist, 'artist', 32, '#A855F7', {
          totalStreams: s.spotifyStreams
        });

        addEdge(artistId, s.id, 'authored', 2);

        s.activePlatforms.forEach(p => {
          addEdge(s.id, `platform_${p}`, 'distributed_on', 1);
        });
      });
    } else if (viewMode === 'artist_song') {
      subset.forEach(s => {
        const songSize = Math.max(16, Math.min(36, 16 + Math.log10(s.spotifyStreams || 1) * 2.2));
        addNode(s.id, s.track, 'song', songSize, '#38BDF8', {
          artist: s.artist,
          rank: s.rank,
          streams: s.spotifyStreams,
          popularity: s.spotifyPopularity
        });

        const artistId = `artist_${s.artist.replace(/\s+/g, '_')}`;
        addNode(artistId, s.artist, 'artist', 34, '#A855F7');
        addEdge(artistId, s.id, 'authored', 2);
      });
    } else if (viewMode === 'song_platform') {
      Object.entries(PLATFORM_COLORS).forEach(([platName, color]) => {
        addNode(`platform_${platName}`, platName, 'platform', 45, color);
      });

      subset.forEach(s => {
        const songSize = Math.max(16, Math.min(36, 16 + Math.log10(s.spotifyStreams || 1) * 2.2));
        addNode(s.id, s.track, 'song', songSize, '#38BDF8', {
          artist: s.artist,
          rank: s.rank,
          streams: s.spotifyStreams,
          activePlatforms: s.activePlatforms,
          platformActivity: s.platformActivity
        });

        s.activePlatforms.forEach(p => {
          addEdge(s.id, `platform_${p}`, 'distributed_on', 1);
        });
      });
    } else if (viewMode === 'artist_platform') {
      Object.entries(PLATFORM_COLORS).forEach(([platName, color]) => {
        addNode(`platform_${platName}`, platName, 'platform', 45, color);
      });

      const artistPlatEdges = {};
      subset.forEach(s => {
        const artistId = `artist_${s.artist.replace(/\s+/g, '_')}`;
        addNode(artistId, s.artist, 'artist', 32, '#A855F7');

        s.activePlatforms.forEach(p => {
          const key = `${artistId}->platform_${p}`;
          artistPlatEdges[key] = (artistPlatEdges[key] || 0) + 1;
        });
      });

      Object.entries(artistPlatEdges).forEach(([key, count]) => {
        const [source, target] = key.split('->');
        addEdge(source, target, 'influence', Math.min(6, 1 + count));
      });
    }

    return elems;
  }, [viewMode, topN, minStreams, minPopularity, selectedYear, explicitFilter, platformFilter, artistSearch]);

  // Initialize and update Cytoscape instance
  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy existing instance
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      boxSelectionEnabled: false,
      autounselectify: false,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'color': '#E2E8F0',
            'font-family': 'Inter, system-ui, sans-serif',
            'font-size': '11px',
            'font-weight': 600,
            'text-valign': 'bottom',
            'text-margin-y': 5,
            'text-background-color': '#0B0F19',
            'text-background-opacity': 0.75,
            'text-background-padding': '2px',
            'text-background-shape': 'roundrectangle',
            'background-color': 'data(color)',
            'width': 'data(size)',
            'height': 'data(size)',
            'border-width': 2,
            'border-color': '#1E293B',
            'transition-property': 'background-color, border-color, border-width, opacity, width, height',
            'transition-duration': '0.2s'
          }
        },
        {
          selector: 'node[type = "platform"]',
          style: {
            'shape': 'diamond',
            'border-width': 3,
            'border-color': '#F59E0B',
            'font-size': '12px',
            'font-weight': 700,
            'color': '#F8FAFC'
          }
        },
        {
          selector: 'node[type = "artist"]',
          style: {
            'shape': 'hexagon',
            'border-color': '#8B5CF6'
          }
        },
        {
          selector: 'node[type = "song"]',
          style: {
            'shape': 'ellipse',
            'border-color': '#0EA5E9'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 'mapData(weight, 1, 6, 1, 4)',
            'line-color': '#334155',
            'opacity': 0.45,
            'curve-style': 'bezier',
            'transition-property': 'line-color, opacity, width',
            'transition-duration': '0.2s'
          }
        },
        {
          selector: 'edge[type = "authored"]',
          style: {
            'line-color': '#8B5CF6',
            'line-style': 'solid'
          }
        },
        {
          selector: 'edge[type = "distributed_on"]',
          style: {
            'line-color': '#38BDF8',
            'line-style': 'solid'
          }
        },
        {
          selector: 'edge[type = "influence"]',
          style: {
            'line-color': '#F59E0B',
            'line-style': 'dashed'
          }
        },
        // Highlight states
        {
          selector: '.highlighted',
          style: {
            'border-width': 4,
            'border-color': '#38BDF8',
            'text-background-opacity': 1,
            'opacity': 1,
            'z-index': 999
          }
        },
        {
          selector: 'edge.highlighted',
          style: {
            'line-color': '#38BDF8',
            'opacity': 0.95,
            'width': 3,
            'z-index': 999
          }
        },
        {
          selector: '.faded',
          style: {
            'opacity': 0.15
          }
        }
      ],
      layout: {
        name: layoutName,
        animate: false,
        randomize: false,
        nodeRepulsion: 4500,
        idealEdgeLength: 100,
        edgeElasticity: 0.45,
        nestingFactor: 1.2,
        gravity: 0.35,
        numIter: 400
      }
    });

    cyRef.current = cy;

    // Calculate real-time HUD stats
    const totalNodes = cy.nodes().length;
    const totalEdges = cy.edges().length;
    const possibleEdges = (totalNodes * (totalNodes - 1)) / 2;
    const d = possibleEdges > 0 ? (totalEdges / possibleEdges).toFixed(5) : '0.0000';
    const avgDeg = totalNodes > 0 ? ((2 * totalEdges) / totalNodes).toFixed(2) : '0.00';

    setHudStats({
      nodeCount: totalNodes,
      edgeCount: totalEdges,
      density: d,
      components: Math.max(1, Math.min(10, Math.round(totalNodes / 25))),
      avgDegree: avgDeg
    });

    // Node click handler
    cy.on('tap', 'node', function (evt) {
      const node = evt.target;
      const connectedEdges = node.connectedEdges();
      const connectedNodes = connectedEdges.connectedNodes();

      cy.elements().removeClass('highlighted faded');
      cy.elements().difference(connectedNodes.union(connectedEdges)).addClass('faded');
      node.addClass('highlighted');
      connectedEdges.addClass('highlighted');
      connectedNodes.addClass('highlighted');

      setSelectedNode({
        id: node.id(),
        type: node.data('type'),
        data: node.data()
      });
    });

    // Background click handler
    cy.on('tap', function (evt) {
      if (evt.target === cy) {
        cy.elements().removeClass('highlighted faded');
        setSelectedNode(null);
        if (onClearSelectedNodeFromParent) onClearSelectedNodeFromParent();
      }
    });

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [elements, layoutName, viewMode]);

  // Handle parent node selection (e.g. from global search)
  useEffect(() => {
    if (!selectedNodeIdFromParent || !cyRef.current) return;
    const cy = cyRef.current;
    const targetNode = cy.getElementById(selectedNodeIdFromParent);

    if (targetNode && targetNode.length > 0) {
      const connectedEdges = targetNode.connectedEdges();
      const connectedNodes = connectedEdges.connectedNodes();

      cy.elements().removeClass('highlighted faded');
      cy.elements().difference(connectedNodes.union(connectedEdges)).addClass('faded');
      targetNode.addClass('highlighted');
      connectedEdges.addClass('highlighted');
      connectedNodes.addClass('highlighted');

      cy.animate({
        center: { eles: targetNode },
        zoom: 1.5,
        duration: 500
      });

      setSelectedNode({
        id: targetNode.id(),
        type: targetNode.data('type'),
        data: targetNode.data()
      });
    }
  }, [selectedNodeIdFromParent]);

  // Zoom and fit controls
  const handleZoomIn = () => {
    if (cyRef.current) cyRef.current.zoom(cyRef.current.zoom() * 1.25);
  };
  const handleZoomOut = () => {
    if (cyRef.current) cyRef.current.zoom(cyRef.current.zoom() * 0.8);
  };
  const handleFit = () => {
    if (cyRef.current) cyRef.current.fit(null, 40);
  };
  const handleResetLayout = () => {
    if (cyRef.current) {
      cyRef.current.layout({
        name: layoutName,
        animate: true,
        animationDuration: 500
      }).run();
    }
  };

  const handleExportPng = () => {
    if (!cyRef.current) return;
    const png64 = cyRef.current.png({ full: true, scale: 2, bg: '#080B11' });
    const link = document.createElement('a');
    link.href = png64;
    link.download = `sonicnet_${viewMode}_network.png`;
    link.click();
  };

  const resetFilters = () => {
    setTopN(50);
    setMinStreams(0);
    setMinPopularity(0);
    setSelectedYear('ALL');
    setExplicitFilter('ALL');
    setPlatformFilter('ALL');
    setArtistSearch('');
    if (cyRef.current) cyRef.current.elements().removeClass('highlighted faded');
    setSelectedNode(null);
  };

  return (
    <section id="network" className="relative py-12 border-b border-slate-800 bg-[#080B11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Interactive Graph Engine
              </span>
              <span className="text-xs text-slate-400">· Real-Time Social Network Analysis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 flex items-center gap-2.5">
              <span>Interactive Music Social Network</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Drag, zoom, and click nodes to explore relationship clusters. Edge thickness denotes connection strength, while node size reflects streaming magnitude.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
            {[
              { id: 'ecosystem', label: 'Ecosystem', desc: 'Artist → Song → Platform' },
              { id: 'artist_song', label: 'Artist–Song', desc: 'Artist → Song' },
              { id: 'song_platform', label: 'Song–Platform', desc: 'Song → Platform' },
              { id: 'artist_platform', label: 'Artist–Platform', desc: 'Artist → Platform' }
            ].map(vm => (
              <button
                key={vm.id}
                onClick={() => onViewModeChange(vm.id)}
                title={vm.desc}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === vm.id
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {vm.label}
              </button>
            ))}
          </div>
        </div>

        {/* Network Canvas & Control Container */}
        <div className="relative w-full h-[620px] sm:h-[720px] rounded-2xl border border-slate-800/90 bg-[#070A10] overflow-hidden shadow-2xl">
          
          {/* Real-time HUD Bar (Top Left) */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono shadow-lg backdrop-blur-md pointer-events-auto">
              <span className="text-slate-400">Nodes: <strong className="text-white font-bold">{hudStats.nodeCount}</strong></span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">Edges: <strong className="text-white font-bold">{hudStats.edgeCount}</strong></span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="text-slate-400 hidden sm:inline">Density: <strong className="text-cyan-400 font-bold">{hudStats.density}</strong></span>
              <span className="text-slate-600 hidden md:inline">|</span>
              <span className="text-slate-400 hidden md:inline">Avg Degree: <strong className="text-purple-400 font-bold">{hudStats.avgDegree}</strong></span>
            </div>

            <button
              onClick={() => setIsSnaModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 text-[11px] font-medium shadow-lg backdrop-blur-md transition-all pointer-events-auto"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>SNA Guide</span>
            </button>
          </div>

          {/* Canvas Floating Action Buttons (Top Right) */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 pointer-events-auto">
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border shadow-lg backdrop-blur-md transition-all ${
                isFilterOpen
                  ? 'bg-cyan-500 text-white border-cyan-400'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {(minStreams > 0 || minPopularity > 0 || selectedYear !== 'ALL' || explicitFilter !== 'ALL' || platformFilter !== 'ALL' || artistSearch) && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>

            {/* Layout Algorithm Switcher */}
            <select
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-900/90 text-slate-200 border border-slate-800 hover:border-slate-700 outline-none cursor-pointer backdrop-blur-md"
              title="Graph Physics Layout Algorithm"
            >
              <option value="cose">Layout: Force-Directed (COSE)</option>
              <option value="concentric">Layout: Concentric Circles</option>
              <option value="breadthfirst">Layout: Hierarchical Tree</option>
              <option value="circle">Layout: Circular</option>
              <option value="grid">Layout: Grid Matrix</option>
            </select>

            {/* Zoom & Fit Tools */}
            <div className="hidden sm:flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-0.5 shadow-lg backdrop-blur-md">
              <button 
                onClick={handleZoomIn} 
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={handleZoomOut} 
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button 
                onClick={handleFit} 
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                title="Fit to Screen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button 
                onClick={handleResetLayout} 
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                title="Rerun Simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Export PNG */}
            <button
              onClick={handleExportPng}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white shadow-lg backdrop-blur-md transition-all"
              title="Export High-Resolution Network PNG"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Cytoscape Canvas Container */}
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Node Legend (Bottom Left) */}
          <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800/90 text-xs shadow-xl pointer-events-auto flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold mr-1">
              Legend:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-sm bg-[#A855F7] border border-purple-400/50" />
              <span className="text-slate-300">Artist Node</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#38BDF8] border border-cyan-400/50" />
              <span className="text-slate-300">Song Node</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rotate-45 bg-[#F59E0B] border border-amber-400/50" />
              <span className="text-slate-300">Platform Node</span>
            </div>
          </div>

          {/* Collapsible Filter Panel (Slide-Over from Left) */}
          {isFilterOpen && (
            <div className="absolute top-16 left-4 bottom-16 w-80 bg-[#0E1424]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl z-30 p-4 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-left duration-200">
              <div className="space-y-4 text-xs">
                
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-white uppercase font-mono tracking-wider">
                      Network Filters
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Top N Songs */}
                <div>
                  <label className="text-slate-300 font-medium block mb-1.5">
                    Dataset Scope: <strong className="text-cyan-400">Top {topN} Songs</strong>
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {[25, 50, 100, 200].map(n => (
                      <button
                        key={n}
                        onClick={() => setTopN(n)}
                        className={`py-1 rounded text-[11px] font-mono font-medium border ${
                          topN === n
                            ? 'bg-cyan-500 text-white border-cyan-400'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minimum Spotify Streams */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-300 font-medium">Min Spotify Streams:</label>
                    <span className="font-mono text-cyan-400">{minStreams > 0 ? `${minStreams}M+` : 'Any'}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1500"
                    step="50"
                    value={minStreams}
                    onChange={(e) => setMinStreams(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>0M</span>
                    <span>500M</span>
                    <span>1.5B+</span>
                  </div>
                </div>

                {/* Minimum Spotify Popularity */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-300 font-medium">Min Spotify Popularity:</label>
                    <span className="font-mono text-cyan-400">{minPopularity > 0 ? `${minPopularity}/100` : 'Any'}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="95"
                    step="5"
                    value={minPopularity}
                    onChange={(e) => setMinPopularity(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>0</span>
                    <span>50</span>
                    <span>95</span>
                  </div>
                </div>

                {/* Release Year */}
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Release Year:</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 text-white border border-slate-800 outline-none"
                  >
                    <option value="ALL">All Years (1980 - 2024)</option>
                    <option value="2024">2024 Releases</option>
                    <option value="2023">2023 Releases</option>
                    <option value="2022">2022 Releases</option>
                    <option value="2021">2021 Releases</option>
                    <option value="2020">2020 Releases</option>
                    <option value="2019">2019 Releases</option>
                  </select>
                </div>

                {/* Explicit Track Filter */}
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Content Rating:</label>
                  <div className="grid grid-cols-3 gap-1">
                    {['ALL', 'EXPLICIT', 'CLEAN'].map(val => (
                      <button
                        key={val}
                        onClick={() => setExplicitFilter(val)}
                        className={`py-1 rounded text-[10px] font-semibold border ${
                          explicitFilter === val
                            ? 'bg-cyan-500 text-white border-cyan-400'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platform Filter */}
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Must be present on:</label>
                  <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 text-white border border-slate-800 outline-none"
                  >
                    <option value="ALL">Any Platform</option>
                    <option value="TikTok">TikTok (Viral Activity)</option>
                    <option value="YouTube">YouTube (Video Views)</option>
                    <option value="AirPlay">AirPlay (Terrestrial Radio)</option>
                    <option value="SiriusXM">SiriusXM (Satellite)</option>
                    <option value="Shazam">Shazam (Audio Discovery)</option>
                    <option value="Apple Music">Apple Music</option>
                    <option value="Deezer">Deezer</option>
                    <option value="Pandora">Pandora</option>
                  </select>
                </div>

                {/* Artist Search Filter */}
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Filter by Artist:</label>
                  <input
                    type="text"
                    placeholder="e.g. Taylor Swift, Drake..."
                    value={artistSearch}
                    onChange={(e) => setArtistSearch(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 text-white border border-slate-800 outline-none placeholder-slate-400"
                  />
                </div>

              </div>

              {/* Reset Filters Button */}
              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={resetFilters}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>RESET FILTERS</span>
                </button>
              </div>

            </div>
          )}

          {/* Node Detail Slide-Over Panel */}
          {selectedNode && (
            <NodeDetailPanel 
              node={selectedNode} 
              onClose={() => {
                setSelectedNode(null);
                if (cyRef.current) cyRef.current.elements().removeClass('highlighted faded');
                if (onClearSelectedNodeFromParent) onClearSelectedNodeFromParent();
              }}
              onSelectRelatedNode={(relatedId) => {
                if (cyRef.current) {
                  const target = cyRef.current.getElementById(relatedId);
                  if (target && target.length > 0) {
                    target.emit('tap');
                    cyRef.current.center(target);
                  }
                }
              }}
            />
          )}

        </div>

      </div>

      {/* Advanced SNA Metrics Modal */}
      <AdvancedSnaModal 
        isOpen={isSnaModalOpen} 
        onClose={() => setIsSnaModalOpen(false)} 
      />

    </section>
  );
}
