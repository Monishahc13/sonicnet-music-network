import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, 
  BarChart3, 
  Music, 
  Layers, 
  TrendingUp, 
  Lightbulb, 
  BookOpen, 
  Presentation, 
  Search, 
  X, 
  Radio, 
  Compass, 
  Menu,
  Sparkles
} from 'lucide-react';
import searchIndex from '../data/searchIndex.json';
import platformStats from '../data/platformStats.json';

export default function Navbar({ 
  activeSection, 
  setActiveSection, 
  onSelectSearchResult, 
  onOpenPresentation 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);

  // Global search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();

    // Search platforms
    const matchedPlatforms = platformStats
      .filter(p => p.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map(p => ({
        type: 'platform',
        id: `platform_${p.name}`,
        name: p.name,
        subtitle: `${p.connectedSongsCount} connected songs`
      }));

    // Search artists (unique)
    const matchedArtists = [];
    const seenArtists = new Set();
    for (const item of searchIndex) {
      if (item.artist && item.artist.toLowerCase().includes(q) && !seenArtists.has(item.artist)) {
        seenArtists.add(item.artist);
        matchedArtists.push({
          type: 'artist',
          id: `artist_${item.artist.replace(/\s+/g, '_')}`,
          name: item.artist,
          subtitle: `Artist · Charted Tracks`
        });
        if (matchedArtists.length >= 4) break;
      }
    }

    // Search songs
    const matchedSongs = [];
    for (const item of searchIndex) {
      if (item.track && item.track.toLowerCase().includes(q)) {
        matchedSongs.push({
          type: 'song',
          id: item.id,
          name: item.track,
          artist: item.artist,
          subtitle: `Rank #${item.rank} · ${item.artist}`
        });
        if (matchedSongs.length >= 5) break;
      }
    }

    setSearchResults([...matchedPlatforms, ...matchedArtists, ...matchedSongs]);
  }, [searchQuery]);

  // Click outside listener for search results
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'network', label: 'Music Network', icon: Network, highlight: true },
    { id: 'artists', label: 'Top Artists', icon: BarChart3 },
    { id: 'songs', label: 'Top Songs', icon: Music },
    { id: 'platforms', label: 'Platforms', icon: Layers },
    { id: 'footprint', label: 'Footprint', icon: Radio },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'insights', label: 'SNA Insights', icon: Lightbulb },
    { id: 'explorers', label: 'Explorers', icon: Sparkles },
    { id: 'methodology', label: 'Methodology', icon: BookOpen }
  ];

  const handleNavClick = (id) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectResult = (item) => {
    onSelectSearchResult(item);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
            onClick={() => handleNavClick('overview')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
                <Network className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-wider bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                  SONICNET
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
                MUSIC SOCIAL NETWORK ANALYTICS
              </p>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : link.highlight
                      ? 'text-cyan-400 hover:bg-slate-800/60'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            
            {/* Global Search Bar */}
            <div className="relative" ref={searchRef}>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search artist, song, platform..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="w-44 md:w-60 lg:w-72 pl-9 pr-8 py-1.5 bg-slate-900/90 text-xs text-white placeholder-slate-400 rounded-lg border border-slate-700/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all shadow-inner"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Search Dropdown */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0F1626] border border-slate-700/90 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 bg-slate-900/80 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Search Results ({searchResults.length})
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/50">
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectResult(item)}
                        className="px-3 py-2.5 hover:bg-slate-800/70 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            item.type === 'platform' ? 'bg-amber-400' :
                            item.type === 'artist' ? 'bg-purple-400' : 'bg-cyan-400'
                          }`} />
                          <div className="truncate text-left">
                            <p className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 truncate">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 capitalize border border-slate-700/60">
                          {item.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Presentation Mode Button */}
            <button
              onClick={onOpenPresentation}
              className="relative inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-95 transition-all"
              title="Open Project Presentation Deck"
            >
              <Presentation className="w-4 h-4" />
              <span className="hidden sm:inline">PROJECT PRESENTATION</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-[#0A0E18] border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
