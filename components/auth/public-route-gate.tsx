'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDashboardPath, useAuth } from '../../providers/auth-provider';

export function PublicRouteGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isHydrated, role } = useAuth();

  useEffect(() => {
    if (!isHydrated || !role) {
      return;
    }

    router.replace(getDashboardPath(role));
  }, [isHydrated, role, router]);

  if (!isHydrated || role) {
    return <div className="min-h-screen bg-[#F5F7FA]" />;
  }

  return <>{children}</>;
}
