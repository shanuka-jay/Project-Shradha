const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// Only accept real http/https URLs (Cloudinary) — reject local /uploads/ paths
function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith('https://') || url.startsWith('http://');
}

function toClientFormat(temple) {
  const mainImage      = isValidUrl(temple.mainImage) ? temple.mainImage : null;
  const chiefMonkImage = isValidUrl(temple.chiefMonkImage) ? temple.chiefMonkImage : null;
  const galleryImages  = (temple.galleryImages || []).filter(isValidUrl);

  const services = (temple.services || []).map(s => {
    try { return JSON.parse(s); } catch { return { name: s, icon: 'star', time: '' }; }
  });

  return {
    id:             temple.id,
    name:           temple.name,
    state:          temple.state,
    region:         temple.regionTag || 'Other',
    address:        temple.address || '',
    chiefMonk:      temple.chiefMonk || '',
    contact:        temple.phone || '',
    email:          temple.email || '',
    overview:       temple.overview || '',
    description:    temple.overview || '',
    history:        temple.history || '',
    mainImage,
    imageUrl:       mainImage,
    chiefMonkImage,
    galleryImages,
    gallery:        galleryImages,
    services,
    lat:            temple.lat || null,
    lng:            temple.lng || null,
    mapVisible:     temple.mapVisible,
    status:         temple.status,
    createdAt:      temple.createdAt,
    updatedAt:      temple.updatedAt,
  };
}

// GET all published temples (public)
router.get('/', async (req, res) => {
  try {
    const temples = await prisma.temple.findMany({
      where: { status: 'published', mapVisible: true },
      orderBy: { name: 'asc' },
    });
    res.json(temples.map(toClientFormat));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET by state (public)
router.get('/state/:state', async (req, res) => {
  try {
    const temples = await prisma.temple.findMany({
      where: { state: req.params.state, status: 'published' },
    });
    res.json(temples.map(toClientFormat));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET single temple (public)
router.get('/:id', async (req, res) => {
  try {
    const temple = await prisma.temple.findUnique({ where: { id: req.params.id } });
    if (!temple) return res.status(404).json({ error: 'Temple not found' });
    res.json(toClientFormat(temple));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
