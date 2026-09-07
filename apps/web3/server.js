const path = require('path');
const fs = require('fs');

// Local dev convenience: load the repo-root .env if it happens to exist.
// In a container / on a PaaS this file won't be present and real env vars are
// supplied by the platform — that's expected, not an error.
const rootEnv = path.resolve(__dirname, '../../.env');
if (fs.existsSync(rootEnv)) {
  require('dotenv').config({ path: rootEnv });
}

const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');

const { connectToDatabase, disconnectDatabase } = require('@repo/database-mongo');
const { isConfigured, CHAIN_ID } = require('./lib/chain');
const ledgerRoutes = require('./routes/ledger');

const app = express();
const server = http.createServer(app);

app.use(helmet());
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || 'http://localhost:5000').split(','),
    credentials: true,
  })
);
app.use(express.json({ limit: '256kb' }));
app.set('trust proxy', 1);

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'web3',
    configured: isConfigured(),
    chainId: CHAIN_ID,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/ledger', ledgerRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found`, code: 'NOT_FOUND' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[web3] express error:', err);
  res.status(500).json({ error: err.message || 'Internal server error', code: 'INTERNAL' });
});

const PORT = parseInt(process.env.PORT || '3005', 10);
const HOST = process.env.HOST || '0.0.0.0';

const shutdown = (signal) => {
  console.log(`[web3] received ${signal} — shutting down`);
  server.close(async () => {
    try {
      await disconnectDatabase();
    } catch (err) {
      console.error('[web3] error closing DB:', err.message);
    }
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => console.error('[web3] unhandledRejection:', reason));
process.on('uncaughtException', (err) => {
  console.error('[web3] uncaughtException:', err);
  process.exit(1);
});

(async () => {
  try {
    await connectToDatabase(process.env.MONGODB_URI || process.env.MONGO_CLUSTER);
    if (!process.env.SERVICE_SECRET) {
      console.warn('[web3] SERVICE_SECRET is not set — /ledger routes will reject every request');
    }
    server.listen(PORT, HOST, () => {
      console.log(`[web3] listening on ${HOST}:${PORT} — chain ${isConfigured() ? `configured (${CHAIN_ID})` : 'NOT configured (local-only mode)'}`);
    });
  } catch (error) {
    console.error('[web3] failed to start:', error);
    process.exit(1);
  }
})();

module.exports = { app, server };
