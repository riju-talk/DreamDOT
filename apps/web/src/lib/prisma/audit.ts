import { PrismaClient } from '../generated/audit';

const globalForPrisma = global as unknown as { prismaAudit: PrismaClient };

export const prismaAudit =
  globalForPrisma.prismaAudit ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.POSTGRESS_DB_AUDIT || 'postgresql://postgres:postgres@localhost:5432/dreamdot_audit?schema=audit',
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaAudit = prismaAudit;
