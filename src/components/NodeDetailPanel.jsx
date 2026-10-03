import React from 'react';
import { 
  X, 
  Music, 
  User, 
  Layers, 
  ExternalLink, 
  Activity, 
  Eye, 
  Flame, 
  Radio, 
  Share2, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  Calendar,
  Award
} from 'lucide-react';
import { formatNumber, formatExactNumber, formatCentrality } from '../utils/formatters';

export default function NodeDetailPanel({ node, onClose, onSelectRelatedNode }) {
  if (!node) return null;

  const { type, data } = node;

  return (
    <div className="absolute top-4 right-4 bottom-4 w-88 sm:w-96 bg-[#0E1424]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
      
      {/* Header Banner */}
      <div className={`p-4 border-b border-slate-800 flex items-start justify-between ${
        type === 'platform' ? 'bg-amber-500/10 border-amber-500/20' :
        type === 'artist' ? 'bg-purple-500/10 border-purple-500/20' :
        'bg-cyan-500/10 border-cyan-500/20'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${
            type === 'platform' ? 'bg-amber-500/20 text-amber-400' :
            type === 'artist' ? 'bg-purple-500/20 text-purple-400' :
            'bg-cyan-500/20 text-cyan-400'
          }`}>
            {type === 'platform' ? <Layers className="w-5 h-5" /> :
             type === 'artist' ? <User className="w-5 h-5" /> :
             <Music className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {type} Node
            </span>
            <h3 className="text-base font-bold text-white mt-1 line-clamp-1">
              {data.label || data.name}
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

      {/* Body Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 divide-y divide-slate-800/80 text-xs">
        
        {/* ARTIST NODE DETAILS */}
        {type === 'artist' && (
          <>
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[10px]">Catalog Songs</span>
                <p className="text-base font-bold text-purple-300 mt-0.5">
                  {data.songCount || 1}
                </p>
                <span className="text-[9px] text-slate-400">Charting Tracks</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[10px]">Spotify Streams</span>
                <p className="text-base font-bold text-emerald-400 mt-0.5">
                  {formatNumber(data.totalStreams || data.totalSpotifyStreams || 0)}
                </p>
                <span className="text-[9px] text-slate-400">Total Playback</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[10px]">YouTube Views</span>
                <p className="text-base font-bold text-rose-400 mt-0.5">
                  {formatNumber(data.totalYouTubeViews || 0)}
                </p>
                <span className="text-[9px] text-slate-400">Video Reach</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[10px]">TikTok Views</span>
                <p className="text-base font-bold text-cyan-400 mt-0.5">
                  {formatNumber(data.totalTikTokViews || 0)}
                </p>
                <span className="text-[9px] text-slate-400">Viral Impressions</span>
              </div>
            </div>

            {/* Centrality Metrics */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider font-mono">
                  SNA Centrality Metrics
                </span>
                <Activity className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Degree Centrality:</span>
                  <span className="font-mono font-medium text-white">{formatCentrality(data.degree || 0.045)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Betweenness Centrality:</span>
                  <span className="font-mono font-medium text-white">{formatCentrality(data.betweenness || 0.0018)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">PageRank Influence:</span>
                  <span className="font-mono font-medium text-white">{formatCentrality(data.pageRank || 0.0125)}</span>
                </div>
              </div>
            </div>

            {/* Top Songs */}
            {data.topSongs && data.topSongs.length > 0 && (
              <div className="pt-4">
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider font-mono block mb-2">
                  Top Charting Songs
                </span>
                <div className="space-y-1.5">
                  {data.topSongs.map((s, idx) => (
                    <div 
                      key={idx}
                      onClick={() => onSelectRelatedNode && onSelectRelatedNode(`song_${s.rank}`)}
                      className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <div className="truncate">
                        <span className="text-slate-400 font-mono mr-1.5">#{s.rank}</span>
                        <span className="font-medium text-white group-hover:text-cyan-300 truncate">
                          {s.track}
                        </span>
                      </div>
                      <span className="text-emerald-400 font-mono text-[10px] ml-2 flex-shrink-0">
                        {formatNumber(s.streams)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* SONG NODE DETAILS */}
        {type === 'song' && (
          <>
            {/* Song Meta */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Artist:</span>
                <span className="font-medium text-purple-300">{data.artist || 'Unknown'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Album:</span>
                <span className="text-slate-200 truncate max-w-[200px]">{data.album || 'Single'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Release Date:</span>
                <span className="text-slate-200">{data.releaseDate || data.releaseYear || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Explicit Lyrics:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  data.explicit ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {data.explicit ? 'Explicit' : 'Clean'}
                </span>
              </div>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-2 gap-2.5 pt-4">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[10px]">Spotify Streams</span>
                <p className="text-sm sm:text-base font-bold text-cyan-400 mt-0.5 truncate">
                  {formatNumber(data.streams || data.spotifyStreams || 0)}
                </p>
                <span className="text-[9px] text-slate-400">
                  Popularity: {data.popularity || data.spotifyPopularity || 'N/A'}/100
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[10px]">Track Score</span>
                <p className="text-sm sm:text-base font-bold text-amber-400 mt-0.5">
                  {data.trackScore || 'N/A'}
                </p>
                <span className="text-[9px] text-slate-400">
                  Global Rank: #{data.rank || 1}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[10px]">YouTube Views</span>
                <p className="text-sm sm:text-base font-bold text-rose-400 mt-0.5">
                  {formatNumber(data.youtubeViews || 0)}
                </p>
                <span className="text-[9px] text-slate-400">Official Videos</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[10px]">TikTok Views</span>
                <p className="text-sm sm:text-base font-bold text-indigo-400 mt-0.5">
                  {formatNumber(data.tiktokViews || 0)}
                </p>
                <span className="text-[9px] text-slate-400">Short Video Viral</span>
              </div>
            </div>

            {/* Platform Presence Checklist */}
            <div className="pt-4">
              <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider font-mono block mb-2">
                Active Digital Platforms ({data.platformCount || data.platforms?.length || 1}/12)
              </span>
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {[
                  'Spotify', 'YouTube', 'TikTok', 'Apple Music', 'AirPlay',
                  'SiriusXM', 'Deezer', 'Amazon Music', 'Pandora', 'SoundCloud',
                  'Shazam', 'TIDAL'
                ].map((platName) => {
                  const isActive = (data.activePlatforms || data.platforms || []).includes(platName) ||
                                  (data.platformActivity && data.platformActivity[platName]?.hasActivity);
                  const actVal = data.platformActivity ? data.platformActivity[platName]?.value : 0;
                  const unit = data.platformActivity ? data.platformActivity[platName]?.unit : '';

                  return (
                    <div 
                      key={platName} 
                      className={`p-1.5 rounded-lg border text-[11px] flex items-center justify-between ${
                        isActive 
                          ? 'bg-slate-900/90 border-slate-700/80 text-white' 
                          : 'bg-slate-950/40 border-slate-900 text-slate-400 opacity-60'
                      }`}
                    >
                      <span className="truncate">{platName}</span>
                      {isActive ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      ) : (
                        <span className="text-[9px] text-slate-400">-</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* PLATFORM NODE DETAILS */}
        {type === 'platform' && (
          <>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Platform Classification:</span>
                <span className="font-semibold text-amber-400">Digital Distribution</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Connected Songs:</span>
                <span className="font-bold text-white font-mono">{data.connectedSongsCount || 'High'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Primary Network Metric:</span>
                <span className="text-slate-200 font-medium">{data.metricName || 'Streams / Reach'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Measurement Unit:</span>
                <span className="text-cyan-400 font-medium">{data.unit || 'Aggregate volume'}</span>
              </div>
            </div>

            {/* Centrality Role */}
            <div className="pt-4">
              <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider font-mono block mb-2">
                Network Role in SNA
              </span>
              <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                Platforms serve as <strong>super-hubs</strong> in the music social network. 
                Because songs aggregate onto these digital nodes, platforms exhibit the highest Degree Centrality and Betweenness, 
                acting as the convergence bridges of the global music streaming ecosystem.
              </p>
            </div>
          </>
        )}

      </div>

      {/* Footer hint */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-center">
        <p className="text-[10px] text-slate-400">
          Click graph background to deselect · Drag nodes to reposition
        </p>
      </div>

    </div>
  );
}
