const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');
const { requireAdmin } = require('../middleware/auth');
const { normalizeImageUrl, normalizeImageUrlArray } = require('../utils/imageUrls');
const { sendAdminPasswordResetEmail } = require('../services/mailService');

const JWT_SECRET = process.env.JWT_SECRET || 'saddha-secret-key';
const RESET_TOKEN_TTL_MINUTES = 30;

function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function getAdminBaseUrl(req) {
  const configuredUrl = process.env.ADMIN_APP_URL || process.env.ADMIN_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, '');

  if (process.env.NODE_ENV === 'production') {
    throw new Error('ADMIN_APP_URL is required for password reset links');
  }

  const origin = req.get('origin');
  if (origin) return origin.replace(/\/$/, '');

  return `${req.protocol}://${req.get('host')}`;
}

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

// POST /api/admin/forgot-password
router.post('/forgot-password', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const responseMessage = 'If an admin account exists for that email, a reset link has been generated.';

  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.json({ message: responseMessage });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = hashResetToken(resetToken);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        passwordResetTokenHash: resetTokenHash,
        passwordResetExpiresAt: expiresAt,
        passwordResetRequestedAt: new Date(),
      },
    });

    const resetLink = `${getAdminBaseUrl(req)}/login?resetToken=${resetToken}`;
    const emailSent = await sendAdminPasswordResetEmail({
      admin,
      resetLink,
      expiresInMinutes: RESET_TOKEN_TTL_MINUTES,
    });
    if (!emailSent || process.env.NODE_ENV !== 'production') {
      console.log(`Admin password reset link for ${admin.email}: ${resetLink}`);
    }
    if (!emailSent) {
      console.warn('Brevo email was not sent because BREVO_API_KEY or BREVO_SENDER_EMAIL is missing.');
    }

    const body = { message: responseMessage };
    if (process.env.NODE_ENV !== 'production') {
      body.resetLink = resetLink;
      if (!emailSent) body.emailWarning = 'Brevo email is not configured in server/.env.';
    }
    res.json(body);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/admin/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password required' });
  if (newPassword.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  try {
    const admin = await prisma.admin.findFirst({
      where: {
        passwordResetTokenHash: hashResetToken(token),
        passwordResetExpiresAt: { gt: new Date() },
      },
    });

    if (!admin) return res.status(400).json({ error: 'Reset link is invalid or expired' });

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        passwordHash,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
        passwordResetRequestedAt: null,
      },
    });

    res.json({ message: 'Password reset successful. You can sign in with your new password.' });
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

    // ── Duplicate check: same name + same state ──
    const allTemples = await prisma.temple.findMany({ select: { name: true, state: true } });
    const duplicate = allTemples.find(t =>
      t.name.trim().toLowerCase() === name.trim().toLowerCase() &&
      t.state.trim().toLowerCase() === state.trim().toLowerCase()
    );
    if (duplicate) {
      return res.status(409).json({ error: `A temple named "${duplicate.name}" already exists in ${duplicate.state}.` });
    }

    const temple = await prisma.temple.create({
      data: {
        name, state, address, chiefMonk, phone, email,
        overview: overview || null,
        history: history || null,
        mainImage: normalizeImageUrl(mainImage),
        chiefMonkImage: normalizeImageUrl(chiefMonkImage),
        galleryImages: normalizeImageUrlArray(galleryImages),
        images: normalizeImageUrlArray(images),
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
        mainImage: mainImage !== undefined ? normalizeImageUrl(mainImage) : undefined,
        chiefMonkImage: chiefMonkImage !== undefined ? normalizeImageUrl(chiefMonkImage) : undefined,
        galleryImages: galleryImages !== undefined ? normalizeImageUrlArray(galleryImages) : undefined,
        images: images !== undefined ? normalizeImageUrlArray(images) : undefined,
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
      data: { mainImage: normalizeImageUrl(mainImage) },
    });
    res.json(temple);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/temples/:id/chief-monk-image', requireAdmin, async (req, res) => {
  try {
    const { chiefMonkImage } = req.body;
    const temple = await prisma.temple.update({
      where: { id: req.params.id },
      data: { chiefMonkImage: normalizeImageUrl(chiefMonkImage) },
    });
    res.json(temple);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/temples/:id/gallery', requireAdmin, async (req, res) => {
  try {
    const { galleryImages } = req.body;
    const temple = await prisma.temple.update({
      where: { id: req.params.id },
      data: { galleryImages: normalizeImageUrlArray(galleryImages) },
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
