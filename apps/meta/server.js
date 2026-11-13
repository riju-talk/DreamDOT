const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const oauthRoutes = require('./routes/oauth');
const broadcastRoutes = require('./routes/broadcast');
const adsRoutes = require('./routes/ads');
const { requireMetaCredentials } = require('./middleware/configured');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || 'http://localhost:5000').split(','),
    credentials: true,
  })
);
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'meta',
    configured: Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET),
    timestamp: new Date().toISOString(),
  });
});

// Every route below is real, but guarded — none of it can do anything useful
// until META_APP_ID/META_APP_SECRET exist. See README.md.
app.use('/oauth', requireMetaCredentials, oauthRoutes);
app.use('/broadcast', requireMetaCredentials, broadcastRoutes);
app.use('/ads', requireMetaCredentials, adsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

const PORT = parseInt(process.env.PORT || '3004', 10);
app.listen(PORT, () => {
  const configured = Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET);
  console.log(`[meta] listening on :${PORT} — ${configured ? 'credentials configured' : 'NOT CONFIGURED (see README.md)'}`);
});
