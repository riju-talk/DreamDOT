const { PrismaClient } = require('@prisma/client');

const prismaCommunity = global.__dreamdot_prismaCommunity || new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  global.__dreamdot_prismaCommunity = prismaCommunity;
}

module.exports = { prismaCommunity };
