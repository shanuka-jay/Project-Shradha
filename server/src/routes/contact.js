const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const submission = new Contact({ name, email, message });
    await submission.save();
    res.status(201).json({ message: 'Message received!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
