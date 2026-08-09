const express = require('express');
const router = express.Router();

/**
 * POST /mint
 * Body: { itemId, ownerAddress }
 *
 * NOT IMPLEMENTED. This is a real route shape, not real logic — writing the
 * actual ethers.js contract call here before a chain is chosen and a contract
 * is deployed would mean guessing at an ABI nobody has reviewed. See README.md
 * for exactly what has to happen before this can be filled in.
 */
router.post('/', async (req, res) => {
  res.status(501).json({
    error: 'Minting not implemented',
    detail: 'Requires: chain decision (Polygon vs Base), deployed ERC-721/1155 contract, and the ethers.js dependency added deliberately once the target chain is known.',
  });
});

module.exports = router;
