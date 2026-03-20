'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock3, House, Navigation, User } from 'lucide-react';

const navItems = [
  { href: '/delivery', label: 'Home', icon: House, match: '/delivery' },
  { href: '/delivery/active', label: 'Active', icon: Navigation, match: '/delivery/active' },
  { href: '/delivery/history', label: 'History', icon: Clock3, match: '/delivery/history' },
  { href: '/delivery/profile', label: 'Profile', icon: User, match: '/delivery/profile' },
];

export function DeliveryBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 border-t border-gray-200 bg-white/96 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur-xl sm:px-5">
      <div className="flex items-center gap-1 rounded-[24px] bg-[#F8FAFC] p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.match}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 transition ${
                isActive ? 'text-[#CC2222]' : 'text-[#94A3B8]'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-[#CC2222]' : 'text-[#94A3B8]'}`} />
              <span className="text-[11px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
