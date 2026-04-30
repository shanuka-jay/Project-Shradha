const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET all temples
router.get('/', async (req, res) => {
  try {
    const temples = await prisma.temple.findMany();
    res.json(temples);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET temples by state  e.g. /api/temples/state/California
router.get('/state/:state', async (req, res) => {
  try {
    const temples = await prisma.temple.findMany({
      where: { state: req.params.state },
    });
    res.json(temples);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single temple by ID  e.g. /api/temples/123abc
router.get('/:id', async (req, res) => {
  try {
    const temple = await prisma.temple.findUnique({
      where: { id: req.params.id },
    });
    if (!temple) return res.status(404).json({ error: 'Temple not found' });
    res.json(temple);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new temple (admin use)
router.post('/', async (req, res) => {
  try {
    const { name, state, address, history, images, lat, lng } = req.body;
    const temple = await prisma.temple.create({
      data: { name, state, address, history, images, lat, lng },
    });
    res.status(201).json(temple);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
