import { PrismaClient } from '../generated/user';

const globalForPrisma = global as unknown as { prismaUser: PrismaClient };

export const prismaUser =
  globalForPrisma.prismaUser ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.POSTGRESS_DB_USER || 'postgresql://postgres:postgres@localhost:5432/dreamdot_user?schema=user_d',
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaUser = prismaUser;
