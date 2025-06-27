const express = require('express');

const emojis = require('./emojis');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);

module.exports = router;

router.get('/validate-email', (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Missing email parameter' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  res.json({
    email,
    isValid,
    message: isValid ? '✅ Valid email format' : '❌ Invalid email format'
  });
});
