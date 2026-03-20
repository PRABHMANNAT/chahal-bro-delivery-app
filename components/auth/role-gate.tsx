'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDashboardPath, useAuth } from '../../providers/auth-provider';
import type { UserRole } from '../../types';

export function RoleGate({
  expectedRole,
  children,
}: {
  expectedRole: UserRole;
  children: ReactNode;
}) {
  const router = useRouter();
  const { isHydrated, role, loginAs } = useAuth();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!role) {
      if (expectedRole === 'customer') {
        router.replace('/login');
        return;
      }

      loginAs(expectedRole);
      return;
    }

    if (role !== expectedRole) {
      router.replace(getDashboardPath(role));
    }
  }, [expectedRole, isHydrated, loginAs, role, router]);

  if (!isHydrated || role !== expectedRole) {
    return <div className="min-h-screen bg-[#F5F7FA]" />;
  }

  return <>{children}</>;
}
