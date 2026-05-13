const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET /api/events — public events, optionally filtered by templeId
router.get('/', async (req, res) => {
  try {
    const { templeId } = req.query;
    const where = { status: 'published' };
    if (templeId) where.linkedTempleId = templeId;

    const events = await prisma.event.findMany({
      where,
      orderBy: { dateTime: 'asc' },
      select: {
        id: true, title: true, dateTime: true, endDateTime: true,
        eventType: true, description: true, recurring: true,
        recurringPattern: true, linkedTempleId: true,
      },
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
