const express = require('express');
const router  = express.Router();
const { listImages } = require('../services/localFileService');

router.get('/', async (req, res) => {
  try { const files = await listImages(); res.json({ files, total: files.length }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
