const dns = require('node:dns').promises;
const express = require('express');

const emojis = require('./emojis');

const router = express.Router();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.get('/', (req, res) => {
  res.json({
    message: 'Email Domain Verifier API',
  });
});

router.use('/emojis', emojis);

router.get('/validate-email', async (req, res, next) => {
  const email = String(req.query.email || '').trim();

  if (!email) {
    return res.status(400).json({ success: false, error: 'Missing email parameter' });
  }

  if (!emailRegex.test(email)) {
    return res.json({
      email,
      formatValid: false,
      domainHasMx: false,
      isValid: false,
      mxRecords: [],
      message: 'Invalid email format',
    });
  }

  const domain = email.slice(email.lastIndexOf('@') + 1).toLowerCase();
  try {
    const records = await dns.resolveMx(domain);
    const mxRecords = records
      .sort((left, right) => left.priority - right.priority)
      .map(({ exchange, priority }) => ({ exchange, priority }));
    const domainHasMx = mxRecords.length > 0;

    return res.json({
      email,
      domain,
      formatValid: true,
      domainHasMx,
      isValid: domainHasMx,
      mxRecords,
      message: domainHasMx ? 'Valid format and MX records found' : 'Domain has no MX records',
    });
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      return res.json({
        email,
        domain,
        formatValid: true,
        domainHasMx: false,
        isValid: false,
        mxRecords: [],
        message: 'Domain has no MX records',
      });
    }
    return next(error);
  }
});

module.exports = router;
