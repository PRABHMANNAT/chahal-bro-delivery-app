'use client';

import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './auth-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '18px',
            background: '#1A1A2E',
            color: '#fff',
            padding: '12px 16px',
            fontWeight: 700,
          },
        }}
      />
    </AuthProvider>
  );
}
