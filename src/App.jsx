import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeSection from './components/HomeSection';
import NetworkGraph from './components/NetworkGraph';
import TopArtistsSection from './components/TopArtistsSection';
import TopSongsSection from './components/TopSongsSection';
import PlatformAnalysisSection from './components/PlatformAnalysisSection';
import CrossPlatformFootprint from './components/CrossPlatformFootprint';
import TrendAnalysisSection from './components/TrendAnalysisSection';
import NetworkInsightsSection from './components/NetworkInsightsSection';
import SongAndArtistExplorers from './components/SongAndArtistExplorers';
import MethodologySection from './components/MethodologySection';
import PresentationModal from './components/PresentationModal';
import Footer from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [networkViewMode, setNetworkViewMode] = useState('ecosystem');
  const [selectedNodeIdForNetwork, setSelectedNodeIdForNetwork] = useState(null);
  const [selectedSongIdForFootprint, setSelectedSongIdForFootprint] = useState(null);
  const [selectedArtistForExplorer, setSelectedArtistForExplorer] = useState(null);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);

  // Intersection observer to highlight current nav section during scrolling
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'network', 'artists', 'songs', 'platforms', 'footprint', 'trends', 'insights', 'explorers', 'methodology'];
      const scrollPos = window.scrollY + 200;

      for (const sId of sections) {
        const el = document.getElementById(sId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // When a search result is selected from global search
  const handleSelectSearchResult = (item) => {
    setSelectedNodeIdForNetwork(item.id);
    scrollToSection('network');
  };

  // When locating an artist from top artists or insights
  const handleInspectArtistInNetwork = (artistName) => {
    setSelectedNodeIdForNetwork(`artist_${artistName.replace(/\s+/g, '_')}`);
    scrollToSection('network');
  };

  // When clicking a song from top songs table
  const handleSelectSongFromTable = (song) => {
    setSelectedSongIdForFootprint(song.id);
    scrollToSection('footprint');
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Global Sticky Navigation */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={scrollToSection}
        onSelectSearchResult={handleSelectSearchResult}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        
        {/* 1. HOME / OVERVIEW */}
        <HomeSection
          onExploreNetwork={() => scrollToSection('network')}
          onOpenPresentation={() => setIsPresentationOpen(true)}
          onSelectViewMode={(mode) => setNetworkViewMode(mode)}
        />

        {/* 2. INTERACTIVE MUSIC NETWORK (THE MAIN CENTERPIECE) */}
        <NetworkGraph
          viewMode={networkViewMode}
          onViewModeChange={(mode) => setNetworkViewMode(mode)}
          selectedNodeIdFromParent={selectedNodeIdForNetwork}
          onClearSelectedNodeFromParent={() => setSelectedNodeIdForNetwork(null)}
        />

        {/* 3. TOP ARTISTS SECTION */}
        <TopArtistsSection
          onInspectArtistInNetwork={handleInspectArtistInNetwork}
        />

        {/* 4. TOP SONGS SECTION */}
        <TopSongsSection
          onSelectSong={handleSelectSongFromTable}
        />

        {/* 5. PLATFORM ANALYSIS SECTION */}
        <PlatformAnalysisSection />

        {/* 6. CROSS-PLATFORM MUSIC ANALYSIS ("Where Does Music Travel?") */}
        <CrossPlatformFootprint
          selectedSongId={selectedSongIdForFootprint}
          onSelectSongId={(id) => setSelectedSongIdForFootprint(id)}
        />

        {/* 7. TREND ANALYSIS SECTION */}
        <TrendAnalysisSection />

        {/* 8. NETWORK INSIGHTS & CRITICAL NODES SECTION */}
        <NetworkInsightsSection
          onInspectNode={handleInspectArtistInNetwork}
        />

        {/* 9. SPECIALIZED SONG & ARTIST EXPLORERS */}
        <SongAndArtistExplorers
          initialArtistName={selectedArtistForExplorer}
          initialSongId={selectedSongIdForFootprint}
        />

        {/* 10. DATA SCIENCE & METHODOLOGY SECTION */}
        <MethodologySection />

      </main>

      {/* Footer & Evaluator Resources */}
      <Footer
        onOpenPresentation={() => setIsPresentationOpen(true)}
        onJumpToSection={scrollToSection}
      />

      {/* Guided Project Presentation Modal */}
      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        onJumpToSection={(sectionId) => scrollToSection(sectionId)}
      />

    </div>
  );
}
