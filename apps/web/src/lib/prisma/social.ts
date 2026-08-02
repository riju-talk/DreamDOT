import { PrismaClient } from '../../generated/social';

const globalForPrisma = global as unknown as { prismaSocial: PrismaClient };

export const prismaSocial =
  globalForPrisma.prismaSocial ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.POSTGRESS_DB_SOCIAL || 'postgresql://postgres:postgres@localhost:5432/dreamdot_social?schema=social',
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaSocial = prismaSocial;
