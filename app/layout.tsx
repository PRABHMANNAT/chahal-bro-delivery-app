import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AppProviders } from '../providers/app-providers';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Chahal Bros',
  description: 'Chahal Bros grocery delivery app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className} bg-[#F5F7FA] text-[#1A1A2E] antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
