function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return null;

  const cloudinaryMatch = url.match(/(https:\/\/res\.cloudinary\.com\/.+)/);
  if (cloudinaryMatch) return cloudinaryMatch[1];

  if (url.startsWith('https://') || url.startsWith('http://')) return url;

  return null;
}

function normalizeImageUrlArray(urls) {
  return (Array.isArray(urls) ? urls : [])
    .map(normalizeImageUrl)
    .filter(Boolean);
}

module.exports = {
  normalizeImageUrl,
  normalizeImageUrlArray,
};
