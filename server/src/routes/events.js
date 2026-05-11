const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { requireAdmin } = require('../middleware/auth');

// GET /api/admin/events
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, type, temple } = req.query;
    const where = {};
    if (status) where.status = status;
    if (type) where.eventType = type;
    if (temple) where.linkedTempleId = temple;
    if (search) where.title = { contains: search, mode: 'insensitive' };
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: { temple: { select: { id: true, name: true } } },
        skip: (page - 1) * Number(limit),
        take: Number(limit),
        orderBy: { dateTime: 'desc' },
      }),
      prisma.event.count({ where }),
    ]);
    res.json({ events, total, page: Number(page), limit: Number(limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/events/:id
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: { temple: { select: { id: true, name: true } } },
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/admin/events
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { title, dateTime, endDateTime, eventType, description, linkedTempleId,
      recurring, recurringPattern, status } = req.body;
    const event = await prisma.event.create({
      data: { title, dateTime: new Date(dateTime),
        endDateTime: endDateTime ? new Date(endDateTime) : null,
        eventType, description, linkedTempleId: linkedTempleId || null,
        recurring: recurring || false, recurringPattern,
        status: status || 'published' },
    });
    res.status(201).json(event);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/admin/events/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { title, dateTime, endDateTime, eventType, description, linkedTempleId,
      recurring, recurringPattern, status } = req.body;
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: { title, dateTime: new Date(dateTime),
        endDateTime: endDateTime ? new Date(endDateTime) : null,
        eventType, description, linkedTempleId: linkedTempleId || null,
        recurring: recurring || false, recurringPattern, status },
    });
    res.json(event);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/admin/events/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ message: 'Event deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
