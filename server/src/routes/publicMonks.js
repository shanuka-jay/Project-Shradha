const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET /api/monks  — list all published monks (public)
router.get('/', async (req, res) => {
  try {
    const monks = await prisma.monk.findMany({
      where: { status: 'published' },
      include: { temple: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ monks, total: monks.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/monks/:id  — single monk by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const monk = await prisma.monk.findUnique({
      where: { id: req.params.id },
      include: { temple: { select: { id: true, name: true } } },
    });
    if (!monk || monk.status !== 'published') {
      return res.status(404).json({ error: 'Monk not found' });
    }
    res.json(monk);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
