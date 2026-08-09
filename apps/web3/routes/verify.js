const express = require('express');
const router = express.Router();

/**
 * GET /verify/:tokenId
 * NOT IMPLEMENTED — see routes/mint.js and README.md for what's blocking this.
 */
router.get('/:tokenId', async (req, res) => {
  res.status(501).json({
    error: 'On-chain verification not implemented',
    detail: 'Requires the same chain/contract decision as minting — see apps/web3/README.md.',
  });
});

module.exports = router;
