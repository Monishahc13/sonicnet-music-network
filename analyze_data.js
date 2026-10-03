const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'Most Streamed Spotify Songs 2024.csv');
const rawData = fs.readFileSync(csvPath, 'utf8');

// Robust CSV parser supporting quotes and newlines within fields
function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let field = '';

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push(field);
      field = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      row.push(field);
      field = '';
      if (row.some(f => f.trim().length > 0)) {
        lines.push(row);
      }
      row = [];
    } else {
      field += c;
    }
  }
  if (field || row.length > 0) {
    row.push(field);
    if (row.some(f => f.trim().length > 0)) {
      lines.push(row);
    }
  }
  return lines;
}

const parsed = parseCSV(rawData);
const headers = parsed[0].map(h => h.trim());
console.log('Headers:', headers);
console.log('Total records:', parsed.length - 1);

const rows = parsed.slice(1).map(r => {
  const obj = {};
  headers.forEach((h, idx) => {
    obj[h] = r[idx] ? r[idx].trim() : '';
  });
  return obj;
});

console.log('\nSample Record 1:');
console.log(JSON.stringify(rows[0], null, 2));

// Summary statistics
const artists = new Set();
const albums = new Set();
let totalSpotifyStreams = 0n;
let countWithStreams = 0;
let popularitySum = 0;
let countWithPopularity = 0;
const years = {};

rows.forEach(r => {
  if (r['Artist']) artists.add(r['Artist']);
  if (r['Album Name']) albums.add(r['Album Name']);
  
  const rawStreams = (r['Spotify Streams'] || '').replace(/,/g, '');
  if (rawStreams && !isNaN(Number(rawStreams))) {
    totalSpotifyStreams += BigInt(rawStreams);
    countWithStreams++;
  }

  const pop = Number(r['Spotify Popularity']);
  if (!isNaN(pop) && r['Spotify Popularity'] !== '') {
    popularitySum += pop;
    countWithPopularity++;
  }

  const dateStr = r['Release Date'] || '';
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const yr = parts[2];
    years[yr] = (years[yr] || 0) + 1;
  }
});

console.log('\n--- Summary Stats ---');
console.log('Unique Artists:', artists.size);
console.log('Unique Albums:', albums.size);
console.log('Total Spotify Streams (approx):', totalSpotifyStreams.toString());
console.log('Average Spotify Popularity:', (popularitySum / countWithPopularity).toFixed(2));
console.log('Years distribution (top 10):', Object.entries(years).sort((a,b) => b[1] - a[1]).slice(0, 10));
