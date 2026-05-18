// Normalise a single image URL
function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return null;
  // Legacy Cloudinary URL - keep as-is
  const cm = url.match(/(https:\/\/res\.cloudinary\.com\/.+)/);
  if (cm) return cm[1];
  // Full https URL
  if (url.startsWith('https://') || url.startsWith('http://')) return url;
  // Local upload path e.g. /uploads/abc.jpg
  if (url.startsWith('/uploads/')) return url;
  return null;
}

// Parse a JSON-string column back to a JS array
function parseJsonArray(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== 'string') return [];
  try { const p = JSON.parse(value); return Array.isArray(p) ? p : []; }
  catch { return []; }
}

// Serialize a JS array to a JSON string for SQLite storage
function serializeJsonArray(arr) {
  return JSON.stringify(Array.isArray(arr) ? arr : []);
}

// Normalise an array (or JSON string) of image URLs - returns JS array
function normalizeImageUrlArray(input) {
  return parseJsonArray(input).map(normalizeImageUrl).filter(Boolean);
}

// Parse a JSON-string object column back to a plain object
function parseJsonObject(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  if (!value || typeof value !== 'string') return {};
  try { const p = JSON.parse(value); return (p && typeof p === 'object' && !Array.isArray(p)) ? p : {}; }
  catch { return {}; }
}

// Serialize a JS object to a JSON string for SQLite storage
function serializeJsonObject(obj) {
  if (!obj || typeof obj !== 'object') return null;
  return JSON.stringify(obj);
}

module.exports = {
  normalizeImageUrl,
  normalizeImageUrlArray,
  parseJsonArray,
  serializeJsonArray,
  parseJsonObject,
  serializeJsonObject,
};
