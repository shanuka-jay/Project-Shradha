const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { requireAdmin } = require('../middleware/auth');

// GET /api/admin/map/overview — all temples with map status
router.get('/overview', requireAdmin, async (req, res) => {
  try {
    const temples = await prisma.temple.findMany({
      select: { id: true, name: true, state: true, lat: true, lng: true,
        status: true, mapVisible: true, address: true },
      orderBy: { name: 'asc' },
    });
    res.json(temples);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/map/missing — temples without coords
router.get('/missing', requireAdmin, async (req, res) => {
  try {
    const temples = await prisma.temple.findMany({
      where: { OR: [{ lat: null }, { lng: null }] },
      select: { id: true, name: true, state: true, address: true, status: true },
      orderBy: { name: 'asc' },
    });
    res.json({ temples, count: temples.length });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/admin/map/:id/visibility
router.patch('/:id/visibility', requireAdmin, async (req, res) => {
  try {
    const { mapVisible } = req.body;
    const temple = await prisma.temple.update({
      where: { id: req.params.id },
      data: { mapVisible: Boolean(mapVisible) },
    });
    res.json(temple);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/admin/map/:id/coords
router.patch('/:id/coords', requireAdmin, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const temple = await prisma.temple.update({
      where: { id: req.params.id },
      data: { lat: parseFloat(lat), lng: parseFloat(lng) },
    });
    res.json(temple);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/admin/map/geocode — single address geocode via OpenCage
router.post('/geocode', requireAdmin, async (req, res) => {
  try {
    const { address } = req.body;
    const apiKey = process.env.OPENCAGE_KEY;
    if (!apiKey) {
      // Fallback: return dummy for dev without key
      return res.json({ lat: null, lng: null, formatted: address, error: 'No OPENCAGE_KEY set' });
    }
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}&limit=1&countrycode=us`;
    const r = await fetch(url);
    const data = await r.json();
    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      res.json({ lat, lng, formatted: data.results[0].formatted });
    } else {
      res.json({ lat: null, lng: null, error: 'No results' });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/admin/map/bulk-geocode — geocode all temples missing coords
router.post('/bulk-geocode', requireAdmin, async (req, res) => {
  try {
    const temples = await prisma.temple.findMany({
      where: { OR: [{ lat: null }, { lng: null }], address: { not: null } },
      select: { id: true, name: true, address: true, state: true },
    });
    const results = temples.map(t => ({
      id: t.id, name: t.name, address: t.address,
      status: 'pending', lat: null, lng: null,
    }));
    res.json({ results, message: `${results.length} temples need geocoding. Use /geocode endpoint per temple or configure OPENCAGE_KEY for auto-geocoding.` });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/map/duplicates — temples with near-identical coords
router.get('/duplicates', requireAdmin, async (req, res) => {
  try {
    const temples = await prisma.temple.findMany({
      where: { lat: { not: null }, lng: { not: null } },
      select: { id: true, name: true, lat: true, lng: true, state: true },
    });
    const threshold = 0.001; // ~100m
    const dupes = [];
    for (let i = 0; i < temples.length; i++) {
      for (let j = i + 1; j < temples.length; j++) {
        const dLat = Math.abs(temples[i].lat - temples[j].lat);
        const dLng = Math.abs(temples[i].lng - temples[j].lng);
        if (dLat < threshold && dLng < threshold) {
          dupes.push({ a: temples[i], b: temples[j], distance: Math.sqrt(dLat**2 + dLng**2) });
        }
      }
    }
    res.json({ duplicates: dupes, count: dupes.length });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
