const express = require('express');
const router  = express.Router();
const prisma  = require('../prismaClient');
const { requireAdmin } = require('../middleware/auth');
const { normalizeImageUrl, serializeJsonArray, parseJsonArray, serializeJsonObject, parseJsonObject } = require('../utils/imageUrls');

function buildMonkData(body) {
  const { legalName, displayName, titles, role, dateOfBirth, ordinationDate,
    nationality, residence, languages, biography, quote, contactInfo, email,
    templePhone, address, appointment, profilePhoto, socialLinks, linkedTempleId, status } = body;
  return {
    legalName,
    displayName: displayName || null, titles: titles || null, role: role || null,
    dateOfBirth: dateOfBirth || null, ordinationDate: ordinationDate || null,
    nationality: nationality || null, residence: residence || null,
    languages: serializeJsonArray(Array.isArray(languages) ? languages : []),
    biography: biography || null, quote: quote || null,
    contactInfo: contactInfo || null, email: email || null,
    templePhone: templePhone || null, address: address || null, appointment: appointment || null,
    profilePhoto: normalizeImageUrl(profilePhoto),
    socialLinks: serializeJsonObject(socialLinks || {}),
    linkedTempleId: linkedTempleId || null, status: status || 'published',
  };
}

function fmt(monk) {
  if (!monk) return monk;
  return { ...monk, languages: parseJsonArray(monk.languages), socialLinks: parseJsonObject(monk.socialLinks) };
}

router.get('/', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, temple } = req.query;
    const where = {};
    if (status) where.status = status;
    if (temple) where.linkedTempleId = temple;
    if (search) where.OR = [{ legalName: { contains: search } }, { displayName: { contains: search } }];
    const [monks, total] = await Promise.all([
      prisma.monk.findMany({ where, include: { temple: { select: { id: true, name: true } } },
        skip: (page - 1) * Number(limit), take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.monk.count({ where }),
    ]);
    res.json({ monks: monks.map(fmt), total, page: Number(page), limit: Number(limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const monk = await prisma.monk.findUnique({ where: { id: req.params.id }, include: { temple: { select: { id: true, name: true } } } });
    if (!monk) return res.status(404).json({ error: 'Monk not found' });
    res.json(fmt(monk));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    if (!req.body.legalName?.trim()) return res.status(400).json({ error: 'legalName is required' });
    res.status(201).json(fmt(await prisma.monk.create({ data: buildMonkData(req.body) })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try { res.json(fmt(await prisma.monk.update({ where: { id: req.params.id }, data: buildMonkData(req.body) }))); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id/photo', requireAdmin, async (req, res) => {
  try { res.json(fmt(await prisma.monk.update({ where: { id: req.params.id }, data: { profilePhoto: normalizeImageUrl(req.body.profilePhoto) } }))); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try { await prisma.monk.delete({ where: { id: req.params.id } }); res.json({ message: 'Monk profile deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
