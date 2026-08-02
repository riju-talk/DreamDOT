import { PrismaClient } from '../generated/community';

const globalForPrisma = global as unknown as { prismaCommunity: PrismaClient };

export const prismaCommunity =
  globalForPrisma.prismaCommunity ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.POSTGRESS_DB_COMMUNITY || 'postgresql://postgres:postgres@localhost:5432/dreamdot_community?schema=community',
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaCommunity = prismaCommunity;
