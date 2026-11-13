import { PrismaClient } from '../generated/items';

const globalForPrisma = global as unknown as { prismaItems: PrismaClient };

export const prismaItems =
  globalForPrisma.prismaItems ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.POSTGRESS_DB_ITEMS || 'postgresql://postgres:postgres@localhost:5432/dreamdot_item?schema=items_d',
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaItems = prismaItems;
