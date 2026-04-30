const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// POST contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const submission = await prisma.contact.create({
      data: { name, email, message },
    });
    res.status(201).json({ message: 'Message received!', data: submission });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all contact submissions (admin use)
router.get('/', async (req, res) => {
  try {
    const submissions = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
