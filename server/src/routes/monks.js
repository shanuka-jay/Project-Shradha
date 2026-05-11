const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { requireAdmin } = require('../middleware/auth');

// GET /api/admin/monks
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, temple } = req.query;
    const where = {};
    if (status) where.status = status;
    if (temple) where.linkedTempleId = temple;
    if (search) where.OR = [
      { legalName: { contains: search, mode: 'insensitive' } },
      { displayName: { contains: search, mode: 'insensitive' } },
    ];
    const [monks, total] = await Promise.all([
      prisma.monk.findMany({
        where,
        include: { temple: { select: { id: true, name: true } } },
        skip: (page - 1) * Number(limit),
        take: Number(limit),
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
    const { legalName, displayName, ordinationDate, nationality, residence, languages,
      biography, role, profilePhoto, socialLinks, contactInfo, linkedTempleId, status } = req.body;
    const monk = await prisma.monk.create({
      data: { legalName, displayName, ordinationDate, nationality, residence,
        languages: languages || [], biography, role, profilePhoto,
        socialLinks: socialLinks || {}, contactInfo,
        linkedTempleId: linkedTempleId || null,
        status: status || 'published' },
    });
    res.status(201).json(monk);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/admin/monks/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { legalName, displayName, ordinationDate, nationality, residence, languages,
      biography, role, profilePhoto, socialLinks, contactInfo, linkedTempleId, status } = req.body;
    const monk = await prisma.monk.update({
      where: { id: req.params.id },
      data: { legalName, displayName, ordinationDate, nationality, residence,
        languages: languages || [], biography, role, profilePhoto,
        socialLinks: socialLinks || {}, contactInfo,
        linkedTempleId: linkedTempleId || null, status },
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
