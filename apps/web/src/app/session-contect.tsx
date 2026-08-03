'use client';

import React, { useEffect, useState } from 'react';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return children;
  }

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
