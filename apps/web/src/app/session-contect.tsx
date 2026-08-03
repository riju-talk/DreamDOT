'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

interface SessionContextProviderProps {
  session?: Session | null;
  children: React.ReactNode;
}

/**
 * Wraps your app in NextAuth's SessionProvider.
 * Must be a client component.
 */
export function SessionContextProvider({
  session,
  children,
}: SessionContextProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
