# SONICNET – Global Music Social Network Analytics

> **Subtitle:** Discover how songs, artists and platforms connect to shape music popularity  
> **Course / Subject:** Social Network Analysis (SNA) & Advanced Data Analytics  
> **Target Audience:** Evaluators, Faculty, Data Science Students & Music Researchers  

---

## 🎧 1. Executive Summary

**SONICNET** transforms real-world global streaming data into an interactive, multi-partite social network graph. Rather than treating music as static tabular rows, SONICNET models music popularity as a **living, interconnected ecosystem** consisting of:
- **Artists** (Creators & Repertoire Hubs)
- **Songs** (Connective Distribution Entities)
- **Digital Platforms** (Streaming, Video, Viral Social, Broadcast Radio & Audio Discovery)

The system is built on the complete **"Most Streamed Spotify Songs 2024.csv"** dataset containing **4,600 charting songs**, **2,000 unique artists**, and over **2.01 Trillion cumulative Spotify streams**.

---

## 🌐 2. Core Social Network Architecture

### Node Taxonomies:
1. **Artist Nodes (Hexagonal, Purple):** Scaled proportionally by cumulative catalog streaming volume.
2. **Song Nodes (Circular, Electric Cyan):** Scaled by individual Spotify streaming numbers and global rank.
3. **Platform Nodes (Diamond, Platform Brand Hues):** Sized by structural degree (connected songs count).

### The Four Interactive Network Views:
- **VIEW 1: Artist–Song Network:** Bipartite graph mapping repertoire clustering, hit density, and artist catalog depth.
- **VIEW 2: Song–Platform Network:** Bipartite distribution graph linking songs to active digital channels where measurable engagement exists.
- **VIEW 3: Artist–Platform Influence Network:** Structural projection measuring an artist's cross-platform footprint and promotional balance.
- **VIEW 4: Music Ecosystem (Master Graph):** Master tripartite network: `Artist → Song → Digital Platform`.

---

## 📐 3. Mathematical Centrality Formulations

| SNA Metric | Mathematical Formula | Real-World Meaning in SONICNET |
| :--- | :--- | :--- |
| **Degree Centrality** | $C_D(v) = \frac{\text{deg}(v)}{N - 1}$ | Measures how strongly connected a node is. Drake and Taylor Swift emerge as high-degree artist hubs ($C_D > 0.03$), while Spotify and YouTube serve as super-hubs. |
| **Betweenness Centrality** | $C_B(v) = \sum_{s \neq v \neq t} \frac{\sigma_{st}(v)}{\sigma_{st}}$ | Identifies critical **bridge nodes** (via Brandes' algorithm) connecting disparate subgraphs, such as viral TikTok breakout tracks bridging into terrestrial radio. |
| **Closeness Centrality** | $C_C(v) = \frac{N - 1}{\sum_{u \neq v} d(v, u)}$ | Measures diffusion speed. Nodes with high closeness can propagate musical trends across platforms with minimal hops. |
| **PageRank Centrality** | $PR(u) = \frac{1-d}{N} + d \sum_{v \in B_u} \frac{PR(v)}{L(v)}$ | Measures structural prestige. Weights connections based on the authority and reach of neighboring platforms and collaborators. |
| **Network Density** | $\text{Density} = \frac{2 \times \|E\|}{\|V\|(\|V\| - 1)}$ | Quantifies global cohesion ($D \approx 0.0311$ in the core ecosystem graph). |

---

## 🚀 4. Unique Project Highlights

1. **Where Does Music Travel? (Cross-Platform Diffusion):**
   - Interactive 6-dimensional **Radar Footprint** calibrating Streaming, Video, TikTok Virality, Curated Playlists, Radio Broadcast, and Audio Fingerprinting (Shazam).
   - Sequential flow path tracing tracks from streaming inception to terrestrial radio.
2. **Platform Overlap Co-occurrence Matrix (12 × 12):**
   - Exact mathematical heatmap showing pairwise song overlap across all 12 platforms.
3. **Live Cytoscape Graph Engine:**
   - Force-directed physics (`COSE`), Concentric, Hierarchical BFS, and Circular layouts.
   - Ego-network spotlighting, node dragging, zoom/pan controls, and high-resolution PNG export.
4. **Project Presentation Mode:**
   - Dedicated guided slide deck for college evaluation demonstrations: *Problem → Dataset → Network Modeling → Centrality Analysis → Findings*.

---

## 🛠️ 5. Technology Stack

- **Frontend Framework:** React 18 + Vite 6
- **Network Graph Engine:** Cytoscape.js
- **Network Analysis Library:** Graphology & Graphology Metrics
- **Data Visualizations:** Recharts (Bar, Area, Radar, Pie charts)
- **Styling:** Tailwind CSS v4 (Glassmorphism, dark music aesthetic)
- **Iconography:** Lucide Icons

---

## 💻 6. How to Run the Project Locally

### Prerequisites:
- Node.js (v18 or higher)

### Installation & Launch:
```bash
# 1. Clone or navigate to the project directory:
cd "c:\Users\HP\Documents\SNA PROJECT"

# 2. Run the data processing pipeline (if modifying CSV):
node scripts/generate_all_data.js

# 3. Start the interactive development server:
npm run dev
```

The web application will launch at `http://localhost:3000/`.

---

## 📊 7. Verified Dataset Key Performance Indicators (KPIs)

- **Total Analyzed Songs:** `4,600`
- **Total Unique Artists:** `2,000`
- **Total Released Albums:** `4,005`
- **Total Spotify Streams:** `2,007,426,881,265` (~2.01 Trillion Streams)
- **Average Spotify Popularity:** `63.50 / 100`
- **Platforms Analyzed:** `12` (Spotify, YouTube, TikTok, Apple Music, AirPlay, SiriusXM, Deezer, Amazon, Pandora, SoundCloud, Shazam, TIDAL)
- **Top Artist by Catalog Depth & Degree:** `Drake` (63 charting tracks, 34.96B streams)
- **Top Viral TikTok Performer:** `Flowers` by Miley Cyrus (14.6B TikTok views)
