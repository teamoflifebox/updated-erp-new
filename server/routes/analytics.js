const express = require('express');
const router = express.Router();

// Get analytics data
router.get('/', (req, res) => {
  res.json({
    message: 'Analytics endpoint',
    data: []
  });
});

// Post analytics data
router.post('/', (req, res) => {
  res.json({
    message: 'Analytics data received',
    success: true
  });
});

module.exports = router;