const express = require('express');
const router = express.Router();
const Temple = require('../models/Temple');

// GET all temples
router.get('/', async (req, res) => {
  try {
    const temples = await Temple.find();
    res.json(temples);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET temples by state
router.get('/state/:state', async (req, res) => {
  try {
    const temples = await Temple.find({ state: req.params.state });
    res.json(temples);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single temple by ID
router.get('/:id', async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id);
    if (!temple) return res.status(404).json({ error: 'Temple not found' });
    res.json(temple);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
