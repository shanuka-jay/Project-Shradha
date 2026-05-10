const express = require('express');
const router = express.Router();
const Temple = require('../models/Temple');

const publicTempleQuery = {
  $or: [
    { status: 'published' },
    { status: { $exists: false } },
  ],
  mapVisible: { $ne: false },
};

// GET all temples
router.get('/', async (req, res) => {
  try {
    const temples = await Temple.find(publicTempleQuery).sort({ state: 1, name: 1 }).lean();
    res.json(temples);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET temples by state
router.get('/state/:state', async (req, res) => {
  try {
    const stateNames = req.params.state === 'District of Columbia'
      ? ['District of Columbia', 'DC', 'D.C.']
      : [req.params.state];
    const temples = await Temple.find({
      ...publicTempleQuery,
      state: { $in: stateNames },
    }).sort({ name: 1 }).lean();
    res.json(temples);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single temple by ID
router.get('/:id', async (req, res) => {
  try {
    const temple = await Temple.findOne({
      _id: req.params.id,
      ...publicTempleQuery,
    }).lean();
    if (!temple) return res.status(404).json({ error: 'Temple not found' });
    res.json(temple);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
