import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

/**
 * Guards the internal ingestion endpoint — called by other DreamDOT services
 * (web API routes, chat, payment), never directly by a browser. Reuses the
 * SERVICE_SECRET convention already present in apps/web/.env.
 */
@Injectable()
export class ServiceAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const secret = req.headers['x-service-secret'];
    const expected = process.env.SERVICE_SECRET;

    if (!expected || secret !== expected) {
      throw new UnauthorizedException('Invalid service secret');
    }
    return true;
  }
}
