const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { requireAdmin } = require('../middleware/auth');
const { normalizeImageUrl } = require('../utils/imageUrls');

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Pick only the fields Prisma knows about from the request body */
function buildMonkData(body) {
  const {
    legalName, displayName, titles, role,
    dateOfBirth, ordinationDate, nationality, residence, languages,
    biography, quote,
    contactInfo, email, templePhone, address, appointment,
    profilePhoto, socialLinks,
    linkedTempleId, status,
  } = body;

  return {
    legalName,
    displayName:    displayName    || null,
    titles:         titles         || null,
    role:           role           || null,
    dateOfBirth:    dateOfBirth    || null,
    ordinationDate: ordinationDate || null,
    nationality:    nationality    || null,
    residence:      residence      || null,
    languages:      Array.isArray(languages) ? languages : [],
    biography:      biography      || null,
    quote:          quote          || null,
    // keep contactInfo in sync with email for backwards compat
    contactInfo:    email || contactInfo || null,
    email:          email          || null,
    templePhone:    templePhone    || null,
    address:        address        || null,
    appointment:    appointment    || null,
    profilePhoto:   normalizeImageUrl(profilePhoto),
    socialLinks:    socialLinks    || {},
    linkedTempleId: linkedTempleId || null,
    status:         status         || 'published',
  };
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET /api/admin/monks
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, temple } = req.query;
    const where = {};
    if (status) where.status = status;
    if (temple) where.linkedTempleId = temple;
    if (search) where.OR = [
      { legalName:   { contains: search, mode: 'insensitive' } },
      { displayName: { contains: search, mode: 'insensitive' } },
    ];
    const [monks, total] = await Promise.all([
      prisma.monk.findMany({
        where,
        include: { temple: { select: { id: true, name: true } } },
        skip:  (page - 1) * Number(limit),
        take:  Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.monk.count({ where }),
    ]);
    res.json({ monks, total, page: Number(page), limit: Number(limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/monks/:id
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const monk = await prisma.monk.findUnique({
      where: { id: req.params.id },
      include: { temple: { select: { id: true, name: true } } },
    });
    if (!monk) return res.status(404).json({ error: 'Monk not found' });
    res.json(monk);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/admin/monks
router.post('/', requireAdmin, async (req, res) => {
  try {
    if (!req.body.legalName?.trim()) {
      return res.status(400).json({ error: 'legalName is required' });
    }
    const monk = await prisma.monk.create({ data: buildMonkData(req.body) });
    res.status(201).json(monk);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/admin/monks/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const monk = await prisma.monk.update({
      where: { id: req.params.id },
      data:  buildMonkData(req.body),
    });
    res.json(monk);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/admin/monks/:id/photo  — standalone photo update
router.patch('/:id/photo', requireAdmin, async (req, res) => {
  try {
    const { profilePhoto } = req.body;
    const monk = await prisma.monk.update({
      where: { id: req.params.id },
      data:  { profilePhoto: normalizeImageUrl(profilePhoto) },
    });
    res.json(monk);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/admin/monks/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.monk.delete({ where: { id: req.params.id } });
    res.json({ message: 'Monk profile deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
