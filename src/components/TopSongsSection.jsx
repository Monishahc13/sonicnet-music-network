import React, { useState, useMemo } from 'react';
import { 
  Music, 
  Search, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  SlidersHorizontal,
  ExternalLink,
  Flame,
  Activity,
  Radio,
  CheckCircle2,
  X
} from 'lucide-react';
import topSongs from '../data/topSongs.json';
import { formatNumber, formatExactNumber } from '../utils/formatters';

export default function TopSongsSection({ onSelectSong }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('rank');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [explicitFilter, setExplicitFilter] = useState('ALL');

  // Filter & Sort
  const filteredAndSortedSongs = useMemo(() => {
    let result = [...topSongs];

    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(s => 
        s.track.toLowerCase().includes(q) || 
        s.artist.toLowerCase().includes(q) ||
        s.album.toLowerCase().includes(q)
      );
    }

    // Explicit Filter
    if (explicitFilter === 'EXPLICIT') {
      result = result.filter(s => s.explicit);
    } else if (explicitFilter === 'CLEAN') {
      result = result.filter(s => !s.explicit);
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB || '').toLowerCase();
        return sortDirection === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }

      valA = valA || 0;
      valB = valB || 0;
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [searchTerm, sortField, sortDirection, explicitFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedSongs.length / pageSize) || 1;
  const paginatedSongs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedSongs.slice(start, start + pageSize);
  }, [filteredAndSortedSongs, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'rank' ? 'asc' : 'desc');
    }
    setCurrentPage(1);
  };

  const handleExportCsv = () => {
    const headers = ['Rank', 'Track', 'Artist', 'Album', 'Release Date', 'Spotify Streams', 'Spotify Popularity', 'YouTube Views', 'TikTok Views', 'Track Score', 'Platform Count', 'Explicit'];
    const rows = filteredAndSortedSongs.map(s => [
      s.rank,
      `"${s.track.replace(/"/g, '""')}"`,
      `"${s.artist.replace(/"/g, '""')}"`,
      `"${s.album.replace(/"/g, '""')}"`,
      s.releaseDate,
      s.spotifyStreams,
      s.spotifyPopularity,
      s.youtubeViews,
      s.tiktokViews,
      s.trackScore,
      s.platformCount,
      s.explicit ? 'Yes' : 'No'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sonicnet_filtered_songs.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="songs" className="py-16 border-b border-slate-800 bg-[#080B11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Track Catalog Explorer
              </span>
              <span className="text-xs text-slate-400">· Comprehensive Streaming Dataset</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
              Top Streamed Songs & Multi-Platform Analytics
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Search, sort, filter, and inspect songs. Click any track to inspect its multi-platform footprint and digital network connections.
            </p>
          </div>

          <button
            onClick={handleExportCsv}
            className="self-start md:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download Filtered CSV ({filteredAndSortedSongs.length})</span>
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 rounded-xl bg-[#0D1220] border border-slate-800 flex flex-wrap items-center justify-between gap-3 mb-4 shadow-lg">
          
          <div className="flex items-center gap-3 flex-1 min-w-[260px]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by track title, artist or album..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-8 py-2 bg-slate-900 text-xs text-white placeholder-slate-400 rounded-lg border border-slate-700/80 focus:border-cyan-500 outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              {['ALL', 'EXPLICIT', 'CLEAN'].map(val => (
                <button
                  key={val}
                  onClick={() => {
                    setExplicitFilter(val);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    explicitFilter === val
                      ? 'bg-cyan-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-slate-900 text-white rounded border border-slate-800 outline-none"
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>

        </div>

        {/* Data Table */}
        <div className="rounded-xl border border-slate-800 bg-[#0C101C] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090D17] text-slate-400 border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider">
                <tr>
                  <th 
                    onClick={() => handleSort('rank')}
                    className="p-3.5 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Rank</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('track')}
                    className="p-3.5 cursor-pointer hover:text-white transition-colors min-w-[200px]"
                  >
                    <div className="flex items-center gap-1">
                      <span>Track Title</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('artist')}
                    className="p-3.5 cursor-pointer hover:text-white transition-colors min-w-[150px]"
                  >
                    <div className="flex items-center gap-1">
                      <span>Artist</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('spotifyStreams')}
                    className="p-3.5 cursor-pointer hover:text-white transition-colors text-right"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Spotify Streams</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('spotifyPopularity')}
                    className="p-3.5 cursor-pointer hover:text-white transition-colors text-center"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Popularity</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('youtubeViews')}
                    className="p-3.5 cursor-pointer hover:text-white transition-colors text-right"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>YouTube</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('tiktokViews')}
                    className="p-3.5 cursor-pointer hover:text-white transition-colors text-right"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>TikTok</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('trackScore')}
                    className="p-3.5 cursor-pointer hover:text-white transition-colors text-center"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Track Score</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {paginatedSongs.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-8 text-center text-slate-400">
                      No songs match your current filters. Try resetting search or adjusting parameters.
                    </td>
                  </tr>
                ) : (
                  paginatedSongs.map((song) => (
                    <tr 
                      key={song.id} 
                      onClick={() => onSelectSong(song)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      <td className="p-3.5 font-mono text-slate-400 font-bold">
                        #{song.rank}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                            {song.track}
                          </span>
                          {song.explicit && (
                            <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[9px] font-mono border border-rose-500/30">
                              E
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[220px]">
                          {song.album} · {song.releaseYear}
                        </span>
                      </td>
                      <td className="p-3.5 text-purple-300 font-medium truncate max-w-[150px]">
                        {song.artist}
                      </td>
                      <td className="p-3.5 text-right font-mono text-emerald-400 font-medium">
                        {formatNumber(song.spotifyStreams)}
                      </td>
                      <td className="p-3.5 text-center font-mono">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                          {song.spotifyPopularity}/100
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-mono text-rose-400">
                        {formatNumber(song.youtubeViews)}
                      </td>
                      <td className="p-3.5 text-right font-mono text-indigo-400">
                        {formatNumber(song.tiktokViews)}
                      </td>
                      <td className="p-3.5 text-center font-mono text-amber-400 font-semibold">
                        {song.trackScore.toFixed(1)}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectSong(song);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-white text-slate-300 text-[10px] font-medium transition-colors"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Toolbar */}
          <div className="p-3.5 bg-[#090D17] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              Showing <strong className="text-white">{filteredAndSortedSongs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{' '}
              <strong className="text-white">{Math.min(currentPage * pageSize, filteredAndSortedSongs.length)}</strong> of{' '}
              <strong className="text-white">{filteredAndSortedSongs.length}</strong> songs
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 font-mono text-white text-xs">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
