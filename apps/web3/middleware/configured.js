/**
 * Nothing in this service can run without a chain decision. See README.md —
 * this isn't a credentials gap like apps/meta, it's an open architecture
 * decision (which chain, which RPC provider, whether contracts even exist
 * yet) that only the product owner can make.
 */
function requireWeb3Config(req, res, next) {
  if (!process.env.RPC_URL || !process.env.CONTRACT_ADDRESS_CONTENT || !process.env.CHAIN_ID) {
    return res.status(503).json({
      error: 'Web3 service is not configured',
      code: 'WEB3_NOT_CONFIGURED',
      detail: 'RPC_URL, CHAIN_ID, and CONTRACT_ADDRESS_CONTENT must be set — a chain and deployed contracts are required first. See apps/web3/README.md.',
    });
  }
  next();
}

module.exports = { requireWeb3Config };
