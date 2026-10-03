// Utility formatters for metrics, numbers, currency, and percentages

export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toLocaleString();
}

export function formatExactNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return Number(num).toLocaleString();
}

export function formatCentrality(val) {
  if (val === null || val === undefined || isNaN(val)) return '0.0000';
  return Number(val).toFixed(4);
}

export function sanitizeId(str) {
  return (str || '').replace(/[^a-zA-Z0-9_-]/g, '_');
}
