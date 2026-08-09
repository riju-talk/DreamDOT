const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const mintRoutes = require('./routes/mint');
const verifyRoutes = require('./routes/verify');
const ledgerRoutes = require('./routes/ledger');
const { requireWeb3Config } = require('./middleware/configured');

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
    service: 'web3',
    configured: Boolean(process.env.RPC_URL && process.env.CONTRACT_ADDRESS_CONTENT),
    timestamp: new Date().toISOString(),
  });
});

app.use('/mint', requireWeb3Config, mintRoutes);
app.use('/verify', requireWeb3Config, verifyRoutes);
app.use('/ledger', requireWeb3Config, ledgerRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

const PORT = parseInt(process.env.PORT || '3005', 10);
app.listen(PORT, () => {
  const configured = Boolean(process.env.RPC_URL && process.env.CONTRACT_ADDRESS_CONTENT);
  console.log(`[web3] listening on :${PORT} — ${configured ? 'configured' : 'NOT CONFIGURED (see README.md)'}`);
});
