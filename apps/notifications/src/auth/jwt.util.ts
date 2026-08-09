import * as jwt from 'jsonwebtoken';

// Mirrors apps/chat/auth.js exactly: same JWT_SECRET, same NextAuth token shape
// ({ sub | id, email, ... }), so a token minted for chat also authenticates here.

export interface AuthTokenPayload {
  sub?: string;
  id?: string;
  email?: string;
  [key: string]: unknown;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
}

export function getUserId(payload: AuthTokenPayload): string {
  const id = payload.id || payload.sub;
  if (!id) {
    throw new Error('Token payload missing user id');
  }
  return id;
}
