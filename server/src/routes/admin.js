const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');
const { requireAdmin } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'saddha-secret-key';

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
      JWT_SECRET, { expiresIn: '8h' }
    );
    res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/me
router.get('/me', requireAdmin, async (req, res) => {
  res.json({ admin: req.admin });
});

// GET /api/admin/stats
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [totalTemples, totalMonks, totalEvents, totalContacts, unreadContacts, stateCount, missingCoords] = await Promise.all([
      prisma.temple.count(),
      prisma.monk.count(),
      prisma.event.count(),
      prisma.contact.count(),
      prisma.contact.count({ where: { read: false } }),
      prisma.temple.groupBy({ by: ['state'], _count: { state: true } }),
      prisma.temple.count({ where: { OR: [{ lat: null }, { lng: null }] } }),
    ]);
    res.json({ totalTemples, totalMonks, totalEvents, totalContacts, unreadContacts, states: stateCount.length, missingCoords });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── Temples CRUD ───────────────────────────────────────────────
router.get('/temples', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, state, status, search } = req.query;
    const where = {};
    if (state) where.state = state;
    if (status) where.status = status;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    const [temples, total] = await Promise.all([
      prisma.temple.findMany({
        where, skip: (page - 1) * Number(limit), take: Number(limit), orderBy: { createdAt: 'desc' },
      }),
      prisma.temple.count({ where }),
    ]);
    res.json({ temples, total, page: Number(page), limit: Number(limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/temples/:id', requireAdmin, async (req, res) => {
  try {
    const temple = await prisma.temple.findUnique({ where: { id: req.params.id } });
    if (!temple) return res.status(404).json({ error: 'Temple not found' });
    res.json(temple);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/temples', requireAdmin, async (req, res) => {
  try {
    const {
      name, state, address, chiefMonk, phone, email,
      overview, history,
      mainImage, chiefMonkImage, galleryImages,
      images, services,
      lat, lng, status, regionTag, mapVisible
    } = req.body;
    const temple = await prisma.temple.create({
      data: {
        name, state, address, chiefMonk, phone, email,
        overview: overview || null,
        history: history || null,
        mainImage: mainImage || null,
        chiefMonkImage: chiefMonkImage || null,
        galleryImages: galleryImages || [],
        images: images || [],
        services: services || [],
        lat, lng,
        status: status || 'published',
        regionTag: regionTag || null,
        mapVisible: mapVisible !== false,
      },
    });
    res.status(201).json(temple);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/temples/:id', requireAdmin, async (req, res) => {
  try {
    const {
      name, state, address, chiefMonk, phone, email,
      overview, history,
      mainImage, chiefMonkImage, galleryImages,
      images, services,
      lat, lng, status, mapVisible, regionTag
    } = req.body;
    const temple = await prisma.temple.update({
      where: { id: req.params.id },
      data: {
        name, state, address, chiefMonk, phone, email,
        overview: overview !== undefined ? overview : undefined,
        history: history !== undefined ? history : undefined,
        mainImage: mainImage !== undefined ? mainImage : undefined,
        chiefMonkImage: chiefMonkImage !== undefined ? chiefMonkImage : undefined,
        galleryImages: galleryImages !== undefined ? (galleryImages || []) : undefined,
        images: images !== undefined ? (images || []) : undefined,
        services: services !== undefined ? (services || []) : undefined,
        lat, lng, status, mapVisible, regionTag,
      },
    });
    res.json(temple);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH individual sections separately
router.patch('/temples/:id/overview', requireAdmin, async (req, res) => {
  try {
    const { overview } = req.body;
    const temple = await prisma.temple.update({
      where: { id: req.params.id },
      data: { overview },
    });
    res.json(temple);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/temples/:id/history', requireAdmin, async (req, res) => {
  try {
    const { history } = req.body;
    const temple = await prisma.temple.update({
      where: { id: req.params.id },
      data: { history },
    });
    res.json(temple);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/temples/:id/main-image', requireAdmin, async (req, res) => {
  try {
    const { mainImage } = req.body;
    const temple = await prisma.temple.update({
      where: { id: req.params.id },
      data: { mainImage },
    });
    res.json(temple);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/temples/:id/chief-monk-image', requireAdmin, async (req, res) => {
  try {
    const { chiefMonkImage } = req.body;
    const temple = await prisma.temple.update({
      where: { id: req.params.id },
      data: { chiefMonkImage },
    });
    res.json(temple);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/temples/:id/gallery', requireAdmin, async (req, res) => {
  try {
    const { galleryImages } = req.body;
    const temple = await prisma.temple.update({
      where: { id: req.params.id },
      data: { galleryImages: galleryImages || [] },
    });
    res.json(temple);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/temples/:id/services', requireAdmin, async (req, res) => {
  try {
    const { services } = req.body;
    const temple = await prisma.temple.update({
      where: { id: req.params.id },
      data: { services: services || [] },
    });
    res.json(temple);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/temples/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.temple.delete({ where: { id: req.params.id } });
    res.json({ message: 'Temple deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── Messages ───────────────────────────────────────────────────
router.get('/messages', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, unread, archived } = req.query;
    const where = {};
    if (unread === 'true') where.read = false;
    if (archived === 'true') where.archived = true;
    else where.archived = false;
    const [messages, total] = await Promise.all([
      prisma.contact.findMany({ where, skip: (page - 1) * Number(limit), take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.contact.count({ where }),
    ]);
    res.json({ messages, total });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/messages/:id/read', requireAdmin, async (req, res) => {
  try {
    const msg = await prisma.contact.update({ where: { id: req.params.id }, data: { read: true } });
    res.json(msg);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/messages/:id/archive', requireAdmin, async (req, res) => {
  try {
    const msg = await prisma.contact.update({ where: { id: req.params.id }, data: { archived: true, read: true } });
    res.json(msg);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/messages/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.contact.delete({ where: { id: req.params.id } });
    res.json({ message: 'Message deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── Change password ─────────────────────────────────────────────
router.put('/change-password', requireAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Current password incorrect' });
    const hash = await bcrypt.hash(newPassword, 12);
    await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash: hash } });
    res.json({ message: 'Password updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
