import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { getUserId, verifyAuthToken } from './jwt.util';

/**
 * Guards REST endpoints called directly by a signed-in user's browser session.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Access token required');
    }

    try {
      const payload = verifyAuthToken(token);
      req.userId = getUserId(payload);
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
